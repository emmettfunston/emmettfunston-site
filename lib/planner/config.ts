/**
 * Typed rule configuration for book recommendations and chapter weighting.
 * Keep thresholds here — not scattered through recommend/weight functions.
 */

import type { BookCategory } from "@/lib/planner/types";

export const PLAN_GENERATION_VERSION = 1;

export const CHAPTER_INSTRUCTIONS =
  "Read the full chapter, complete every practice problem, review your answers, and log relevant mistakes.";

export const PRACTICE_TEST_INSTRUCTIONS =
  "Take one complete SAT practice exam, score the exam, record total / Math / Reading & Writing scores, log incorrect and uncertain questions, and review your mistakes.";

export const REVIEW_INSTRUCTIONS =
  "Structured review: revisit weak topics from your completed chapters and rework problems you previously missed.";

export const MISTAKE_REVIEW_INSTRUCTIONS =
  "Open your mistake journal. Retry flagged questions, rewrite the correct reasoning, and confirm the rule to remember.";

/** Base chapter-slot weights when Math, Grammar, and Reading are all included. */
export const BASE_BOOK_WEIGHTS: Readonly<Record<BookCategory, number>> = {
  math: 0.45,
  grammar: 0.35,
  reading: 0.2,
};

/**
 * Recommendation thresholds.
 *
 * Targets ≥ HIGH_TARGET strongly recommend every section still below 800.
 * Below that, high subscores can soften a book to optional reinforcement
 * without hiding it.
 */
export const RECOMMENDATION_CONFIG = {
  /** Target total at/above which every non-perfect section is highly recommended. */
  highTargetTotal: 1550,
  /** Math at/above this (for targets below highTarget) softens Math to optional. */
  mathOptionalAtOrAbove: 750,
  /** R&W at/above this (for targets below highTarget) softens Grammar + Reading. */
  rwOptionalAtOrAbove: 700,
  perfectSectionScore: 800,
} as const;

/**
 * Weighting deficit references.
 *
 * Math deficit: 800 − current Math.
 * For a 1500 total goal the R&W reference is 700; we scale that reference
 * proportionally with the student's target total.
 */
export const WEIGHTING_CONFIG = {
  mathReference: 800,
  /** R&W section reference used when target total is 1500. */
  rwReferenceAt1500: 700,
  rwReferenceTotal: 1500,
  /**
   * How the R&W deficit is split between Grammar and Reading after the base
   * weights are applied. Grammar always receives the larger share.
   */
  rwDeficitToGrammarShare: 0.65,
  rwDeficitToReadingShare: 0.35,
  /** Cap on how far deficit boosts can push a category before renormalization. */
  maxDeficitBoost: 0.35,
} as const;

/** Stable category order for rotation / display (Math → Grammar → Reading). */
export const CATEGORY_PRIORITY: readonly BookCategory[] = [
  "math",
  "grammar",
  "reading",
];
