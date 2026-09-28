import { z } from "zod";

import {
  isValidDayAvailability,
  isValidSectionScore,
  isValidTotalScore,
  MAX_STUDY_HOURS,
  MIN_STUDY_HOURS,
  MISTAKE_ERROR_CATEGORIES,
  SATURDAY,
} from "@/lib/planner/types";

/**
 * Zod schemas for every planner server input. All planner server actions must
 * validate through these before touching the database.
 */

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

export const sectionScoreSchema = z
  .number()
  .int("Score must be a whole number")
  .refine(isValidSectionScore, "Score must be 200–800 in increments of 10");

export const totalScoreSchema = z
  .number()
  .int("Score must be a whole number")
  .refine(isValidTotalScore, "Score must be 400–1600 in increments of 10");

export const studentScoresSchema = z.object({
  currentMathScore: sectionScoreSchema,
  currentRwScore: sectionScoreSchema,
  targetTotalScore: totalScoreSchema,
});

// ---------------------------------------------------------------------------
// Dates (ISO yyyy-MM-dd)
// ---------------------------------------------------------------------------

export const isoDateSchema = z.iso.date("Use the yyyy-mm-dd date format");

/** Test date must not be before the plan start date. */
export const planDatesSchema = z
  .object({
    planStartDate: isoDateSchema,
    testDate: isoDateSchema,
  })
  .refine((v) => v.planStartDate <= v.testDate, {
    message: "The test date must be on or after the plan start date",
    path: ["testDate"],
  });

// ---------------------------------------------------------------------------
// Weekly availability
// ---------------------------------------------------------------------------

const dayAvailabilitySchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    available: z.boolean(),
    studyHours: z
      .number()
      .int()
      .min(0)
      .max(MAX_STUDY_HOURS, `At most ${MAX_STUDY_HOURS} hours per day`),
  })
  .superRefine((day, ctx) => {
    const valid = isValidDayAvailability({
      weekday: day.weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      available: day.available,
      studyHours: day.studyHours,
    });
    if (valid) return;
    ctx.addIssue({
      code: "custom",
      message:
        day.weekday === SATURDAY
          ? "Saturday is reserved for practice tests"
          : day.available
            ? `Available days need ${MIN_STUDY_HOURS}–${MAX_STUDY_HOURS} study hours`
            : "Unavailable days must have 0 study hours",
      path: ["studyHours"],
    });
  });

export const weeklyAvailabilitySchema = z
  .array(dayAvailabilitySchema)
  .length(7, "Provide availability for all 7 days")
  .refine(
    (days) => new Set(days.map((d) => d.weekday)).size === 7,
    "Each weekday must appear exactly once"
  )
  .refine(
    (days) => days.some((d) => d.weekday !== SATURDAY && d.available),
    "Select at least one available study day"
  );

// ---------------------------------------------------------------------------
// Selected books
// ---------------------------------------------------------------------------

export const selectedBooksSchema = z
  .array(
    z.object({
      bookId: z.uuid("Invalid book id"),
      includedInPlan: z.boolean(),
    })
  )
  .min(1, "Choose your books")
  .refine(
    (books) => books.some((b) => b.includedInPlan),
    "Include at least one book in your plan"
  );

// ---------------------------------------------------------------------------
// Practice-test entry
// ---------------------------------------------------------------------------

export const practiceTestEntrySchema = z
  .object({
    testDate: isoDateSchema,
    testName: z
      .string()
      .trim()
      .min(1, "Give this test a name or number")
      .max(120),
    mathScore: sectionScoreSchema,
    rwScore: sectionScoreSchema,
    mistakesReviewed: z.boolean(),
    notes: z.string().trim().max(2000).optional().default(""),
    assignmentId: z.uuid().nullable().optional().default(null),
  })
  .transform((v) => ({
    ...v,
    // The DB enforces total = math + rw; derive rather than trust input.
    totalScore: v.mathScore + v.rwScore,
  }));

// ---------------------------------------------------------------------------
// Mistake entry
// ---------------------------------------------------------------------------

export const mistakeEntrySchema = z
  .object({
    sourceType: z.enum(["practice_test", "book"]),
    section: z.enum(["math", "reading_writing"]),
    topic: z.string().trim().min(1, "Pick a topic").max(120),
    questionReference: z.string().trim().max(120).optional().default(""),
    errorCategory: z.enum(MISTAKE_ERROR_CATEGORIES),
    whyError: z.string().trim().max(2000).optional().default(""),
    correctReasoning: z.string().trim().max(2000).optional().default(""),
    lessonToRemember: z.string().trim().max(2000).optional().default(""),
    wasGuessed: z.boolean(),
    wasRetried: z.boolean(),
    retryCorrect: z.boolean().nullable().optional().default(null),
    practiceTestId: z.uuid().nullable().optional().default(null),
    assignmentId: z.uuid().nullable().optional().default(null),
  })
  .refine((v) => v.wasRetried || v.retryCorrect === null, {
    message: "Retry result only applies when the question was retried",
    path: ["retryCorrect"],
  });

/** Full onboarding payload used to preview or activate a plan. */
export const activatePlanSchema = z
  .object({
    currentMathScore: sectionScoreSchema,
    currentRwScore: sectionScoreSchema,
    targetTotalScore: totalScoreSchema,
    planStartDate: isoDateSchema,
    testDate: isoDateSchema,
    timezone: z.string().trim().min(1).max(80).default("America/Los_Angeles"),
    availability: weeklyAvailabilitySchema,
    selectedBooks: z
      .array(
        z.object({
          bookId: z.uuid("Invalid book id"),
          includedInPlan: z.boolean(),
          recommendationLevel: z.enum([
            "highly_recommended",
            "recommended",
            "optional",
          ]),
          recommendationReason: z.string().max(500).default(""),
        })
      )
      .min(1)
      .refine(
        (books) => books.some((b) => b.includedInPlan),
        "Include at least one book in your plan"
      ),
  })
  .refine((v) => v.planStartDate <= v.testDate, {
    message: "The test date must be on or after the plan start date",
    path: ["testDate"],
  });

export const toggleAssignmentSchema = z.object({
  assignmentId: z.uuid(),
  completed: z.boolean(),
});

export type StudentScoresInput = z.input<typeof studentScoresSchema>;
export type PlanDatesInput = z.input<typeof planDatesSchema>;
export type WeeklyAvailabilityInput = z.input<typeof weeklyAvailabilitySchema>;
export type SelectedBooksInput = z.input<typeof selectedBooksSchema>;
export type PracticeTestEntryInput = z.input<typeof practiceTestEntrySchema>;
export type MistakeEntryInput = z.input<typeof mistakeEntrySchema>;
export type ActivatePlanInput = z.input<typeof activatePlanSchema>;
