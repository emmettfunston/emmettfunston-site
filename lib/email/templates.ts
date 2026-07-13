import "server-only";

import type { WorkshopRegistrationParsed } from "@/lib/schemas/workshop";
import type { CohortApplicationParsed } from "@/lib/schemas/apply";

// ---------------------------------------------------------------------------
// Shared HTML shell
// ---------------------------------------------------------------------------

function escape(input: string | null | undefined): string {
  if (input == null) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Minimal HTML shell that renders well in most email clients (Gmail, Apple
 * Mail, Outlook web). Intentionally simple — inline styles, no frameworks.
 */
function shell({
  siteUrl,
  previewText,
  body,
}: {
  siteUrl: string;
  previewText: string;
  body: string;
}): string {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Emmett Funston · SAT & Admissions</title>
    <style>
      body { margin: 0; padding: 0; background: #f5f5f5; }
      a { color: #171717; }
      @media (prefers-color-scheme: dark) {
        body { background: #0a0a0a; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#171717;">
    <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escape(previewText)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #e5e5e5;">
                <a href="${escape(siteUrl)}" style="text-decoration:none;color:#171717;">
                  <span style="display:inline-block;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;color:#737373;">Emmett Funston · SAT &amp; Admissions</span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-size:15px;line-height:1.6;color:#171717;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #e5e5e5;font-size:12px;line-height:1.5;color:#737373;">
                Emmett Funston SAT &amp; Admissions ·
                <a href="${escape(siteUrl)}" style="color:#737373;">${escape(siteUrl.replace(/^https?:\/\//, ""))}</a>
                <br />
                &copy; ${year} Emmett Funston. Results shown are individual outcomes and not guarantees.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${escape(href)}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;padding:12px 20px;border-radius:9999px;margin-right:8px;margin-bottom:8px;">${escape(label)}</a>`;
}

function linkButton(href: string, label: string): string {
  return `<a href="${escape(href)}" style="display:inline-block;background:#ffffff;color:#171717;text-decoration:none;font-weight:500;font-size:14px;padding:11px 19px;border-radius:9999px;border:1px solid #d4d4d4;margin-right:8px;margin-bottom:8px;">${escape(label)}</a>`;
}

/**
 * Render a compact key/value table for the admin notification emails.
 * Empty / undefined values are omitted so the admin sees only what the
 * applicant actually filled in.
 */
function detailsTable(
  entries: Array<[label: string, value: string | null | undefined]>
): string {
  const rows = entries
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;vertical-align:top;font-size:12px;color:#737373;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;white-space:nowrap;">
            ${escape(label)}
          </td>
          <td style="padding:8px 0;vertical-align:top;font-size:14px;color:#171717;white-space:pre-wrap;">
            ${escape(String(value))}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e5e5;margin-top:8px;">
      ${rows}
    </table>
  `;
}

function detailsSection(title: string, table: string): string {
  return `
    <h3 style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#737373;margin:24px 0 4px 0;">
      ${escape(title)}
    </h3>
    ${table}
  `;
}

function plainDetails(
  entries: Array<[label: string, value: string | null | undefined]>
): string {
  return entries
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Workshop: confirmation to registrant
// ---------------------------------------------------------------------------

export function workshopConfirmationEmail({
  siteUrl,
  registration,
}: {
  siteUrl: string;
  registration: WorkshopRegistrationParsed;
}): { subject: string; html: string; text: string } {
  const packagesUrl = `${siteUrl}/sat-admissions/packages`;
  const applyUrl = `${siteUrl}/sat-admissions/apply`;
  const workshopTitle =
    "How to Break 1450+ SAT and Build an Elite College Application Strategy";

  const subject = "You're registered: SAT + Elite College Strategy Workshop";
  const previewText =
    "You're registered for the free SAT + Elite College Strategy Workshop.";

  const html = shell({
    siteUrl,
    previewText,
    body: `
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px 0;color:#171717;">
        You're registered.
      </h1>
      <p style="margin:0 0 16px 0;">
        Hi ${escape(registration.student_first_name)}, thanks for registering for the free workshop:
      </p>
      <p style="margin:0 0 20px 0;font-weight:600;color:#171717;">
        &ldquo;${escape(workshopTitle)}&rdquo;
      </p>
      <p style="margin:0 0 20px 0;">
        Details and reminders will be sent to this email as the workshop gets closer. Keep an eye on your inbox &mdash; and check your spam folder if you don't see the next message.
      </p>
      <div style="margin:24px 0 8px 0;">
        ${button(applyUrl, "Apply to the Cohort")}
        ${linkButton(packagesUrl, "View Packages")}
      </div>
      <p style="margin:24px 0 0 0;font-size:13px;color:#737373;">
        Talk soon,<br />
        Emmett
      </p>
    `,
  });

  const text = [
    `You're registered.`,
    ``,
    `Hi ${registration.student_first_name}, thanks for registering for the free workshop:`,
    `"${workshopTitle}"`,
    ``,
    `Details and reminders will be sent to this email as the workshop gets closer. Keep an eye on your inbox — and check your spam folder if you don't see the next message.`,
    ``,
    `Apply to the cohort: ${applyUrl}`,
    `View packages: ${packagesUrl}`,
    ``,
    `Talk soon,`,
    `Emmett`,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Workshop: admin notification
// ---------------------------------------------------------------------------

export function workshopAdminEmail({
  siteUrl,
  registration,
}: {
  siteUrl: string;
  registration: WorkshopRegistrationParsed;
}): { subject: string; html: string; text: string } {
  const subject = `[Workshop] New registration — ${registration.student_first_name} ${registration.student_last_name}`;
  const previewText = `New workshop registration from ${registration.student_first_name} ${registration.student_last_name}.`;

  const student: Array<[string, string | null | undefined]> = [
    ["Student", `${registration.student_first_name} ${registration.student_last_name}`],
    ["Student email", registration.student_email],
    ["Parent", registration.parent_name],
    ["Parent email", registration.parent_email],
    ["Grade", registration.grade],
    ["High school", registration.high_school],
  ];

  const academic: Array<[string, string | null | undefined]> = [
    ["Current score", registration.current_score],
    ["Target score", registration.target_score],
    ["Target colleges", registration.target_colleges],
  ];

  const interest: Array<[string, string | null | undefined]> = [
    ["Main interest", registration.main_interest],
    ["Referral source", registration.source],
  ];

  const html = shell({
    siteUrl,
    previewText,
    body: `
      <h1 style="font-size:22px;line-height:1.25;margin:0 0 8px 0;color:#171717;">
        New workshop registration
      </h1>
      <p style="margin:0 0 8px 0;color:#737373;font-size:13px;">
        ${escape(new Date().toISOString())}
      </p>
      ${detailsSection("Student", detailsTable(student))}
      ${detailsSection("Academic", detailsTable(academic))}
      ${detailsSection("Interest", detailsTable(interest))}
    `,
  });

  const text = [
    `New workshop registration`,
    `Submitted: ${new Date().toISOString()}`,
    ``,
    `-- Student --`,
    plainDetails(student),
    ``,
    `-- Academic --`,
    plainDetails(academic),
    ``,
    `-- Interest --`,
    plainDetails(interest),
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Application: confirmation to applicant
// ---------------------------------------------------------------------------

export function applicationConfirmationEmail({
  siteUrl,
  application,
}: {
  siteUrl: string;
  application: CohortApplicationParsed;
}): { subject: string; html: string; text: string } {
  const packagesUrl = `${siteUrl}/sat-admissions/packages`;
  const workshopUrl = `${siteUrl}/sat-admissions/workshop`;

  const subject = "Application received: Elite SAT + Admissions Cohort";
  const previewText =
    "Your application to the Elite SAT + Admissions Cohort has been received.";

  const html = shell({
    siteUrl,
    previewText,
    body: `
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px 0;color:#171717;">
        Application received.
      </h1>
      <p style="margin:0 0 16px 0;">
        Hi ${escape(application.student_first_name)}, thanks for applying to the <strong>Elite SAT + Admissions Cohort</strong>. Every application is read personally.
      </p>
      <p style="margin:0 0 16px 0;">
        Please note: <strong>submitting an application is not automatic enrollment</strong>. Strong-fit applicants may be invited to a short student/parent interview before an offer is made.
      </p>
      <p style="margin:0 0 20px 0;">
        You'll hear back within a few days with next steps or a package recommendation.
      </p>
      <div style="margin:24px 0 8px 0;">
        ${linkButton(packagesUrl, "View Packages")}
        ${linkButton(workshopUrl, "Watch the Free Workshop")}
      </div>
      <p style="margin:24px 0 0 0;font-size:13px;color:#737373;">
        Talk soon,<br />
        Emmett
      </p>
    `,
  });

  const text = [
    `Application received.`,
    ``,
    `Hi ${application.student_first_name}, thanks for applying to the Elite SAT + Admissions Cohort. Every application is read personally.`,
    ``,
    `Please note: submitting an application is not automatic enrollment. Strong-fit applicants may be invited to a short student/parent interview before an offer is made.`,
    ``,
    `You'll hear back within a few days with next steps or a package recommendation.`,
    ``,
    `View packages: ${packagesUrl}`,
    `Watch the free workshop: ${workshopUrl}`,
    ``,
    `Talk soon,`,
    `Emmett`,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Application: admin notification
// ---------------------------------------------------------------------------

export function applicationAdminEmail({
  siteUrl,
  application,
}: {
  siteUrl: string;
  application: CohortApplicationParsed;
}): { subject: string; html: string; text: string } {
  const subject = `[Application] ${application.student_first_name} ${application.student_last_name} — ${application.package_interest}`;
  const previewText = `New cohort application from ${application.student_first_name} ${application.student_last_name}.`;

  const student: Array<[string, string | null | undefined]> = [
    ["Student", `${application.student_first_name} ${application.student_last_name}`],
    ["Student email", application.student_email],
    ["Student phone", application.student_phone],
    ["Parent", application.parent_name],
    ["Parent email", application.parent_email],
    ["Grade", application.grade],
    ["High school", application.high_school],
  ];

  const academic: Array<[string, string | null | undefined]> = [
    ["Current score", application.current_score],
    ["Target score", application.target_score],
    ["Next test date", application.next_test_date],
    ["GPA", application.gpa],
    ["Course rigor / AP / IB / Honors", application.course_rigor],
  ];

  const college: Array<[string, string | null | undefined]> = [
    ["Target colleges", application.target_colleges],
    ["Intended major", application.intended_major],
    ["ED / EA plans", application.ed_ea_plans],
  ];

  const activities: Array<[string, string | null | undefined]> = [
    ["Extracurriculars", application.extracurriculars],
    ["Strongest activity", application.strongest_activity],
    ["Weakest part of application", application.weakest_part],
  ];

  const fit: Array<[string, string | null | undefined]> = [
    ["Package interest", application.package_interest],
    ["Why join", application.why_join],
    ["Hours / week", application.hours_per_week],
    ["Biggest goal (3–6 months)", application.biggest_goal],
    [
      "Willing to join Discord / community",
      application.community_commitment === "yes" ? "Yes" : "No",
    ],
    ["Anything else", application.anything_else],
  ];

  const html = shell({
    siteUrl,
    previewText,
    body: `
      <h1 style="font-size:22px;line-height:1.25;margin:0 0 8px 0;color:#171717;">
        New cohort application
      </h1>
      <p style="margin:0 0 8px 0;color:#737373;font-size:13px;">
        ${escape(new Date().toISOString())}
      </p>
      ${detailsSection("Student", detailsTable(student))}
      ${detailsSection("Academic", detailsTable(academic))}
      ${detailsSection("College goals", detailsTable(college))}
      ${detailsSection("Activities", detailsTable(activities))}
      ${detailsSection("Program fit", detailsTable(fit))}
    `,
  });

  const text = [
    `New cohort application`,
    `Submitted: ${new Date().toISOString()}`,
    ``,
    `-- Student --`,
    plainDetails(student),
    ``,
    `-- Academic --`,
    plainDetails(academic),
    ``,
    `-- College goals --`,
    plainDetails(college),
    ``,
    `-- Activities --`,
    plainDetails(activities),
    ``,
    `-- Program fit --`,
    plainDetails(fit),
  ].join("\n");

  return { subject, html, text };
}
