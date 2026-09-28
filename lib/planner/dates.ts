/**
 * Date-only helpers for the planner. All public dates are ISO `yyyy-MM-dd`.
 * Pure — no React, no Supabase.
 */

import { addDays, format, getDay, parseISO, isValid } from "date-fns";

import type { Weekday } from "@/lib/planner/types";
import { SATURDAY } from "@/lib/planner/types";

/** Parse an ISO date string into a UTC noon Date (avoids DST edge flips). */
export function parseIsoDate(iso: string): Date {
  const d = parseISO(`${iso}T12:00:00.000Z`);
  if (!isValid(d)) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return d;
}

export function formatIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function weekdayOfIsoDate(iso: string): Weekday {
  return getDay(parseIsoDate(iso)) as Weekday;
}

export function isSaturday(iso: string): boolean {
  return weekdayOfIsoDate(iso) === SATURDAY;
}

/** Inclusive start through inclusive end. */
export function eachIsoDateInclusive(
  startIso: string,
  endIso: string
): string[] {
  if (startIso > endIso) return [];
  const out: string[] = [];
  let cursor = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  while (cursor.getTime() <= end.getTime()) {
    out.push(formatIsoDate(cursor));
    cursor = addDays(cursor, 1);
  }
  return out;
}

/**
 * Today's calendar date in the given IANA timezone as `yyyy-MM-dd`.
 * Falls back to the runtime locale timezone, then UTC, if invalid.
 */
export function localTodayIso(timezone: string, now: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch {
    // fall through
  }
  return formatIsoDate(now);
}

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
