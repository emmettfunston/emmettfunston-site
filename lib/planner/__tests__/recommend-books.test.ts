import { describe, expect, it } from "vitest";

import { recommendBooks } from "@/lib/planner/recommend-books";
import { makeBook } from "@/lib/planner/__tests__/fixtures";

const books = [makeBook("math", 5), makeBook("grammar", 5), makeBook("reading", 5)];

describe("recommendBooks", () => {
  it("suggests all three books for a typical student", () => {
    const result = recommendBooks({
      currentMathScore: 600,
      currentRwScore: 620,
      targetTotalScore: 1400,
      books,
    });
    expect(result).toHaveLength(3);
    expect(result.every((r) => r.includedInPlan)).toBe(true);
    expect(result.find((r) => r.category === "grammar")!.priorityWeight).toBeGreaterThan(
      result.find((r) => r.category === "reading")!.priorityWeight
    );
  });

  it("strongly recommends all non-perfect sections for 1550+ targets", () => {
    const result = recommendBooks({
      currentMathScore: 720,
      currentRwScore: 710,
      targetTotalScore: 1550,
      books,
    });
    expect(result.every((r) => r.level === "highly_recommended")).toBe(true);
    expect(result.every((r) => r.includedInPlan)).toBe(true);
  });

  it("makes Math optional at 800 even for high targets, without hiding the book", () => {
    const result = recommendBooks({
      currentMathScore: 800,
      currentRwScore: 700,
      targetTotalScore: 1550,
      books,
    });
    const math = result.find((r) => r.category === "math")!;
    expect(math.level).toBe("optional");
    expect(result.map((r) => r.bookId)).toContain(math.bookId);
  });

  it("softens Math to optional reinforcement at 750+ for targets below 1550 without hiding it", () => {
    const result = recommendBooks({
      currentMathScore: 760,
      currentRwScore: 620,
      targetTotalScore: 1450,
      books,
    });
    const math = result.find((r) => r.category === "math")!;
    expect(math.level).toBe("optional");
    expect(math.includedInPlan).toBe(true);
  });

  it("softens Grammar and Reading at R&W 700+ for targets below 1550 without hiding them", () => {
    const result = recommendBooks({
      currentMathScore: 600,
      currentRwScore: 720,
      targetTotalScore: 1450,
      books,
    });
    const grammar = result.find((r) => r.category === "grammar")!;
    const reading = result.find((r) => r.category === "reading")!;
    expect(grammar.level).toBe("optional");
    expect(reading.level).toBe("optional");
    expect(grammar.includedInPlan).toBe(true);
    expect(reading.includedInPlan).toBe(true);
    expect(grammar.priorityWeight).toBeGreaterThan(reading.priorityWeight);
  });
});
