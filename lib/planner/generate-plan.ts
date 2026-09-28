/**
 * Deterministic study-plan generator.
 *
 * Algorithm: weighted round-robin across selected books, with residual
 * accumulators that persist across days. Saturdays always get exactly one
 * practice-test assignment and never consume chapter rotation. When all
 * chapters are exhausted, remaining available days get alternating review /
 * mistake-review sessions.
 */

import {
  CHAPTER_INSTRUCTIONS,
  MISTAKE_REVIEW_INSTRUCTIONS,
  PLAN_GENERATION_VERSION,
  PRACTICE_TEST_INSTRUCTIONS,
  REVIEW_INSTRUCTIONS,
} from "@/lib/planner/config";
import { calculateWeights, renormalizeWeights } from "@/lib/planner/calculate-weights";
import {
  eachIsoDateInclusive,
  isSaturday,
  weekdayOfIsoDate,
} from "@/lib/planner/dates";
import type {
  BookCategory,
  DayAvailability,
  GeneratedAssignment,
  GeneratedPlan,
  PlanGeneratorInput,
  PlannerBook,
  PlannerChapter,
  Weekday,
} from "@/lib/planner/types";
import { SATURDAY } from "@/lib/planner/types";

type BookState = {
  book: PlannerBook;
  category: BookCategory;
  nextChapterIndex: number;
};

function availabilityMap(
  availability: readonly DayAvailability[]
): Map<Weekday, DayAvailability> {
  return new Map(availability.map((d) => [d.weekday, d]));
}

