import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * Server-side auth/authorization helpers for the SAT planner.
 *
 * All checks run against Supabase on the server with the signed-in user's
 * cookie session (RLS enforced). Never rely on the proxy or client state
 * alone for authorization.
 */

export type PlannerGate = {
  user: User;
  profile: Tables<"profiles">;
  hasAccess: boolean;
};

/** The signed-in user, or null. Verified against the Supabase auth server. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Require a signed-in user or redirect to /signin (preserving the intended
 * destination).
 */
export async function requireUser(nextPath: string): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

/**
 * Whether the user owns a verified, paid SAT-planner purchase. Uses the
 * `has_sat_planner_access` SQL function (security definer) so the check can't
 * drift from the database's source of truth.
 */
export async function hasPlannerAccess(userId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc("has_sat_planner_access", {
    p_user_id: userId,
  });
  if (error) {
    // Fail closed: no access on error, but never silently — log for triage.
    console.error("[auth] has_sat_planner_access failed:", error);
    return false;
  }
  return data === true;
}

/**
 * Load the user's profile row. The row is created by a database trigger on
 * signup; if it is somehow missing this throws rather than pretending.
 */
export async function getProfile(userId: string): Promise<Tables<"profiles">> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) {
    throw new Error(
      `Profile not found for user ${userId}: ${error?.message ?? "no row"}`
    );
  }
  return data;
}

/**
 * Gate for /planner routes. Redirects:
 *   * signed out            -> /signin?next=...
 *   * no verified purchase  -> /sat-planner (sales page)
 * Returns user + profile + access for pages to apply onboarding routing.
 */
export async function requirePlannerAccess(
  nextPath: string
): Promise<PlannerGate> {
  const user = await requireUser(nextPath);
  const hasAccess = await hasPlannerAccess(user.id);
  if (!hasAccess) {
    redirect("/sat-planner");
  }
  const profile = await getProfile(user.id);
  return { user, profile, hasAccess };
}
