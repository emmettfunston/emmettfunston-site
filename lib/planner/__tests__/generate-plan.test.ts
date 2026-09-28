import { describe, expect, it } from "vitest";

import { calculateWeights } from "@/lib/planner/calculate-weights";
import { generatePlan } from "@/lib/planner/generate-plan";
import { validateGeneratedPlan } from "@/lib/planner/validate-plan";
import { isSaturday, weekdayOfIsoDate } from "@/lib/planner/dates";
import {
  makeAvailability,
  makeBook,
} from "@/lib/planner/__tests__/fixtures";
import {
  deriveAssignmentStatus,
  selectCatchUpAssignments,
} from "@/lib/planner/status";

function buildPlan(overrides: {
  start?: string;
  test?: string;
  math?: number;
  rw?: number;
  target?: number;
  availability?: ReturnType<typeof makeAvailability>;
  books?: ReturnType<typeof makeBook>[];
} = {}) {
  const books =
    overrides.books ??
    [makeBook("math", 10), makeBook("grammar", 8), makeBook("reading", 6)];
  const math = overrides.math ?? 580;
  const rw = overrides.rw ?? 600;
  const target = overrides.target ?? 1450;
  const weights = calculateWeights({
    currentMathScore: math,
    currentRwScore: rw,
    targetTotalScore: target,
    includedCategories: books.map((b) => b.category),
  });
  return generatePlan({
    planStartDate: overrides.start ?? "2026-08-03", // Monday
    testDate: overrides.test ?? "2026-09-12", // Saturday
    timezone: "America/Los_Angeles",
    currentMathScore: math,
    currentRwScore: rw,
    targetTotalScore: target,
    availability: overrides.availability ?? makeAvailability(),
    selectedBooks: books,
    weights,
  });
}

