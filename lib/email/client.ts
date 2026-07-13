import "server-only";

import { Resend } from "resend";

/**
 * Thrown when the Resend environment is not present at runtime.
 *
 * Callers (see `lib/email/send.ts`) catch this and treat email delivery as
 * best-effort — never failing a form submission because email couldn't send.
 */
export class ResendNotConfiguredError extends Error {
  public readonly missing: string[];

  constructor(missing: string[]) {
    super(
      `Resend is not configured. Missing env vars: ${missing.join(", ")}. ` +
        `Emails will be skipped until this is set.`
    );
    this.name = "ResendNotConfiguredError";
    this.missing = missing;
  }
}

/**
 * Resolved email configuration. Only produced when the environment is
 * complete enough for at least basic outbound sends.
 */
export type EmailConfig = {
  resend: Resend;
  /** The verified sender the "from" header uses. */
  from: string;
  /** Set when we should also notify an internal admin address on submissions. */
  adminEmail: string | null;
  /** Absolute site URL used to build links inside emails. */
  siteUrl: string;
};

let cached: EmailConfig | null = null;

/**
 * Returns a ready-to-use email config, throwing `ResendNotConfiguredError`
 * when the environment doesn't have enough to actually send anything.
 *
 * `EMAIL_FROM` is optional: if not set, we fall back to Resend's shared
 * `onboarding@resend.dev` sender which is fine for local development but
 * MUST be replaced with a verified domain sender before production.
 */
export function getEmailConfig(): EmailConfig {
  if (cached) return cached;

  const apiKey = process.env.RESEND_API_KEY?.trim();

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");

  if (missing.length > 0) {
    throw new ResendNotConfiguredError(missing);
  }

  const from =
    process.env.EMAIL_FROM?.trim() ||
    // Resend's shared testing sender. Works out of the box in development;
    // production should set EMAIL_FROM to a verified domain sender, e.g.
    //   EMAIL_FROM="Emmett Funston <hello@emmettfunston.com>"
    "Emmett Funston <onboarding@resend.dev>";

  const adminEmailRaw = process.env.ADMIN_EMAIL?.trim();
  const adminEmail =
    adminEmailRaw && adminEmailRaw !== "youremail@example.com"
      ? adminEmailRaw
      : null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://emmettfunston.com";

  cached = {
    resend: new Resend(apiKey!),
    from,
    adminEmail,
    siteUrl,
  };

  return cached;
}
