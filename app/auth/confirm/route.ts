import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Only allow same-site relative paths as post-auth destinations. */
function safeNextPath(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

const OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

/**
 * Auth confirmation endpoint for Supabase email links (signup confirmation,
 * password recovery, email change). Supports both link styles:
 *   * token_hash + type  (custom email templates / newer docs pattern)
 *   * code               (PKCE exchange, default {{ .ConfirmationURL }})
 * On success the session cookie is set and the user lands on `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), "/planner");

  const supabase = await getSupabaseServerClient();

  if (tokenHash && typeParam && OTP_TYPES.includes(typeParam as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });
    if (!error) {
      redirect(typeParam === "recovery" ? "/reset-password" : next);
    }
    console.error("[auth/confirm] verifyOtp failed:", error);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
    console.error("[auth/confirm] exchangeCodeForSession failed:", error);
  }

  redirect(
    "/signin?error=" +
      encodeURIComponent(
        "That link is invalid or has expired. Sign in or request a new link."
      )
  );
}