describe("generatePlan", () => {
  it("never assigns chapters on Saturdays", () => {
    const plan = buildPlan();
    for (const a of plan.assignments) {
      if (isSaturday(a.assignmentDate)) {
        expect(a.assignmentType).not.toBe("chapter");
      }
    }
  });

  it("schedules exactly one practice test on every eligible Saturday", () => {
    const plan = buildPlan({
      start: "2026-08-01", // Saturday
      test: "2026-08-29", // Saturday
    });
    const saturdays = plan.assignments.filter(
      (a) => a.assignmentType === "practice_test"
    );
    // Saturdays before test date: Aug 1, 8, 15, 22 → 4
    expect(saturdays).toHaveLength(4);
    expect(new Set(saturdays.map((a) => a.assignmentDate)).size).toBe(4);
    for (const a of saturdays) {
      expect(a.sequenceOnDay).toBe(1);
    }
  });

  it("assigns no work on unavailable days", () => {
    const availability = makeAvailability({
      0: { available: false, studyHours: 0 },
      3: { available: false, studyHours: 0 }, // Wednesday off
    });
    const plan = buildPlan({ availability });
    for (const a of plan.assignments) {
      if (a.assignmentType === "practice_test") continue;
      expect(weekdayOfIsoDate(a.assignmentDate)).not.toBe(0);
      expect(weekdayOfIsoDate(a.assignmentDate)).not.toBe(3);
    }
  });

  it("assigns one chapter (or review) per available hour", () => {
    const availability = makeAvailability({
      1: { available: true, studyHours: 3 },
    });
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-08-05",
      availability,
      books: [makeBook("math", 20)],
    });
    // Only Monday Aug 3 is a study day before Wed test.
    const monday = plan.assignments.filter((a) => a.assignmentDate === "2026-08-03");
    expect(monday).toHaveLength(3);
  });

  it("four hours produces four chapter assignments", () => {
    const availability = makeAvailability({
      1: { available: true, studyHours: 4 },
      2: { available: false, studyHours: 0 },
      3: { available: false, studyHours: 0 },
      4: { available: false, studyHours: 0 },
      5: { available: false, studyHours: 0 },
    });
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-08-05",
      availability,
      books: [makeBook("math", 10), makeBook("grammar", 10)],
    });
    const monday = plan.assignments.filter((a) => a.assignmentDate === "2026-08-03");
    expect(monday).toHaveLength(4);
    expect(monday.every((a) => a.assignmentType === "chapter")).toBe(true);
  });

  it("keeps chapters ordered within every book", () => {
    const plan = buildPlan({
      books: [makeBook("math", 8), makeBook("grammar", 8), makeBook("reading", 8)],
    });
    const byBook = new Map<string, number[]>();
    for (const a of plan.assignments) {
      if (a.assignmentType !== "chapter" || !a.bookId || !a.chapterId) continue;
      const n = Number(a.chapterId.split("-").at(-1));
      const list = byBook.get(a.bookId) ?? [];
      list.push(n);
      byBook.set(a.bookId, list);
    }
    for (const [, nums] of byBook) {
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]!).toBeGreaterThan(nums[i - 1]!);
      }
    }
  });

  it("can place multiple books on one day", () => {
    const availability = makeAvailability({
      1: { available: true, studyHours: 4 },
      2: { available: false, studyHours: 0 },
      3: { available: false, studyHours: 0 },
      4: { available: false, studyHours: 0 },
      5: { available: false, studyHours: 0 },
    });
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-08-05",
      availability,
      books: [makeBook("math", 5), makeBook("grammar", 5), makeBook("reading", 5)],
    });
    const mondayBooks = new Set(
      plan.assignments
        .filter((a) => a.assignmentDate === "2026-08-03" && a.bookId)
        .map((a) => a.bookId)
    );
    expect(mondayBooks.size).toBeGreaterThan(1);
  });

  it("never duplicates a chapter", () => {
    const plan = buildPlan({
      books: [makeBook("math", 5), makeBook("grammar", 5), makeBook("reading", 5)],
    });
    const ids = plan.assignments
      .map((a) => a.chapterId)
      .filter((id): id is string => id !== null);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never assigns work after the SAT date", () => {
    const plan = buildPlan({ test: "2026-08-20" });
    for (const a of plan.assignments) {
      expect(a.assignmentDate < "2026-08-20" || a.assignmentDate === "2026-08-20").toBe(
        true
      );
      expect(a.assignmentDate > "2026-08-20").toBe(false);
    }
    // And nothing ON the test date either.
    expect(plan.assignments.every((a) => a.assignmentDate !== "2026-08-20")).toBe(
      true
    );
  });

  it("gives Math and Grammar more slots than Reading when all are selected", () => {
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-10-03",
      math: 550,
      rw: 580,
      target: 1450,
      books: [makeBook("math", 40), makeBook("grammar", 40), makeBook("reading", 40)],
    });
    const counts = { math: 0, grammar: 0, reading: 0 };
    for (const a of plan.assignments) {
      if (!a.bookId) continue;
      if (a.bookId.startsWith("math")) counts.math += 1;
      if (a.bookId.startsWith("grammar")) counts.grammar += 1;
      if (a.bookId.startsWith("reading")) counts.reading += 1;
    }
    expect(counts.math).toBeGreaterThan(counts.reading);
    expect(counts.grammar).toBeGreaterThan(counts.reading);
  });

  it("drops exhausted books from the rotation and fills with review", () => {
    const availability = makeAvailability({
      1: { available: true, studyHours: 3 },
      2: { available: true, studyHours: 3 },
      3: { available: true, studyHours: 3 },
      4: { available: true, studyHours: 3 },
      5: { available: true, studyHours: 3 },
    });
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-09-12",
      availability,
      books: [makeBook("math", 2), makeBook("grammar", 2)],
    });
    expect(plan.chaptersScheduled).toBe(4);
    expect(plan.reviewSessionsScheduled).toBeGreaterThan(0);
    const chapterIds = plan.assignments
      .filter((a) => a.assignmentType === "chapter")
      .map((a) => a.chapterId);
    expect(new Set(chapterIds).size).toBe(4);
  });

  it("is deterministic for identical inputs", () => {
    const a = buildPlan();
    const b = buildPlan();
    expect(a.assignments).toEqual(b.assignments);
    expect(a.configurationSnapshot).toEqual(b.configurationSnapshot);
  });

  it("passes structural validation", () => {
    const availability = makeAvailability();
    const plan = buildPlan({ availability });
    const result = validateGeneratedPlan({
      plan,
      availability,
      planStartDate: plan.startsOn,
      testDate: plan.testDate,
    });
    expect(result.ok, JSON.stringify(result.issues, null, 2)).toBe(true);
  });
});

describe("catch-up derivation (missed work does not shift future dates)", () => {
  it("marks overdue without changing other due dates", () => {
    const plan = buildPlan({
      start: "2026-08-03",
      test: "2026-08-20",
    });
    const frozen = plan.assignments.map((a) => ({ ...a }));
    // Simulate "today" mid-plan with nothing completed.
    const today = "2026-08-12";
    const overdue = frozen.filter(
      (a) =>
        deriveAssignmentStatus({
          assignmentDate: a.assignmentDate,
          completedAt: null,
          localToday: today,
        }) === "overdue"
    );
    expect(overdue.length).toBeGreaterThan(0);
    // Future assignment dates are unchanged.
    expect(frozen.map((a) => a.assignmentDate)).toEqual(
      plan.assignments.map((a) => a.assignmentDate)
    );

    const catchUp = selectCatchUpAssignments(
      frozen.map((a, i) => ({
        id: String(i),
        assignmentDate: a.assignmentDate,
        completedAt: null as string | null,
      })),
      "UTC",
      new Date("2026-08-12T17:00:00Z")
    );
    // Oldest first.
    for (let i = 1; i < catchUp.length; i++) {
      expect(catchUp[i]!.assignmentDate >= catchUp[i - 1]!.assignmentDate).toBe(
        true
      );
    }
  });
});
