import type {
  DayAvailability,
  PlannerBook,
  WeeklyAvailability,
} from "@/lib/planner/types";
import { DEFAULT_STUDY_HOURS } from "@/lib/planner/types";

export function makeAvailability(
  overrides: Partial<Record<number, { available: boolean; studyHours: number }>> = {}
): WeeklyAvailability {
  const days: DayAvailability[] = [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
    if (weekday === 6) {
      return { weekday: 6, available: false, studyHours: 0 };
    }
    const o = overrides[weekday];
    if (o) return { weekday: weekday as DayAvailability["weekday"], ...o };
    // Default: weekdays available at 1h, Sunday off.
    if (weekday === 0) {
      return { weekday: 0, available: false, studyHours: 0 };
    }
    return {
      weekday: weekday as DayAvailability["weekday"],
      available: true,
      studyHours: DEFAULT_STUDY_HOURS,
    };
  });
  return days;
}

export function makeBook(
  category: "math" | "grammar" | "reading",
  chapterCount: number,
  idPrefix = category
): PlannerBook {
  return {
    id: `${idPrefix}-book-id`,
    slug: `sat-${category}-book`,
    title: `SAT ${category[0]!.toUpperCase()}${category.slice(1)} Book`,
    category,
    chapters: Array.from({ length: chapterCount }, (_, i) => ({
      id: `${idPrefix}-ch-${i + 1}`,
      bookId: `${idPrefix}-book-id`,
      chapterNumber: i + 1,
      title: `${category} Chapter ${i + 1}`,
      estimatedMinutes: 60,
    })),
  };
}
