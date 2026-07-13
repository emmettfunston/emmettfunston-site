import "server-only";

import {
  getEmailConfig,
  ResendNotConfiguredError,
  type EmailConfig,
} from "@/lib/email/client";
import {
  workshopConfirmationEmail,
  workshopAdminEmail,
  applicationConfirmationEmail,
  applicationAdminEmail,
} from "@/lib/email/templates";
import type { WorkshopRegistrationParsed } from "@/lib/schemas/workshop";
import type { CohortApplicationParsed } from "@/lib/schemas/apply";

type SendOne = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Used for readable server logs when Resend rejects a send. */
  label: string;
};

/**
 * Fire a set of emails in parallel. Never throws — every failure is logged
 * with its `label` so it's easy to grep in server logs. This function is the
 * only place that talks to Resend.
 */
async function sendAll(cfg: EmailConfig, batch: SendOne[]): Promise<void> {
  const results = await Promise.allSettled(
    batch.map(async (msg) => {
      const { data, error } = await cfg.resend.emails.send({
        from: cfg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        replyTo: cfg.adminEmail ?? undefined,
      });
      if (error) {
        throw error;
      }
      return { id: data?.id, label: msg.label };
    })
  );

  for (const [i, result] of results.entries()) {
    const msg = batch[i];
    if (result.status === "rejected") {
      console.error(
        `[email] failed to send "${msg.label}" to ${msg.to}:`,
        result.reason
      );
    } else {
      console.log(
        `[email] sent "${msg.label}" to ${msg.to}${
          result.value.id ? ` (id: ${result.value.id})` : ""
        }`
      );
    }
  }
}

/**
 * Deduplicate recipient addresses (case-insensitively) so a parent/student
 * pair sharing the same inbox doesn't receive the same message twice.
 */
function uniqueEmails(...emails: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const normalized = raw.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(raw.trim());
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send the confirmation + admin notification emails for a workshop
 * registration. Always resolves — email failures never bubble up. Missing
 * Resend / ADMIN_EMAIL config results in a clear warning log and a skip.
 */
export async function sendWorkshopEmails(
  registration: WorkshopRegistrationParsed
): Promise<void> {
  let cfg: EmailConfig;
  try {
    cfg = getEmailConfig();
  } catch (err) {
    if (err instanceof ResendNotConfiguredError) {
      console.warn(
        `[email] Skipping workshop emails — ${err.message}`
      );
      return;
    }
    console.error("[email] Unexpected error building email config:", err);
    return;
  }

  const confirmation = workshopConfirmationEmail({
    siteUrl: cfg.siteUrl,
    registration,
  });

  const recipients = uniqueEmails(
    registration.student_email,
    registration.parent_email
  );

  const batch: SendOne[] = recipients.map((to) => ({
    to,
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
    label: "workshop-confirmation",
  }));

  if (cfg.adminEmail) {
    const admin = workshopAdminEmail({ siteUrl: cfg.siteUrl, registration });
    batch.push({
      to: cfg.adminEmail,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      label: "workshop-admin",
    });
  } else {
    console.warn(
      "[email] ADMIN_EMAIL not set — skipping workshop admin notification."
    );
  }

  await sendAll(cfg, batch);
}

/**
 * Send the confirmation + admin notification emails for a cohort application.
 * Always resolves — email failures never bubble up.
 */
export async function sendApplicationEmails(
  application: CohortApplicationParsed
): Promise<void> {
  let cfg: EmailConfig;
  try {
    cfg = getEmailConfig();
  } catch (err) {
    if (err instanceof ResendNotConfiguredError) {
      console.warn(
        `[email] Skipping application emails — ${err.message}`
      );
      return;
    }
    console.error("[email] Unexpected error building email config:", err);
    return;
  }

  const confirmation = applicationConfirmationEmail({
    siteUrl: cfg.siteUrl,
    application,
  });

  const recipients = uniqueEmails(
    application.student_email,
    application.parent_email
  );

  const batch: SendOne[] = recipients.map((to) => ({
    to,
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
    label: "application-confirmation",
  }));

  if (cfg.adminEmail) {
    const admin = applicationAdminEmail({ siteUrl: cfg.siteUrl, application });
    batch.push({
      to: cfg.adminEmail,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      label: "application-admin",
    });
  } else {
    console.warn(
      "[email] ADMIN_EMAIL not set — skipping application admin notification."
    );
  }

  await sendAll(cfg, batch);
}
