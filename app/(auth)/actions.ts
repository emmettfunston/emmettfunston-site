"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/schemas/auth";

import { AUTH_IDLE_STATE, type AuthActionState } from "@/lib/auth/form-state";
import { sendSatPlannerWelcomeEmail } from "@/lib/email/send";

function fieldErrorsFromZod(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/**
 * Resolve the origin for auth email redirects. Prefers the actual request
 * origin (works on localhost and previews), falling back to the canonical
 * site URL.
 */
async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  if (origin) return origin;
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

/** Only allow same-site relative paths as post-auth destinations. */
function safeNextPath(raw: unknown, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------

export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") ?? "",
  });
  if (!parsed.success) {
    return {
      ...AUTH_IDLE_STATE,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await getSupabaseServerClient();
  const origin = await getRequestOrigin();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/planner`,
      data: parsed.data.displayName
        ? { display_name: parsed.data.displayName }
        : undefined,
    },
  });

  if (error) {
    console.error("[auth] signUp failed:", error);
    return {
      ...AUTH_IDLE_STATE,
      error: error.message || "Could not create your account. Please try again.",
    };
  }

  // Supabase may return an obfuscated user for an existing email; only send a
  // welcome email when a new identity was actually created.
  if (data.user?.identities && data.user.identities.length > 0) {
    await sendSatPlannerWelcomeEmail({
      userId: data.user.id,
      email: parsed.data.email,
      displayName: parsed.data.displayName,
    });
  }

  // When email confirmation is enabled, no session exists yet.
  if (!data.session) {
    return {
      ...AUTH_IDLE_STATE,
      ok: true,
      message:
        "Check your email for a confirmation link to finish creating your account.",
    };
  }

  redirect("/planner");
}

// ---------------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------------

export async function signIn(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      ...AUTH_IDLE_STATE,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ...AUTH_IDLE_STATE,
      error: "Incorrect email or password.",
    };
  }

  redirect(safeNextPath(formData.get("next"), "/planner"));
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[auth] signOut failed:", error);
  }
  redirect("/signin");
}

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------

export async function requestPasswordReset(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      ...AUTH_IDLE_STATE,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await getSupabaseServerClient();
  const origin = await getRequestOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${origin}/auth/confirm?next=/reset-password` }
  );

  if (error) {
    // Don't reveal whether the email exists; log server-side only.
    console.error("[auth] resetPasswordForEmail failed:", error);
  }

  return {
    ...AUTH_IDLE_STATE,
    ok: true,
    message:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

// ---------------------------------------------------------------------------
// Reset password (user arrived via the recovery link and has a session)
// ---------------------------------------------------------------------------

export async function resetPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      ...AUTH_IDLE_STATE,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ...AUTH_IDLE_STATE,
      error:
        "Your reset link has expired. Request a new one from the forgot-password page.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    console.error("[auth] updateUser(password) failed:", error);
    return {
      ...AUTH_IDLE_STATE,
      error: error.message || "Could not update your password. Please try again.",
    };
  }

  redirect("/planner");
}
