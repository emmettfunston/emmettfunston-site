/**
 * Book recommendation engine — pure and deterministic.
 */

import {
  BASE_BOOK_WEIGHTS,
  CATEGORY_PRIORITY,
  RECOMMENDATION_CONFIG,
} from "@/lib/planner/config";
import type {
  BookCategory,
  BookRecommendation,
  PlannerBook,
  RecommendationLevel,
} from "@/lib/planner/types";

export type RecommendBooksInput = {
  currentMathScore: number;
  currentRwScore: number;
  targetTotalScore: number;
  books: readonly PlannerBook[];
};

type CategoryDecision = {
  level: RecommendationLevel;
  reason: string;
  includedInPlan: boolean;
  priorityWeight: number;
};

function decideForCategory(
  category: BookCategory,
  math: number,
  rw: number,
  target: number
): CategoryDecision {
  const {
    highTargetTotal,
    mathOptionalAtOrAbove,
    rwOptionalAtOrAbove,
    perfectSectionScore,
  } = RECOMMENDATION_CONFIG;

  const baseWeight = BASE_BOOK_WEIGHTS[category];

  if (target >= highTargetTotal) {
    if (category === "math") {
      if (math >= perfectSectionScore) {
        return {
          level: "optional",
          reason:
            "Math is already at 800. Keep the Math book as optional reinforcement only.",
          includedInPlan: false,
          priorityWeight: baseWeight * 0.25,
        };
      }
      return {
        level: "highly_recommended",
        reason: `A ${target}+ target needs strong Math work — the Math book is highly recommended.`,
        includedInPlan: true,
        priorityWeight: baseWeight,
      };
    }

    // Grammar + Reading share the R&W section score.
    if (rw >= perfectSectionScore) {
      return {
        level: "optional",
        reason:
          "Reading & Writing is already at 800. This book is optional reinforcement only.",
        includedInPlan: false,
        priorityWeight: baseWeight * 0.25,
      };
    }
    const label = category === "grammar" ? "Grammar" : "Reading";
    return {
      level: "highly_recommended",
      reason: `A ${target}+ target needs meaningful ${label} work unless that section is perfect.`,
      includedInPlan: true,
      priorityWeight:
        category === "grammar" ? baseWeight : baseWeight * 0.9,
    };
  }

  // Targets below highTargetTotal.
  if (category === "math") {
    if (math >= perfectSectionScore) {
      return {
        level: "optional",
        reason: "Math is already at 800 — include only if you want extra drills.",
        includedInPlan: false,
        priorityWeight: baseWeight * 0.2,
      };
    }
    if (math >= mathOptionalAtOrAbove) {
      return {
        level: "optional",
        reason: `Math is already ${math}. The Math book is optional reinforcement — still available if you want margin.`,
        includedInPlan: true,
        priorityWeight: baseWeight * 0.55,
      };
    }
    if (math < 600) {
      return {
        level: "highly_recommended",
        reason: `Math at ${math} is the biggest lever for a ${target} goal.`,
        includedInPlan: true,
        priorityWeight: baseWeight * 1.1,
      };
    }
    return {
      level: "recommended",
      reason: `Math at ${math} still has room toward ${target}. Keep the Math book in your plan.`,
      includedInPlan: true,
      priorityWeight: baseWeight,
    };
  }

  if (category === "grammar") {
    if (rw >= perfectSectionScore) {
      return {
        level: "optional",
        reason: "Reading & Writing is at 800 — Grammar is optional reinforcement.",
        includedInPlan: false,
        priorityWeight: baseWeight * 0.2,
      };
    }
    if (rw >= rwOptionalAtOrAbove) {
      return {
        level: "optional",
        reason: `Reading & Writing is already ${rw}. Grammar is optional reinforcement, but still the higher-priority R&W book.`,
        includedInPlan: true,
        priorityWeight: baseWeight * 0.6,
      };
    }
    if (rw < 600) {
      return {
        level: "highly_recommended",
        reason: `Reading & Writing at ${rw} needs focused Grammar work first.`,
        includedInPlan: true,
        priorityWeight: baseWeight * 1.1,
      };
    }
    return {
      level: "recommended",
      reason:
        "Grammar usually yields faster Reading & Writing gains than Reading alone.",
      includedInPlan: true,
      priorityWeight: baseWeight,
    };
  }

  // Reading
  if (rw >= perfectSectionScore) {
    return {
      level: "optional",
      reason: "Reading & Writing is at 800 — Reading is optional reinforcement.",
      includedInPlan: false,
      priorityWeight: baseWeight * 0.2,
    };
  }
  if (rw >= rwOptionalAtOrAbove) {
    return {
      level: "optional",
      reason: `Reading & Writing is already ${rw}. Reading is optional reinforcement behind Grammar.`,
      includedInPlan: true,
      priorityWeight: baseWeight * 0.5,
    };
  }
  if (rw < 600) {
    return {
      level: "recommended",
      reason:
        "Reading supports your R&W goal, but Grammar should take the larger share of study time.",
      includedInPlan: true,
      priorityWeight: baseWeight,
    };
  }
  return {
    level: "recommended",
    reason: "Reading rounds out a balanced plan behind Math and Grammar.",
    includedInPlan: true,
    priorityWeight: baseWeight,
  };
}

/**
 * Produce a recommendation for every active catalog book.
 * Always returns all three categories when present — never auto-hides a book
 * solely for a high (but non-perfect) subscore.
 */
export function recommendBooks(input: RecommendBooksInput): BookRecommendation[] {
  const byCategory = new Map<BookCategory, PlannerBook>();
  for (const book of input.books) {
    if (!byCategory.has(book.category)) {
      byCategory.set(book.category, book);
    }
  }

  const results: BookRecommendation[] = [];
  for (const category of CATEGORY_PRIORITY) {
    const book = byCategory.get(category);
    if (!book) continue;
    const decision = decideForCategory(
      category,
      input.currentMathScore,
      input.currentRwScore,
      input.targetTotalScore
    );
    results.push({
      bookId: book.id,
      category,
      level: decision.level,
      reason: decision.reason,
      includedInPlan: decision.includedInPlan,
      priorityWeight: decision.priorityWeight,
    });
  }
  return results;
}
