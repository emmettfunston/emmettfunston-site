import { z } from "zod";

/**
 * Shape of the cohort application form.
 *
 * This schema is imported by BOTH the client (for pre-submission UX validation)
 * and the server action (for authoritative validation before insert).
 * Client validation is a nicety; the server action re-validates every field.
 */

const requiredString = (message = "Required") =>
  z.string().trim().min(1, message);

const optionalString = z
  .string()
  .trim()
  .optional()
  .default("");

export const communityCommitmentValues = ["yes", "no"] as const;

export const cohortApplicationSchema = z.object({
  // Student info
  student_first_name: requiredString(),
  student_last_name: requiredString(),
  student_email: requiredString().pipe(z.string().email("Enter a valid email")),
  student_phone: optionalString,
  parent_name: requiredString(),
  parent_email: requiredString().pipe(z.string().email("Enter a valid email")),
  grade: requiredString(),
  high_school: requiredString(),

  // Academic info
  current_score: requiredString(),
  target_score: requiredString(),
  next_test_date: optionalString,
  gpa: optionalString,
  course_rigor: optionalString,

  // College goals
  target_colleges: requiredString(),
  intended_major: requiredString(),
  ed_ea_plans: optionalString,

  // Activities
  extracurriculars: requiredString(),
  strongest_activity: optionalString,
  weakest_part: optionalString,

  // Program fit
  package_interest: requiredString(),
  why_join: requiredString(),
  hours_per_week: requiredString(),
  biggest_goal: requiredString(),
  community_commitment: z.enum(communityCommitmentValues, {
    message: "Required",
  }),
  anything_else: optionalString,
});

export type CohortApplicationInput = z.input<typeof cohortApplicationSchema>;

export type CohortApplicationParsed = z.output<typeof cohortApplicationSchema>;
