/**
 * Structural validation for generated plans. Used by tests and as a
 * server-side sanity check before persistence.
 */

import { isSaturday, weekdayOfIsoDate } from "@/lib/planner/dates";
import type {
  DayAvailability,
  GeneratedAssignment,
  GeneratedPlan,
  Weekday,
} from "@/lib/planner/types";
import { SATURDAY } from "@/lib/planner/types";

export type PlanValidationIssue = {
  code: string;
  message: string;
};

export type PlanValidationResult = {
  ok: boolean;
  issues: PlanValidationIssue[];
};

function availMap(
  availability: readonly DayAvailability[]
): Map<Weekday, DayAvailability> {
  return new Map(availability.map((d) => [d.weekday, d]));
}

export function validateGeneratedPlan(args: {
  plan: GeneratedPlan;
  availability: readonly DayAvailability[];
  planStartDate: string;
  testDate: string;
}): PlanValidationResult {
  const issues: PlanValidationIssue[] = [];
  const { plan, availability, planStartDate, testDate } = args;
  const avail = availMap(availability);

  const chapterIds = new Set<string>();
  const chapterOrder = new Map<string, number[]>();

  for (const a of plan.assignments) {
    if (a.assignmentDate < planStartDate || a.assignmentDate > testDate) {
      issues.push({
        code: "date_out_of_range",
        message: `Assignment on ${a.assignmentDate} is outside the plan window.`,
      });
    }

    if (a.assignmentDate === testDate && a.assignmentType !== "practice_test") {
      // Allowed only if test date is a study day — but never after test date.
      // Assignments ON the test date: we allow them only when date <= testDate.
    }

    if (isSaturday(a.assignmentDate)) {
      if (a.assignmentType === "chapter") {
        issues.push({
          code: "chapter_on_saturday",
          message: `Chapter assigned on Saturday ${a.assignmentDate}.`,
        });
      }
      if (a.assignmentType === "practice_test" && a.sequenceOnDay !== 1) {
        issues.push({
          code: "bad_saturday_sequence",
          message: `Practice test on ${a.assignmentDate} has sequence ${a.sequenceOnDay}.`,
        });
      }
    } else if (a.assignmentType === "practice_test") {
      issues.push({
        code: "practice_test_on_weekday",
        message: `Practice test on non-Saturday ${a.assignmentDate}.`,
      });
    }

    const weekday = weekdayOfIsoDate(a.assignmentDate) as Weekday;
    if (weekday !== SATURDAY) {
      const day = avail.get(weekday);
      if (!day?.available) {
        issues.push({
          code: "work_on_unavailable_day",
          message: `Assignment on unavailable weekday ${a.assignmentDate}.`,
        });
      }
    }

    if (a.chapterId) {
      if (chapterIds.has(a.chapterId)) {
        issues.push({
          code: "duplicate_chapter",
          message: `Chapter ${a.chapterId} scheduled more than once.`,
        });
      }
      chapterIds.add(a.chapterId);
      if (a.bookId) {
        const list = chapterOrder.get(a.bookId) ?? [];
        // Extract chapter number from title is fragile — rely on sequence of
        // appearance; caller tests check ordering with known fixtures.
        list.push(chapterIds.size);
        chapterOrder.set(a.bookId, list);
      }
    }
  }

  // Hours-per-day: for each non-Saturday date with chapter/review work, count
  // must equal studyHours (or be review fill).
  const byDate = new Map<string, GeneratedAssignment[]>();
  for (const a of plan.assignments) {
    const list = byDate.get(a.assignmentDate) ?? [];
    list.push(a);
    byDate.set(a.assignmentDate, list);
  }
  for (const [date, list] of byDate) {
    if (isSaturday(date)) {
      const tests = list.filter((a) => a.assignmentType === "practice_test");
      if (tests.length > 1) {
        issues.push({
          code: "multiple_practice_tests",
          message: `Multiple practice tests on ${date}.`,
        });
      }
      continue;
    }
    const weekday = weekdayOfIsoDate(date) as Weekday;
    const day = avail.get(weekday);
    if (!day?.available) continue;
    if (list.length !== day.studyHours) {
      issues.push({
        code: "hours_mismatch",
        message: `Expected ${day.studyHours} assignments on ${date}, found ${list.length}.`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}
