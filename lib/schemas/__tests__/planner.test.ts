import { describe, expect, it } from "vitest";

import {
  mistakeEntrySchema,
  planDatesSchema,
  practiceTestEntrySchema,
  selectedBooksSchema,
  studentScoresSchema,
  weeklyAvailabilitySchema,
} from "@/lib/schemas/planner";

const UUID = "1b671a64-40d5-491e-99b0-da01ff1f3341";

function fullWeek(
  overrides: Partial<Record<number, { available: boolean; studyHours: number }>> = {}
) {
  return [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
    weekday,
    available: overrides[weekday]?.available ?? (weekday !== 6 && weekday !== 0),
    studyHours:
      overrides[weekday]?.studyHours ?? (weekday !== 6 && weekday !== 0 ? 1 : 0),
  }));
}

describe("studentScoresSchema", () => {
  it("accepts valid scores", () => {
    const result = studentScoresSchema.safeParse({
      currentMathScore: 600,
      currentRwScore: 650,
      targetTotalScore: 1500,
    });
    expect(result.success).toBe(true);
  });

  it("rejects off-increment and out-of-range scores", () => {
    expect(
      studentScoresSchema.safeParse({
        currentMathScore: 605,
        currentRwScore: 650,
        targetTotalScore: 1500,
      }).success
    ).toBe(false);
    expect(
      studentScoresSchema.safeParse({
        currentMathScore: 600,
        currentRwScore: 650,
        targetTotalScore: 1700,
      }).success
    ).toBe(false);
  });
});

describe("planDatesSchema", () => {
  it("accepts start date on or before test date", () => {
    expect(
      planDatesSchema.safeParse({
        planStartDate: "2026-08-01",
        testDate: "2026-10-03",
      }).success
    ).toBe(true);
  });

  it("rejects a test date before the start date", () => {
    expect(
      planDatesSchema.safeParse({
        planStartDate: "2026-10-04",
        testDate: "2026-10-03",
      }).success
    ).toBe(false);
  });

  it("rejects malformed dates", () => {
    expect(
      planDatesSchema.safeParse({
        planStartDate: "08/01/2026",
        testDate: "2026-10-03",
      }).success
    ).toBe(false);
  });
});

describe("weeklyAvailabilitySchema", () => {
  it("accepts a valid week", () => {
    expect(weeklyAvailabilitySchema.safeParse(fullWeek()).success).toBe(true);
  });

  it("rejects Saturday marked available", () => {
    expect(
      weeklyAvailabilitySchema.safeParse(
        fullWeek({ 6: { available: true, studyHours: 2 } })
      ).success
    ).toBe(false);
  });

  it("rejects available days with 0 or 7+ hours", () => {
    expect(
      weeklyAvailabilitySchema.safeParse(
        fullWeek({ 1: { available: true, studyHours: 0 } })
      ).success
    ).toBe(false);
    expect(
      weeklyAvailabilitySchema.safeParse(
        fullWeek({ 1: { available: true, studyHours: 7 } })
      ).success
    ).toBe(false);
  });

  it("rejects unavailable days with nonzero hours", () => {
    expect(
      weeklyAvailabilitySchema.safeParse(
        fullWeek({ 0: { available: false, studyHours: 3 } })
      ).success
    ).toBe(false);
  });

  it("rejects weeks without any available study day", () => {
    const week = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
      weekday,
      available: false,
      studyHours: 0,
    }));
    expect(weeklyAvailabilitySchema.safeParse(week).success).toBe(false);
  });

  it("rejects duplicate weekdays", () => {
    const week = fullWeek();
    week[0] = { ...week[1] };
    expect(weeklyAvailabilitySchema.safeParse(week).success).toBe(false);
  });
});

describe("selectedBooksSchema", () => {
  it("requires at least one included book", () => {
    expect(
      selectedBooksSchema.safeParse([{ bookId: UUID, includedInPlan: false }])
        .success
    ).toBe(false);
    expect(
      selectedBooksSchema.safeParse([{ bookId: UUID, includedInPlan: true }])
        .success
    ).toBe(true);
  });
});

describe("practiceTestEntrySchema", () => {
  it("derives the total from section scores", () => {
    const result = practiceTestEntrySchema.parse({
      testDate: "2026-08-08",
      testName: "Practice Test 1",
      mathScore: 650,
      rwScore: 620,
      mistakesReviewed: true,
    });
    expect(result.totalScore).toBe(1270);
  });

  it("rejects invalid section scores", () => {
    expect(
      practiceTestEntrySchema.safeParse({
        testDate: "2026-08-08",
        testName: "Practice Test 1",
        mathScore: 655,
        rwScore: 620,
        mistakesReviewed: false,
      }).success
    ).toBe(false);
  });

  it("requires a test name", () => {
    expect(
      practiceTestEntrySchema.safeParse({
        testDate: "2026-08-08",
        testName: "  ",
        mathScore: 650,
        rwScore: 620,
        mistakesReviewed: false,
      }).success
    ).toBe(false);
  });
});

describe("mistakeEntrySchema", () => {
  const base = {
    sourceType: "practice_test",
    section: "math",
    topic: "Linear equations",
    errorCategory: "careless_error" as const,
    wasGuessed: false,
    wasRetried: false,
  };

  it("accepts a minimal valid entry", () => {
    expect(mistakeEntrySchema.safeParse(base).success).toBe(true);
  });

  it("rejects a retry result without a retry", () => {
    expect(
      mistakeEntrySchema.safeParse({ ...base, retryCorrect: true }).success
    ).toBe(false);
  });

  it("accepts a retry result when retried", () => {
    expect(
      mistakeEntrySchema.safeParse({
        ...base,
        wasRetried: true,
        retryCorrect: false,
      }).success
    ).toBe(true);
  });

  it("rejects unknown selector values", () => {
    expect(
      mistakeEntrySchema.safeParse({ ...base, section: "science" }).success
    ).toBe(false);
    expect(
      mistakeEntrySchema.safeParse({ ...base, errorCategory: "bad-luck" })
        .success
    ).toBe(false);
  });

  it("requires practice-test total to equal section sum", () => {
    const parsed = practiceTestEntrySchema.parse({
      testDate: "2026-08-08",
      testName: "PT2",
      mathScore: 700,
      rwScore: 710,
      mistakesReviewed: true,
    });
    expect(parsed.totalScore).toBe(1410);
  });
});
