"use server";

import {
  getSupabaseAdminClient,
  SupabaseNotConfiguredError,
} from "@/lib/supabase/server";
import { sendApplicationEmails } from "@/lib/email/send";
import {
  cohortApplicationSchema,
  type CohortApplicationInput,
} from "@/lib/schemas/apply";

export type ApplyActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      /** Field-level errors when server-side validation fails. */
      fieldErrors?: Partial<Record<keyof CohortApplicationInput, string>>;
    };

const GENERIC_ERROR =
  "We couldn't save your application. Please try again in a moment, or email us if it keeps happening.";

const NOT_CONFIGURED_ERROR =
  "The application form isn't accepting submissions right now. Please try again shortly.";

/**
 * Server action for the cohort application form.
 *
 * Called imperatively from the client so the client component keeps its
 * existing loading/success/error UX and drives the redirect to
 * /sat-admissions/thanks-apply on success.
 *
 * Never silently pretends to have saved data — if Supabase isn't configured or
 * the insert fails, returns a user-friendly error and logs details server-side.
 */
export async function submitCohortApplication(
  rawInput: unknown
): Promise<ApplyActionResult> {
  const parsed = cohortApplicationSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: NonNullable<
      Extract<ApplyActionResult, { ok: false }>["fieldErrors"]
    > = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CohortApplicationInput | undefined;
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
      console.error(
        "[submitCohortApplication] Supabase not configured:",
        err.message
      );
      return { ok: false, error: NOT_CONFIGURED_ERROR };
    }
    console.error(
      "[submitCohortApplication] Unexpected client init error:",
      err
    );
    return { ok: false, error: GENERIC_ERROR };
  }

  const { error } = await supabase.from("cohort_applications").insert({
    // Student info
    student_first_name: data.student_first_name,
    student_last_name: data.student_last_name,
    student_email: data.student_email,
    student_phone: data.student_phone || null,
    parent_name: data.parent_name,
    parent_email: data.parent_email,
    grade: data.grade,
    high_school: data.high_school,

    // Academic info
    current_score: data.current_score,
    target_score: data.target_score,
    next_test_date: data.next_test_date || null,
    gpa: data.gpa || null,
    course_rigor: data.course_rigor || null,

    // College goals
    target_colleges: data.target_colleges,
    intended_major: data.intended_major,
    early_application_plans: data.ed_ea_plans || null,

    // Activities
    extracurriculars: data.extracurriculars,
    strongest_activity: data.strongest_activity || null,
    weakest_application_area: data.weakest_part || null,

    // Program fit
    package_interest: data.package_interest,
    why_join: data.why_join,
    hours_per_week: data.hours_per_week,
    biggest_goal: data.biggest_goal,
    willing_to_join_community: data.community_commitment === "yes",
    additional_info: data.anything_else || null,

    // Pipeline state — new applications always land in the 'new' bucket.
    status: "new",
  });

  if (error) {
    console.error("[submitCohortApplication] Supabase insert failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }

  // Emails are best-effort. `sendApplicationEmails` never throws — a missing
  // RESEND_API_KEY or a delivery failure logs a warning and skips, but the
  // application is already safely stored and the user still gets redirected.
  try {
    await sendApplicationEmails(data);
  } catch (err) {
    console.error("[submitCohortApplication] sendApplicationEmails threw:", err);
  }

  return { ok: true };
}
