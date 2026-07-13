import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ProofCard } from "@/components/site/proof-card";
import { CtaButton } from "@/components/site/cta-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Proof — The method behind 1510, 1510, and 1540",
  description:
    "Case studies and the method behind the SAT and admissions coaching program. Score increases and admissions outcomes are not guaranteed.",
  alternates: { canonical: "/sat-admissions/proof" },
  openGraph: {
    title: "Proof — Emmett Funston SAT & Admissions",
    description:
      "The method behind 1510, 1510, and 1540 score outcomes.",
  },
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const cases = [
  {
    student: "Emmett",
    context: "Founder · Northwestern EE",
    before: 1390,
    after: 1510,
    description:
      "After months of slower progress, I changed my approach and focused on score leaks, mistake review, and structured practice.",
    featured: true,
  },
  {
    student: "Brother",
    context: "Northwestern Engineering · Early Decision",
    before: 1480,
    after: 1540,
    description:
      "My brother used the method to push into an even higher score range before being admitted Early Decision to Northwestern Engineering.",
  },
  {
    student: "Student",
    context: "Coached student · same method",
    before: 1390,
    after: 1510,
    description:
      "One of my students used the same method and reached the same 1510 score outcome.",
  },
] as const;

const method = [
  {
    number: "01",
    title: "Score Leak Diagnosis",
    body: "A structured breakdown of exactly where points are being lost — by section, question type, timing, and error pattern.",
  },
  {
    number: "02",
    title: "Mistake Journal System",
    body: "The discipline that makes the difference — a structured way to log, categorize, and prevent the same mistakes from happening twice.",
  },
  {
    number: "03",
    title: "Practice Test Review Framework",
    body: "Post-test cleanup that actually moves the score, not just another test taken. Every full-length is followed by a review protocol.",
  },
  {
    number: "04",
    title: "Structured 2 / 4 / 8 Week Timeline",
    body: "A study plan tuned to how much time you have — 2, 4, or 8 weeks — with clear priorities for each phase.",
  },
  {
    number: "05",
    title: "Accountability and Parent Updates",
    body: "Weekly check-ins keep the student honest; structured parent updates keep families informed without micromanaging.",
  },
  {
    number: "06",
    title: "Application Positioning",
    body: "In parallel with score work, we shape a memorable applicant narrative that connects activities, essays, major, and school list.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProofPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof"
        title="The method behind 1510, 1510, and 1540 score outcomes."
        description="Results are not guarantees, but they show the type of focused improvement this system is designed to create for ambitious students."
      />

      {/* 2. Case studies */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <CaseStudyCard key={c.student} {...c} />
          ))}
        </div>
      </Section>

      {/* 3. Method overview */}
      <Section spacing="lg" container="xl" muted>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            The method
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why the results repeat.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six repeatable pieces sit under every case study above. Together they form the coaching system every student in the program runs through.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {method.map((m) => (
            <article
              key={m.title}
              className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-6"
            >
              <span className="font-mono text-xs tracking-widest text-muted-foreground">
                {m.number}
              </span>
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                {m.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* 4. Disclaimer */}
      <Section spacing="lg" container="md">
        <div className="rounded-3xl border border-foreground/15 bg-background p-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Disclaimer
          </span>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Score increases and admissions outcomes are not guaranteed. The program is designed for motivated students who are willing to do the assigned work.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="lg" container="xl">
        <div className="rounded-3xl bg-foreground p-8 text-background sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-background/60">
                Take the next step
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Ready to run the same method?
              </h2>
              <p className="max-w-xl text-background/80">
                Apply to join the cohort or watch the free workshop first.
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

function CaseStudyCard({
  student,
  context,
  before,
  after,
  description,
  featured = false,
}: {
  student: string;
  context: string;
  before: number;
  after: number;
  description: string;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl p-0",
        // Delegate the numeric visual to ProofCard, then attach the case-study
        // description underneath so the case reads as one unit.
      )}
    >
      <ProofCard
        student={`${student}: ${before} → ${after}`}
        context={context}
        before={before}
        after={after}
        featured={featured}
      />
      <p
        className={cn(
          "px-1 text-sm leading-relaxed",
          featured ? "text-foreground/90" : "text-muted-foreground"
        )}
      >
        {description}
      </p>
    </article>
  );
}
