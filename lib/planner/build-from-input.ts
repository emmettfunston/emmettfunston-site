/**
 * Shared preview/activate path: validate input → load catalog → recommend
 * weights → generate. Pure orchestration over pure engine + DB catalog load.
 */

import { calculateWeights } from "@/lib/planner/calculate-weights";
import { generatePlan } from "@/lib/planner/generate-plan";
import { loadPlannerCatalog } from "@/lib/planner/load-catalog";
import { recommendBooks } from "@/lib/planner/recommend-books";
import { validateGeneratedPlan } from "@/lib/planner/validate-plan";
import type {
  BookRecommendation,
  DayAvailability,
  GeneratedPlan,
  PlannerBook,
  Weekday,
  WeeklyAvailability,
} from "@/lib/planner/types";
import type { ActivatePlanInput } from "@/lib/schemas/planner";
import { activatePlanSchema } from "@/lib/schemas/planner";

function toWeeklyAvailability(
  availability: ActivatePlanInput["availability"]
): WeeklyAvailability {
  return availability.map((d) => ({
    weekday: d.weekday as Weekday,
    available: d.available,
    studyHours: d.studyHours,
  })) as DayAvailability[];
}

export type BuiltPlan = {
  input: ActivatePlanInput;
  catalog: PlannerBook[];
  recommendations: BookRecommendation[];
  selectedBooks: PlannerBook[];
  plan: GeneratedPlan;
};

export async function buildPlanFromInput(raw: unknown): Promise<BuiltPlan> {
  const parsed = activatePlanSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid plan input";
    throw new Error(message);
  }
  const input = parsed.data;
  const catalog = await loadPlannerCatalog();
  if (catalog.length === 0) {
    throw new Error("No prep books are available yet. Please try again later.");
  }

  const recommendations = recommendBooks({
    currentMathScore: input.currentMathScore,
    currentRwScore: input.currentRwScore,
    targetTotalScore: input.targetTotalScore,
    books: catalog,
  });

  const includedIds = new Set(
    input.selectedBooks.filter((b) => b.includedInPlan).map((b) => b.bookId)
  );
  const selectedBooks = catalog.filter((b) => includedIds.has(b.id));
  if (selectedBooks.length === 0) {
    throw new Error("Include at least one book in your plan.");
  }

  const weights = calculateWeights({
    currentMathScore: input.currentMathScore,
    currentRwScore: input.currentRwScore,
    targetTotalScore: input.targetTotalScore,
    includedCategories: selectedBooks.map((b) => b.category),
  });

  const availability = toWeeklyAvailability(input.availability);

  const plan = generatePlan({
    planStartDate: input.planStartDate,
    testDate: input.testDate,
    timezone: input.timezone,
    currentMathScore: input.currentMathScore,
    currentRwScore: input.currentRwScore,
    targetTotalScore: input.targetTotalScore,
    availability,
    selectedBooks,
    weights,
  });

  const validation = validateGeneratedPlan({
    plan,
    availability,
    planStartDate: input.planStartDate,
    testDate: input.testDate,
  });
  if (!validation.ok) {
    console.error("[planner] generated plan failed validation:", validation.issues);
    throw new Error("The generated plan failed internal validation.");
  }

  return { input, catalog, recommendations, selectedBooks, plan };
}
