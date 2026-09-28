import { describe, expect, it } from "vitest";

import { localTodayIso, eachIsoDateInclusive, isSaturday } from "@/lib/planner/dates";

describe("localTodayIso", () => {
  it("respects timezone date boundaries around UTC midnight", () => {
    // 2026-07-27 02:30 UTC is still July 26 in Los Angeles.
    const instant = new Date("2026-07-27T02:30:00.000Z");
    expect(localTodayIso("America/Los_Angeles", instant)).toBe("2026-07-26");
    expect(localTodayIso("UTC", instant)).toBe("2026-07-27");
  });
});

describe("date helpers", () => {
  it("detects Saturdays", () => {
    expect(isSaturday("2026-08-01")).toBe(true);
    expect(isSaturday("2026-08-03")).toBe(false);
  });

  it("enumerates inclusive date ranges", () => {
    expect(eachIsoDateInclusive("2026-08-01", "2026-08-03")).toEqual([
      "2026-08-01",
      "2026-08-02",
      "2026-08-03",
    ]);
  });
});
