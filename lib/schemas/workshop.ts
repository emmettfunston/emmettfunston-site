import { z } from "zod";

/**
 * Shape of the free-workshop registration form.
 *
 * This schema is imported by BOTH the client (for pre-submission UX validation)
 * and the server action (for authoritative validation before insert).
 * Client validation is a nicety; the server action re-validates every field.
 */
export const workshopRegistrationSchema = z.object({
  student_first_name: z.string().trim().min(1, "Required"),
  student_last_name: z.string().trim().min(1, "Required"),
  student_email: z
    .string()
    .trim()
    .min(1, "Required")
    .email("Enter a valid email"),
  parent_name: z.string().trim().min(1, "Required"),
  parent_email: z
    .string()
    .trim()
    .min(1, "Required")
    .email("Enter a valid email"),
  grade: z.string().trim().min(1, "Required"),
  high_school: z.string().trim().min(1, "Required"),
  current_score: z.string().trim().optional().default(""),
  target_score: z.string().trim().optional().default(""),
  target_colleges: z.string().trim().optional().default(""),
  main_interest: z.string().trim().min(1, "Required"),
  source: z.string().trim().optional().default(""),
});

export type WorkshopRegistrationInput = z.input<
  typeof workshopRegistrationSchema
>;

export type WorkshopRegistrationParsed = z.output<
  typeof workshopRegistrationSchema
>;
