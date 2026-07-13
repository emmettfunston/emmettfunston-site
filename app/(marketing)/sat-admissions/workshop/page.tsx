import type { Metadata } from "next";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ProofCard } from "@/components/site/proof-card";
import { WorkshopForm } from "@/components/site/workshop-form";

export const metadata: Metadata = {
  title: "Free Workshop — Break 1450+ SAT and Build an Elite Application",
  description:
    "A free workshop on how to break 1450+ on the SAT and build an elite college application strategy. Led by a Northwestern Engineering student.",
  alternates: { canonical: "/sat-admissions/workshop" },
  openGraph: {
    title:
      "Free Workshop — How to Break 1450+ SAT and Build an Elite College Application Strategy",
    description:
      "Led by a Northwestern Engineering student whose SAT method helped produce 1510, 1510, and 1540 score outcomes.",
  },
};

const learnBullets = [
  "Why smart students plateau around 1300–1450",
  "How to diagnose SAT score leaks",
  "How to review mistakes correctly",
  "How to build a stronger college application narrative",
  "How activities, essays, major choice, and school list should work together",
  "How the cohort / application process works",
];

const attendeeBullets = [
  "Students aiming for 1450+ SAT scores",
  "Students targeting selective colleges",
  "Parents who want a serious strategy for their student",
  "Students who want structure, accountability, and a competitive peer environment",
];

export default function WorkshopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free workshop"
        title="How to Break 1450+ SAT and Build an Elite College Application Strategy"
        description="Led by a Northwestern Engineering student whose SAT method helped produce 1510, 1510, and 1540 score outcomes."
      />

      <Section spacing="lg" container="xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* 1 + 2. What you'll learn / Who should attend */}
          <div className="flex flex-col gap-10">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                1 · What you&apos;ll learn
              </span>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Real strategy. No filler.
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {learnBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background p-4 text-sm text-foreground/90"
                  >
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                2 · Who should attend
              </span>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built for ambitious students and their parents.
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {attendeeBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-muted/40 p-4 text-sm text-foreground/90"
                  >
                    <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Registration form (rendered adjacent to the summary on desktop) */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-lg shadow-foreground/[0.03] sm:p-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Reserve your seat
                </span>
                <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Register free
                </h3>
                <p className="text-sm text-muted-foreground">
                  Delivered by email · Open to students and parents
                </p>
              </div>
              <div className="mt-6">
                <WorkshopForm />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* 3. Founder proof */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              3 · Founder proof
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The workshop is taught by someone who&apos;s lived it.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProofCard
            student="Emmett Funston"
            context="Founder · Northwestern EE"
            before={1390}
            after={1510}
            outcome="Self-coached with the same system taught in the workshop."
            featured
          />
          <ProofCard
            student="Emmett's brother"
            context="Northwestern Engineering ED"
            before={1480}
            after={1540}
            outcome="1480 → 1540 + Northwestern Engineering ED."
          />
          <ProofCard
            student="Coached student"
            context="Ambitious high schooler"
            before={1390}
            after={1510}
            outcome="1390 → 1510 student result — same method, repeatable."
          />
        </div>

        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
          Score increases and admissions outcomes are not guaranteed.
        </p>
      </Section>
    </>
  );
}