function pickNextCategory(
  activeCategories: BookCategory[],
  weights: Record<BookCategory, number>,
  residual: Record<BookCategory, number>
): BookCategory {
  // Classic weighted RR: add weight each turn, pick max residual, subtract
  // the sum of active weights from the winner.
  for (const c of activeCategories) {
    residual[c] = (residual[c] ?? 0) + (weights[c] ?? 0);
  }
  let best = activeCategories[0]!;
  let bestScore = residual[best] ?? 0;
  for (let i = 1; i < activeCategories.length; i++) {
    const c = activeCategories[i]!;
    const score = residual[c] ?? 0;
    // Deterministic tie-break: earlier in activeCategories wins only if
    // score is strictly greater — we keep insertion order (math, grammar,
    // reading) by using >= and only replacing on greater.
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  const total = activeCategories.reduce((s, c) => s + (weights[c] ?? 0), 0);
  residual[best] = (residual[best] ?? 0) - total;
  return best;
}

function nextChapter(state: BookState): PlannerChapter | null {
  if (state.nextChapterIndex >= state.book.chapters.length) return null;
  const chapter = state.book.chapters[state.nextChapterIndex]!;
  state.nextChapterIndex += 1;
  return chapter;
}

function activeCategories(states: Map<BookCategory, BookState>): BookCategory[] {
  const out: BookCategory[] = [];
  for (const category of ["math", "grammar", "reading"] as BookCategory[]) {
    const state = states.get(category);
    if (!state) continue;
    if (state.nextChapterIndex < state.book.chapters.length) {
      out.push(category);
    }
  }
  return out;
}

/**
 * Generate a full plan. Same inputs always produce the same assignments.
 * Assignments are never created for dates after `testDate`.
 */
export function generatePlan(input: PlanGeneratorInput): GeneratedPlan {
  if (input.planStartDate > input.testDate) {
    throw new Error("Plan start date must be on or before the test date.");
  }
  if (input.selectedBooks.length === 0) {
    throw new Error("At least one book must be selected.");
  }

  const avail = availabilityMap(input.availability);
  const dates = eachIsoDateInclusive(input.planStartDate, input.testDate);

  const states = new Map<BookCategory, BookState>();
  for (const book of input.selectedBooks) {
    // One book per category in the rotation. If duplicates appear, keep first.
    if (states.has(book.category)) continue;
    const chapters = [...book.chapters].sort(
      (a, b) => a.chapterNumber - b.chapterNumber
    );
    states.set(book.category, {
      book: { ...book, chapters },
      category: book.category,
      nextChapterIndex: 0,
    });
  }

  let weights: Record<BookCategory, number> = {
    math: 0,
    grammar: 0,
    reading: 0,
    ...input.weights,
  };
  // Ensure weights cover selected categories; fill from calculator if missing.
  const selectedCategories = [...states.keys()];
  const weightSum = selectedCategories.reduce((s, c) => s + (weights[c] ?? 0), 0);
  if (weightSum <= 0) {
    weights = calculateWeights({
      currentMathScore: input.currentMathScore,
      currentRwScore: input.currentRwScore,
      targetTotalScore: input.targetTotalScore,
      includedCategories: selectedCategories,
    });
  } else {
    weights = renormalizeWeights(weights, selectedCategories);
  }

  const residual: Record<BookCategory, number> = {
    math: 0,
    grammar: 0,
    reading: 0,
  };

  const assignments: GeneratedAssignment[] = [];
  let chaptersScheduled = 0;
  let practiceTestsScheduled = 0;
  let reviewSessionsScheduled = 0;
  let reviewToggle = 0;

  const chaptersSelected = [...states.values()].reduce(
    (sum, s) => sum + s.book.chapters.length,
    0
  );

  for (const date of dates) {
    // The real SAT day never receives plan work.
    if (date === input.testDate) continue;

    const weekday = weekdayOfIsoDate(date);

    if (weekday === SATURDAY || isSaturday(date)) {
      // Every Saturday strictly before the SAT date is a practice-test day.
      assignments.push({
        assignmentDate: date,
        assignmentType: "practice_test",
        bookId: null,
        chapterId: null,
        sequenceOnDay: 1,
        title: "Full SAT Practice Test",
        instructions: PRACTICE_TEST_INSTRUCTIONS,
        estimatedMinutes: 180,
      });
      practiceTestsScheduled += 1;
      continue;
    }

    const day = avail.get(weekday);
    if (!day || !day.available || day.studyHours <= 0) {
      continue;
    }

    const hours = day.studyHours;
    for (let slot = 0; slot < hours; slot++) {
      const active = activeCategories(states);
      if (active.length === 0) {
        // Exhausted — structured review / mistake-review.
        const isMistake = reviewToggle % 2 === 1;
        reviewToggle += 1;
        assignments.push({
          assignmentDate: date,
          assignmentType: isMistake ? "mistake_review" : "review",
          bookId: null,
          chapterId: null,
          sequenceOnDay: slot + 1,
          title: isMistake ? "Mistake Journal Review" : "Structured Review",
          instructions: isMistake
            ? MISTAKE_REVIEW_INSTRUCTIONS
            : REVIEW_INSTRUCTIONS,
          estimatedMinutes: 60,
        });
        reviewSessionsScheduled += 1;
        continue;
      }

      // Drop exhausted categories from weights when the active set shrinks.
      const weightCategories = Object.entries(weights)
        .filter(([, w]) => w > 0)
        .map(([c]) => c as BookCategory);
      if (
        active.length !== weightCategories.length ||
        active.some((c) => !weightCategories.includes(c))
      ) {
        weights = renormalizeWeights(weights, active);
        for (const c of ["math", "grammar", "reading"] as BookCategory[]) {
          if (!active.includes(c)) residual[c] = 0;
        }
      }

      const category = pickNextCategory(active, weights, residual);
      const state = states.get(category)!;
      const chapter = nextChapter(state);
      if (!chapter) {
        // Shouldn't happen — activeCategories already filtered — but be safe.
        slot -= 1;
        continue;
      }

      assignments.push({
        assignmentDate: date,
        assignmentType: "chapter",
        bookId: state.book.id,
        chapterId: chapter.id,
        sequenceOnDay: slot + 1,
        title: `${state.book.title} — Ch. ${chapter.chapterNumber}: ${chapter.title}`,
        instructions: CHAPTER_INSTRUCTIONS,
        estimatedMinutes: chapter.estimatedMinutes || 60,
      });
      chaptersScheduled += 1;
    }
  }

  const configurationSnapshot = {
    generationVersion: PLAN_GENERATION_VERSION,
    planStartDate: input.planStartDate,
    testDate: input.testDate,
    timezone: input.timezone,
    currentMathScore: input.currentMathScore,
    currentRwScore: input.currentRwScore,
    targetTotalScore: input.targetTotalScore,
    availability: input.availability,
    selectedBookIds: input.selectedBooks.map((b) => b.id),
    weights,
  };

  return {
    startsOn: input.planStartDate,
    testDate: input.testDate,
    generationVersion: PLAN_GENERATION_VERSION,
    assignments,
    chaptersScheduled,
    chaptersSelected,
    practiceTestsScheduled,
    reviewSessionsScheduled,
    cannotFinishAllChapters: chaptersScheduled < chaptersSelected,
    configurationSnapshot,
  };
}
