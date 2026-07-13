/**
 * Pure shared constants for the admin dashboard's cohort-application view.
 * Kept in a plain module (no "use server") so both server actions and client
 * components can import from it — Next.js forbids non-async exports from
 * files marked "use server".
 */

export const APPLICATION_STATUSES = [
  "new",
  "contacted",
  "interview",
  "accepted",
  "rejected",
  "enrolled",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const isApplicationStatus = (v: unknown): v is ApplicationStatus =>
  typeof v === "string" &&
  (APPLICATION_STATUSES as readonly string[]).includes(v);
