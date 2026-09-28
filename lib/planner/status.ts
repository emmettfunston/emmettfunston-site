/**
 * Derived assignment status and catch-up helpers.
 * Status is never stored in the database.
 */

import { deriveAssignmentStatus, type AssignmentStatus } from "@/lib/planner/types";
import { localTodayIso } from "@/lib/planner/dates";

export { deriveAssignmentStatus };
export type { AssignmentStatus };

export type StatusableAssignment = {
  id: string;
  assignmentDate: string;
  completedAt: string | null;
};

export function assignmentStatusForTimezone(
  assignment: Pick<StatusableAssignment, "assignmentDate" | "completedAt">,
  timezone: string,
  now?: Date
): AssignmentStatus {
  return deriveAssignmentStatus({
    assignmentDate: assignment.assignmentDate,
    completedAt: assignment.completedAt,
    localToday: localTodayIso(timezone, now),
  });
}

/** Incomplete assignments dated before local today, oldest first. */
export function selectCatchUpAssignments<T extends StatusableAssignment>(
  assignments: readonly T[],
  timezone: string,
  now?: Date
): T[] {
  const today = localTodayIso(timezone, now);
  return assignments
    .filter((a) => a.completedAt === null && a.assignmentDate < today)
    .slice()
    .sort((a, b) => {
      if (a.assignmentDate !== b.assignmentDate) {
        return a.assignmentDate.localeCompare(b.assignmentDate);
      }
      return a.id.localeCompare(b.id);
    });
}

export function selectTodayAssignments<T extends StatusableAssignment>(
  assignments: readonly T[],
  timezone: string,
  now?: Date
): T[] {
  const today = localTodayIso(timezone, now);
  return assignments
    .filter((a) => a.assignmentDate === today)
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function selectUpcomingAssignments<T extends StatusableAssignment>(
  assignments: readonly T[],
  timezone: string,
  now?: Date,
  limit = 14
): T[] {
  const today = localTodayIso(timezone, now);
  return assignments
    .filter((a) => a.completedAt === null && a.assignmentDate > today)
    .slice()
    .sort((a, b) => a.assignmentDate.localeCompare(b.assignmentDate))
    .slice(0, limit);
}

export function completionPercentage(
  assignments: readonly Pick<StatusableAssignment, "completedAt">[]
): number {
  if (assignments.length === 0) return 0;
  const done = assignments.filter((a) => a.completedAt !== null).length;
  return Math.round((done / assignments.length) * 100);
}

/**
 * Consecutive local calendar days (that have at least one assignment) where
 * every assignment due that day is completed, counting backward from today.
 * Days with no assignments are skipped (do not break the streak).
 */
export function studyStreakDays(
  assignments: readonly StatusableAssignment[],
  timezone: string,
  now?: Date
): number {
  const today = localTodayIso(timezone, now);
  const byDate = new Map<string, StatusableAssignment[]>();
  for (const a of assignments) {
    const list = byDate.get(a.assignmentDate) ?? [];
    list.push(a);
    byDate.set(a.assignmentDate, list);
  }

  let streak = 0;
  // Walk backward from today across known assignment dates only.
  const dates = [...byDate.keys()].sort().reverse();
  for (const date of dates) {
    if (date > today) continue;
    if (date < today && streak === 0 && date !== today) {
      // If today has no assignments, start from the most recent past day.
    }
    const day = byDate.get(date)!;
    const allDone = day.every((a) => a.completedAt !== null);
    if (!allDone) {
      if (date === today) continue; // today incomplete doesn't kill past streak yet
      break;
    }
    streak += 1;
  }
  return streak;
}
