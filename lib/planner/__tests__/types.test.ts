import { describe, expect, it } from "vitest";

import {
  deriveAssignmentStatus,
  isValidDayAvailability,
  isValidSectionScore,
  isValidTotalScore,
  SECTION_SCORE_OPTIONS,
  TOTAL_SCORE_OPTIONS,
} from "@/lib/planner/types";

describe("isValidSectionScore", () => {
  it("accepts every legal section score", () => {
    for (const score of [200, 210, 500, 790, 800]) {
      expect(isValidSectionScore(score)).toBe(true);
    }
  });

  it("rejects scores out of range", () => {
    expect(isValidSectionScore(190)).toBe(false);
    expect(isValidSectionScore(810)).toBe(false);
    expect(isValidSectionScore(0)).toBe(false);
  });

  it("rejects scores off the 10-point grid", () => {
    expect(isValidSectionScore(555)).toBe(false);
    expect(isValidSectionScore(201)).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(isValidSectionScore(500.5)).toBe(false);
  });
});

describe("isValidTotalScore", () => {
  it("accepts every legal total score", () => {
    for (const score of [400, 1000, 1550, 1600]) {
      expect(isValidTotalScore(score)).toBe(true);
    }
  });

  it("rejects out-of-range and off-grid totals", () => {
    expect(isValidTotalScore(390)).toBe(false);
    expect(isValidTotalScore(1610)).toBe(false);
    expect(isValidTotalScore(1555)).toBe(false);
  });
});

describe("score option lists", () => {
  it("covers 200-800 by 10 for sections", () => {
    expect(SECTION_SCORE_OPTIONS).toHaveLength(61);
    expect(SECTION_SCORE_OPTIONS[0]).toBe(200);
    expect(SECTION_SCORE_OPTIONS.at(-1)).toBe(800);
  });

  it("covers 400-1600 by 10 for totals", () => {
    expect(TOTAL_SCORE_OPTIONS).toHaveLength(121);
    expect(TOTAL_SCORE_OPTIONS[0]).toBe(400);
    expect(TOTAL_SCORE_OPTIONS.at(-1)).toBe(1600);
  });
});

describe("isValidDayAvailability", () => {
  it("requires Saturday to be unavailable with zero hours", () => {
    expect(
      isValidDayAvailability({ weekday: 6, available: false, studyHours: 0 })
    ).toBe(true);
    expect(
      isValidDayAvailability({ weekday: 6, available: true, studyHours: 2 })
    ).toBe(false);
    expect(
      isValidDayAvailability({ weekday: 6, available: false, studyHours: 1 })
    ).toBe(false);
  });

  it("requires unavailable days to have zero hours", () => {
    expect(
      isValidDayAvailability({ weekday: 1, available: false, studyHours: 0 })
    ).toBe(true);
    expect(
      isValidDayAvailability({ weekday: 1, available: false, studyHours: 2 })
    ).toBe(false);
  });

  it("requires available days to have 1-6 integer hours", () => {
    expect(
      isValidDayAvailability({ weekday: 2, available: true, studyHours: 1 })
    ).toBe(true);
    expect(
      isValidDayAvailability({ weekday: 2, available: true, studyHours: 6 })
    ).toBe(true);
    expect(
      isValidDayAvailability({ weekday: 2, available: true, studyHours: 0 })
    ).toBe(false);
    expect(
      isValidDayAvailability({ weekday: 2, available: true, studyHours: 7 })
    ).toBe(false);
    expect(
      isValidDayAvailability({ weekday: 2, available: true, studyHours: 2.5 })
    ).toBe(false);
  });
});

describe("deriveAssignmentStatus", () => {
  const localToday = "2026-07-20";

  it("is completed whenever completed_at is set, regardless of date", () => {
    expect(
      deriveAssignmentStatus({
        assignmentDate: "2026-07-01",
        completedAt: "2026-07-02T10:00:00Z",
        localToday,
      })
    ).toBe("completed");
  });

  it("is overdue when incomplete and dated before local today", () => {
    expect(
      deriveAssignmentStatus({
        assignmentDate: "2026-07-19",
        completedAt: null,
        localToday,
      })
    ).toBe("overdue");
  });

  it("is due_today when incomplete and dated local today", () => {
    expect(
      deriveAssignmentStatus({
        assignmentDate: "2026-07-20",
        completedAt: null,
        localToday,
      })
    ).toBe("due_today");
  });

  it("is upcoming when incomplete and dated after local today", () => {
    expect(
      deriveAssignmentStatus({
        assignmentDate: "2026-07-21",
        completedAt: null,
        localToday,
      })
    ).toBe("upcoming");
  });
});
