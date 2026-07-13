"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSessionCookie,
  requireAdmin,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin/auth";
import {
  isApplicationStatus,
} from "@/lib/admin/application";
import {
  getSupabaseAdminClient,
  SupabaseNotConfiguredError,
} from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * Server action for the login form. Called as `<form action={signInAdmin}>`.
 * On success, sets the session cookie and redirects back to /admin.
 * On failure, redirects with a `?error=` query param so the login page can
 * render an inline error without needing client state.
 */
export async function signInAdmin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? "/admin") || "/admin";

  if (!password) {
    redirect("/admin?error=missing");
  }

  if (!verifyAdminPassword(password)) {
    // Small delay to make brute-force less trivially cheap over the network.
    await new Promise((resolve) => setTimeout(resolve, 250));
    redirect("/admin?error=invalid");
  }

  await setAdminSessionCookie();
  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function signOutAdmin(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin");
}

// ---------------------------------------------------------------------------
// Application row mutations
// ---------------------------------------------------------------------------

export type MutationResult =
  | { ok: true }
  | { ok: false; error: string };

function isUuid(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
  );
}

/**
 * Update the pipeline status for a single cohort application.
 * Rejects unknown statuses and non-UUID ids without touching the DB.
 */
export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<MutationResult> {
  await requireAdmin();

  if (!isUuid(id)) {
    return { ok: false, error: "Invalid application id." };
  }
  if (!isApplicationStatus(status)) {
    return { ok: false, error: `Unknown status "${status}".` };
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      console.error("[updateApplicationStatus] Supabase not configured:", err.message);
      return { ok: false, error: "The admin database isn't reachable right now." };
    }
    throw err;
  }

  const { error } = await supabase
    .from("cohort_applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[updateApplicationStatus] update failed:", error);
    return { ok: false, error: "Update failed. Please try again." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Update the free-form notes field for a single cohort application. Empty
 * strings are stored as SQL NULL to keep the "no notes" state consistent.
 */
export async function updateApplicationNotes(
  id: string,
  notes: string
): Promise<MutationResult> {
  await requireAdmin();

  if (!isUuid(id)) {
    return { ok: false, error: "Invalid application id." };
  }

  const cleaned = notes.trim();
  const value = cleaned.length > 0 ? cleaned : null;

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      console.error("[updateApplicationNotes] Supabase not configured:", err.message);
      return { ok: false, error: "The admin database isn't reachable right now." };
    }
    throw err;
  }

  const { error } = await supabase
    .from("cohort_applications")
    .update({ notes: value })
    .eq("id", id);

  if (error) {
    console.error("[updateApplicationNotes] update failed:", error);
    return { ok: false, error: "Update failed. Please try again." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
