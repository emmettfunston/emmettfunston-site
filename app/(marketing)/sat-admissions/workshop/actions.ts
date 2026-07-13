"use server";

import {
  getSupabaseAdminClient,
  SupabaseNotConfiguredError,
} from "@/lib/supabase/server";
import { sendWorkshopEmails } from "@/lib/email/send";
import {
  workshopRegistrationSchema,
  type WorkshopRegistrationInput,
} from "@/lib/schemas/workshop";

export type WorkshopActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      /** Field-level errors when server-side validation fails. */
      fieldErrors?: Partial<Record<keyof WorkshopRegistrationInput, string>>;
    };

const GENERIC_ERROR =
  "We couldn't save your registration. Please try again in a moment, or email us if it keeps happening.";

const NOT_CONFIGURED_ERROR =
  "The registration form isn't accepting submissions right now. Please try again shortly.";

/**
 * Server action for the free-workshop registration form.
 *
 * Called imperatively from the client (not via <form action=...>) so that the
 * client component keeps its existing loading/success/error UX and controls
 * the client-side redirect to /sat-admissions/thanks-workshop on success.
 *
 * Never silently pretends to have saved data — if Supabase isn't configured or
 * the insert fails, returns a user-friendly error and logs details server-side.
 */
export async function registerForWorkshop(
  rawInput: unknown
): Promise<WorkshopActionResult> {
  const parsed = workshopRegistrationSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: NonNullable<
      Extract<WorkshopActionResult, { ok: false }>["fieldErrors"]
    > = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof WorkshopRegistrationInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields and submit again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      console.error("[registerForWorkshop] Supabase not configured:", err.message);
      return { ok: false, error: NOT_CONFIGURED_ERROR };
    }
    console.error("[registerForWorkshop] Unexpected client init error:", err);
    return { ok: false, error: GENERIC_ERROR };
  }

  const { error } = await supabase
    .from("workshop_registrations")
    .insert({
      student_first_name: data.student_first_name,
      student_last_name: data.student_last_name,
      student_email: data.student_email,
      parent_name: data.parent_name,
      parent_email: data.parent_email,
      grade: data.grade,
      high_school: data.high_school,
      current_score: data.current_score || null,
      target_score: data.target_score || null,
      target_colleges: data.target_colleges || null,
      main_interest: data.main_interest,
      referral_source: data.source || null,
    });

  if (error) {
    console.error("[registerForWorkshop] Supabase insert failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }

  // Emails are best-effort. `sendWorkshopEmails` never throws — a missing
  // RESEND_API_KEY or a delivery failure logs a warning and skips, but the
  // registration is already safely stored and the user still gets redirected.
  try {
    await sendWorkshopEmails(data);
  } catch (err) {
    console.error("[registerForWorkshop] sendWorkshopEmails threw:", err);
  }

  return { ok: true };
}
