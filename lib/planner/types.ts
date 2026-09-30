/**
 * Core SAT-planner domain models.
 *
 * Pure types and pure helper functions only — no React, no Supabase, no I/O.
 * Database row types live in lib/supabase/database.types.ts; these are the
 * application-level models the planner logic operates on.
 */

import type {
  AssignmentType,
  BookCategory,
  MistakeSection,
  MistakeSourceType,
  RecommendationLevel,
  StudyPlanStatus,
} from "@/lib/supabase/database.types";

export type {
  AssignmentType,
  BookCategory,
  MistakeSection,
  MistakeSourceType,
  RecommendationLevel,
  StudyPlanStatus,
};

// ---------------------------------------------------------------------------
// SAT scores
// ---------------------------------------------------------------------------

export const SECTION_SCORE_MIN = 200;
export const SECTION_SCORE_MAX = 800;
export const TOTAL_SCORE_MIN = 400;
export const TOTAL_SCORE_MAX = 1600;
export const SCORE_STEP = 10;

/** A section (Math or Reading & Writing) score: 200–800 in steps of 10. */
export type SatSectionScore = number & { readonly __brand: "SatSectionScore" };

/** A total SAT score: 400–1600 in steps of 10. */
export type SatTotalScore = number & { readonly __brand: "SatTotalScore" };

export function isValidSectionScore(value: number): value is SatSectionScore {
  return (
    Number.isInteger(value) &&
    value >= SECTION_SCORE_MIN &&
    value <= SECTION_SCORE_MAX &&
    value % SCORE_STEP === 0
  );
}

export function isValidTotalScore(value: number): value is SatTotalScore {
  return (
    Number.isInteger(value) &&
    value >= TOTAL_SCORE_MIN &&
    value <= TOTAL_SCORE_MAX &&
    value % SCORE_STEP === 0
  );
}

/** Every legal section score, ascending — for wheel/select components. */
export const SECTION_SCORE_OPTIONS: readonly number[] = Array.from(
  { length: (SECTION_SCORE_MAX - SECTION_SCORE_MIN) / SCORE_STEP + 1 },
  (_, i) => SECTION_SCORE_MIN + i * SCORE_STEP
);

/** Every legal total score, ascending — for wheel/select components. */
export const TOTAL_SCORE_OPTIONS: readonly number[] = Array.from(
  { length: (TOTAL_SCORE_MAX - TOTAL_SCORE_MIN) / SCORE_STEP + 1 },
  (_, i) => TOTAL_SCORE_MIN + i * SCORE_STEP
);

// ---------------------------------------------------------------------------
// Weekly availability
// ---------------------------------------------------------------------------

/** JavaScript Date#getDay() numbering: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SATURDAY: Weekday = 6;
export const WEEKDAYS: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const MIN_STUDY_HOURS = 1;
export const MAX_STUDY_HOURS = 6;
export const DEFAULT_STUDY_HOURS = 1;
export const RECOMMENDED_STUDY_HOURS = 4;

/** One weekday's availability. Saturday is always practice-test-only. */
export type DayAvailability = {
  weekday: Weekday;
  available: boolean;
  /** Chapter-hours (1 hour ≈ 1 prep-book chapter). 0 when unavailable. */
  studyHours: number;
};

/** Full week, indexed by weekday. */
export type WeeklyAvailability = readonly DayAvailability[];

export function isValidDayAvailability(day: DayAvailability): boolean {
  if (day.weekday === SATURDAY) {
    // Saturday is reserved for the weekly practice test.
    return day.available === false && day.studyHours === 0;
  }
  if (!day.available) return day.studyHours === 0;
  return (
    Number.isInteger(day.studyHours) &&
    day.studyHours >= MIN_STUDY_HOURS &&
    day.studyHours <= MAX_STUDY_HOURS
  );
}

// ---------------------------------------------------------------------------
// Books and plans
// ---------------------------------------------------------------------------

