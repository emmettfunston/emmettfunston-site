import type { Metadata } from "next";
import { CheckIcon, SparklesIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { getPathwayBookingUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Coaching Packages",
  description:
    "Three selective coaching packages: SAT Score Jump Lab, Elite Application Lab, and the flagship Elite SAT + Admissions Cohort. Application-only enrollment.",
  alternates: { canonical: "/sat-admissions/packages" },
  openGraph: {
    title: "Coaching Packages — Emmett Funston SAT & Admissions",
    description:
      "Three selective coaching packages: SAT Score Jump Lab, Elite Application Lab, and the flagship Elite SAT + Admissions Cohort.",
  },
};

// ---------------------------------------------------------------------------
// Package data
// ---------------------------------------------------------------------------

const satPackage = {
  name: "SAT Score Jump Lab",
  price: "$2,000",
  subtitle: "For ambitious students aiming for 1450–1550+ SAT scores.",
  includes: [
    "Diagnostic SAT Audit",
    "Personalized Score Leak Report",
    "Mistake Journal System",
    "Study Plan with timeline and structure based on 2 / 4 / 8 weeks",
    "Saturday practice exams or timed sections plus full review",
    "Assigned daily practice on non-test days",
    "Practice Test Review Framework",
    "Weekly Group Virtual Meetings",
    "Private Discord Community",
    "1 Mentor Call Credit",
    "1 Private 1-hour SAT Strategy Call with Emmett",
    "Weekly Parent Progress Emails",
  ],
} as const;

const admissionsPackage = {
  name: "Elite Application Lab",
  price: "$3,000",
  subtitle: "For students aiming for selective and elite colleges.",
  includes: [
    "Applicant Profile Audit",
    "Timeline Plan and Structure",
    "Activity List Review",
    "Applicant Narrative Strategy",
    "Major Positioning Strategy",
    "School List Strategy",
    "Essay Brainstorming",
    "Activity List Assistance: 2 review rounds",
    "Essay Assistance: 2 review rounds",
    "Recommendation Strategy",
    "Weekly Group Virtual Meetings",
    "Private Discord Community",
    "2 Mentor Call Credits",
    "1 Private 1-hour Application Strategy Call with Emmett",
    "Weekly Parent Progress Emails",
  ],
} as const;

const flagshipPackage = {
  name: "Elite SAT + Admissions Cohort",
  price: "$4,500",
  subtitle:
    "The flagship option for students who want both elite SAT improvement and complete application strategy.",
  extras: [
    "Parent Strategy Call",
    "4 total Mentor Call Credits",
    "Elite Roadmap",
    "3 Essay Review Rounds instead of 2",
    "Priority feedback and access",
    "Combined SAT + application weekly action plan",
  ],
} as const;

const notes = [
  "1 Mentor Call Credit = 1 hour booking with a mentor.",
  "Extra private calls can be booked separately through Emmett's external booking profile.",
  "Score increases and admissions outcomes are not guaranteed.",
  "Applications are reviewed before enrollment. Public buy-now buttons are intentionally not offered.",
];

const reviewLimits = [
  {
    title: "Activity List Assistance",
    body: "Includes 2 review rounds on up to 10 Common App activities. Feedback covers activity selection, ordering, specificity, quantification, impact, leadership framing, and alignment with the student's applicant narrative.",
  },
  {
    title: "Essay Assistance (Elite Application Lab)",
    body: "For the Elite Application Lab, includes 2 review rounds total. Each round may be used on either 1 personal statement up to 650 words or up to 3 supplemental essays of 300 words or less each.",
  },
  {
    title: "Bundle Essay Assistance (Elite SAT + Admissions Cohort)",
    body: "The Elite SAT + Admissions Cohort includes 3 total essay review rounds instead of 2 — applied on the same 650-word / 3 × 300-word per-round structure.",
  },
];

const ethicsNote =
  "Essay feedback is strategic and editorial. It focuses on narrative, structure, specificity, clarity, and alignment with the student's application strategy. We do not ghostwrite essays or fabricate experiences.";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PackagesPage() {
  const pathwayBookingUrl = getPathwayBookingUrl();

  return (
    <>
      <PageHeader
        eyebrow="Packages"
        title="Three ways to work together."
        description="A focused SAT lab, a complete admissions lab, and a flagship cohort that combines both. Every package is application-only — no public buy-now buttons."
        actions={
          <>
            <CtaButton href="/sat-admissions/apply" variant="primary" size="lg">
              Apply to Join
            </CtaButton>
            <CtaButton
              href="/sat-admissions/workshop"
              variant="secondary"
              size="lg"
            >
              Register for Free Workshop
            </CtaButton>
          </>
        }
      />

      {/* Flagship — hero card */}
      <Section spacing="lg" container="xl">
        <FlagshipCard
          pkg={flagshipPackage}
          included={[satPackage.name, admissionsPackage.name]}
        />
      </Section>

      {/* Supporting packages */}
      <Section spacing="lg" container="xl" muted>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Or work on one side of it
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Focused labs for SAT or admissions.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The flagship cohort combines both, but each lab also runs on its own for students whose situation calls for it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PackageDetailCard pkg={satPackage} />
          <PackageDetailCard pkg={admissionsPackage} />
        </div>
      </Section>

      {/* Notes */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Notes
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              How enrollment and calls actually work.
            </h2>
          </div>
          <ul className="grid gap-3">
            {notes.map((n) => (
              <li
                key={n}
                className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background p-4"
              >
                <InfoIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-foreground/85">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Review limits + Ethics */}
      <Section spacing="lg" container="xl" muted>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Review limits & ethics
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Clear scope. Honest expectations.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Coaching relationships work best when the scope is explicit. Here&apos;s exactly what review rounds cover and where we draw the line.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reviewLimits.map((r) => (
            <article
              key={r.title}
              className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-6"
            >
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                {r.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-foreground/15 bg-background p-6">
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-foreground" />
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
              Ethics note
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              {ethicsNote}
            </p>
          </div>
        </div>
      </Section>

      {/* Standalone 1-on-1 */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-6 rounded-3xl border border-foreground/10 bg-background p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-12">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Just want a single call?
            </span>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Book a private 1-on-1 mentor call
            </h2>
            <p className="mt-3 text-muted-foreground">
              Private 1-on-1 calls are booked through an external mentor platform — not built into this site. Great for a targeted essay review, a single strategic question, or a gut-check.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <CtaButton
              href={pathwayBookingUrl}
              variant="primary"
              size="lg"
              external
            >
              Book a 1-on-1 mentor call
            </CtaButton>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="lg" container="xl">
        <div className="rounded-3xl bg-foreground p-8 text-background sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-background/60">
                Next step
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Ready to work together?
              </h2>
              <p className="max-w-xl text-background/80">
                Apply to join the cohort, register for the free workshop, or book a private 1-on-1 call.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <CtaButton
                href="/sat-admissions/apply"
                variant="secondary"
                size="lg"
                className="border-transparent bg-background text-foreground hover:bg-background/90"
              >
                Apply to Join
              </CtaButton>
              <CtaButton
                href="/sat-admissions/workshop"
                variant="ghost"
                size="lg"
                className="border border-background/25 text-background hover:bg-background/10"
              >
                Register for Free Workshop
              </CtaButton>
              <CtaButton
                href={pathwayBookingUrl}
                variant="ghost"
                size="lg"
                external
                className="border border-background/25 text-background hover:bg-background/10"
              >
                Book 1-on-1 Call
              </CtaButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Local components
// ---------------------------------------------------------------------------

type PackageDetail = {
  name: string;
  price: string;
  subtitle: string;
  includes: readonly string[];
};

function PackageDetailCard({ pkg }: { pkg: PackageDetail }) {
  return (
    <article className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-background p-6 sm:p-8">
      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {pkg.name}
          </h3>
          <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">
            {pkg.price}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
      </header>

      <ul className="flex flex-col gap-2.5">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 border-t border-foreground/10 pt-5">
        <CtaButton
          href="/sat-admissions/apply"
          variant="primary"
          size="md"
          className="w-full"
        >
          Apply for this package
        </CtaButton>
        <p className="text-center text-xs text-muted-foreground">
          Application-only. No public buy-now.
        </p>
      </div>
    </article>
  );
}

function FlagshipCard({
  pkg,
  included,
}: {
  pkg: {
    name: string;
    price: string;
    subtitle: string;
    extras: readonly string[];
  };
  included: string[];
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-xl shadow-foreground/10 ring-1 ring-foreground sm:p-12"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-40 [background:radial-gradient(60%_60%_at_100%_0%,color-mix(in_oklch,var(--background)_18%,transparent),transparent_70%)]"
      />

      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-background">
              <SparklesIcon className="size-3.5" /> Flagship · Most Popular
            </span>
          </div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {pkg.name}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-background/85 sm:text-lg">
            {pkg.subtitle}
          </p>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-heading text-5xl font-semibold tracking-tight tabular-nums">
              {pkg.price}
            </span>
            <span className="text-sm text-background/70">
              one-time · application-only
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <CtaButton
              href="/sat-admissions/apply"
              variant="secondary"
              size="lg"
              className="border-transparent bg-background text-foreground hover:bg-background/90"
            >
              Apply for the flagship
            </CtaButton>
            <CtaButton
              href="/sat-admissions/workshop"
              variant="ghost"
              size="lg"
              className="border border-background/25 text-background hover:bg-background/10"
            >
              Free workshop first
            </CtaButton>
          </div>
        </div>

        <div className="rounded-2xl border border-background/15 bg-background/[0.06] p-6">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-background/70">
            What&apos;s included
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-background/90">
            Everything in the{" "}
            <span className="font-medium text-background">{included[0]}</span>{" "}
            and the{" "}
            <span className="font-medium text-background">{included[1]}</span>,
            plus these flagship upgrades:
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {pkg.extras.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-background" />
                <span className="text-background/95">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
