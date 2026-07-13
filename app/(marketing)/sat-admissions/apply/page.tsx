import type { Metadata } from "next";
import { InfoIcon } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ApplyForm } from "@/components/site/apply-form";

export const metadata: Metadata = {
  title: "Apply to Join the Elite SAT + Admissions Cohort",
  description:
    "Application-only enrollment for the selective SAT and admissions cohort with Emmett Funston. Strong-fit applicants may be invited to a short interview.",
  alternates: { canonical: "/sat-admissions/apply" },
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "Apply to Join the Elite SAT + Admissions Cohort — Emmett Funston",
    description:
      "Application-only enrollment so the community stays serious, ambitious, and high-signal.",
  },
};

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Apply"
        title="Apply to Join the Elite SAT + Admissions Cohort"
        description="This cohort is application-only so the community stays serious, ambitious, and high-signal."
      />

      <Section spacing="lg" container="md">
        <div
          className="mb-8 flex items-start gap-3 rounded-2xl border border-foreground/15 bg-muted/40 p-5"
          role="note"
        >
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-foreground" />
          <p className="text-sm leading-relaxed text-foreground/85">
            After submitting, strong-fit applicants may be invited to a short student / parent interview. Enrollment is not automatic.
          </p>
        </div>

        <div className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-lg shadow-foreground/[0.03] sm:p-10">
          <ApplyForm />
        </div>
      </Section>
    </>
  );
}