export type BookRecommendation = {
  bookId: string;
  category: BookCategory;
  level: RecommendationLevel;
  reason: string;
  /** Default Include-in-My-Plan toggle. Students may override. */
  includedInPlan: boolean;
  /** Relative scheduling priority (higher = more chapter slots). */
  priorityWeight: number;
};

/** Catalog book + ordered chapters used as generator input. */
export type PlannerBook = {
  id: string;
  slug: string;
  title: string;
  category: BookCategory;
  affiliateUrl?: string | null;
  chapters: readonly PlannerChapter[];
};

export type PlannerChapter = {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  estimatedMinutes: number;
};

/** One generated assignment before persistence. */
export type GeneratedAssignment = {
  assignmentDate: string;
  assignmentType: AssignmentType;
  bookId: string | null;
  chapterId: string | null;
  sequenceOnDay: number;
  title: string;
  instructions: string;
  estimatedMinutes: number;
};

export type GeneratedPlan = {
  startsOn: string;
  testDate: string;
  generationVersion: number;
  assignments: GeneratedAssignment[];
  /** Chapters scheduled vs total chapters in selected books. */
  chaptersScheduled: number;
  chaptersSelected: number;
  practiceTestsScheduled: number;
  reviewSessionsScheduled: number;
  /** True when selected books have more chapters than available slots. */
  cannotFinishAllChapters: boolean;
  configurationSnapshot: Record<string, unknown>;
};

export type PlanGeneratorInput = {
  planStartDate: string;
  testDate: string;
  timezone: string;
  currentMathScore: number;
  currentRwScore: number;
  targetTotalScore: number;
  availability: WeeklyAvailability;
  /** Selected books with their chapters already ordered by chapterNumber. */
  selectedBooks: readonly PlannerBook[];
  /** Per-category weights for the selected books (already normalized). */
  weights: Readonly<Partial<Record<BookCategory, number>>>;
};

// ---------------------------------------------------------------------------
// Assignments — status is DERIVED, never stored.
// ---------------------------------------------------------------------------

export type AssignmentStatus = "upcoming" | "due_today" | "overdue" | "completed";

/**
 * Derive an assignment's status from its date, completion, and the student's
 * current local date. Both dates are ISO `yyyy-MM-dd` strings, which compare
 * correctly as plain strings.
 */
export function deriveAssignmentStatus(args: {
  assignmentDate: string;
  completedAt: string | null;
  localToday: string;
}): AssignmentStatus {
  if (args.completedAt !== null) return "completed";
  if (args.assignmentDate < args.localToday) return "overdue";
  if (args.assignmentDate === args.localToday) return "due_today";
  return "upcoming";
}

// ---------------------------------------------------------------------------
// Practice tests and mistakes (application-level models)
// ---------------------------------------------------------------------------

export type PracticeTestEntry = {
  testDate: string;
  testName: string;
  totalScore: SatTotalScore;
  mathScore: SatSectionScore;
  rwScore: SatSectionScore;
  mistakesReviewed: boolean;
  notes: string | null;
};

export const MISTAKE_ERROR_CATEGORIES = [
  "content_gap",
  "misread_question",
  "calculation_error",
  "timing",
  "careless_error",
  "guessed",
  "strategy_error",
] as const;

export type MistakeErrorCategory = (typeof MISTAKE_ERROR_CATEGORIES)[number];

export const MISTAKE_ERROR_CATEGORY_LABELS: Record<
  MistakeErrorCategory,
  string
> = {
  content_gap: "Content gap",
  misread_question: "Misread question",
  calculation_error: "Calculation error",
  timing: "Timing",
  careless_error: "Careless error",
  guessed: "Guessed",
  strategy_error: "Strategy error",
};

export type MistakeEntry = {
  sourceType: MistakeSourceType;
  section: MistakeSection;
  topic: string;
  questionReference: string | null;
  errorCategory: MistakeErrorCategory;
  whyError: string;
  correctReasoning: string;
  lessonToRemember: string;
  wasGuessed: boolean;
  wasRetried: boolean;
  retryCorrect: boolean | null;
};
