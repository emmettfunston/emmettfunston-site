import type { Metadata } from "next";
import { FileTextIcon } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = {
  title: "The Elite Roadmap",
  description:
    "The Elite Roadmap is a personalized master plan connecting SAT strategy, application positioning, school list, essays, activities, mentor calls, and weekly execution.",
  alternates: { canonical: "/sat-admissions/roadmap" },
  openGraph: {
    title: "The Elite Roadmap — Emmett Funston SAT & Admissions",
    description:
      "A personalized master plan connecting SAT strategy, application positioning, school list, essays, activities, mentor calls, and weekly execution.",
  },
};

type RoadmapSection = {
  number: string;
  title: string;
  intro?: string;
  bullets: string[];
};

const sections: RoadmapSection[] = [
  {
    number: "01",
    title: "Student Snapshot",
    intro: "A single-page portrait of who the student is today.",
    bullets: [
      "Grade",
      "Current SAT / PSAT",
      "Target SAT",
      "Target schools",
      "Intended major",
      "GPA / course rigor",
      "Current activities",
      "Application timeline",
    ],
  },
  {
    number: "02",
    title: "SAT Strategy",
    intro: "The scoring engine — what to work on and how.",
    bullets: [
      "Current score",
      "Target score",
      "Next test date",
      "Score leaks",
      "Assigned 2 / 4 / 8-week track",
      "Practice test schedule",
      "Daily practice expectations",
    ],
  },
  {
    number: "03",
    title: "Application Positioning",
    intro: "How you'll be read by an admissions officer.",
    bullets: [
      "Current applicant identity",
      "Strongest true themes",
      "Intended major strategy",
      "Likely application angle",
      "Weak points to fix",
      "Activities to emphasize",
    ],
  },
  {
    number: "04",
    title: "School List Strategy",
    intro: "A defensible list built around the profile — not vibes.",
    bullets: [
      "Reach schools",
      "Target schools",
      "Safety schools",
      "ED / EA / RD thoughts",
      "Best-fit schools for profile / story",
    ],
  },
  {
    number: "05",
    title: "Essay Strategy",
    intro: "Direction before drafting so the essays actually land.",
    bullets: [
      "Possible personal statement angles",
      "Topics to avoid",
      "Supplemental essay themes",
      "Stories and details to collect",
    ],
  },
  {
    number: "06",
    title: "Activity List Strategy",
    intro: "How the activities section actually reads to an adcom.",
    bullets: [
      "Top activities to highlight",
      "Descriptions needing rewriting",
      "Missing numbers / impact",
      "Possible leadership / project upgrades",
    ],
  },
  {
    number: "07",
    title: "Mentor Call Plan",
    intro: "How your mentor call credits get used with intention.",
    bullets: [
      "Which mentors to book",
      "What each call should focus on",
      "Prep work before calls",
      "Follow-up actions",
    ],
  },
  {
    number: "08",
    title: "Parent Communication Plan",
    intro: "Keeps parents informed without pulling them into the coaching.",
    bullets: [
      "Weekly email focus",
      "Key milestones",
      "Deadlines",
      "Parent decision points",
    ],
  },
  {
    number: "09",
    title: "Weekly Action Plan",
    intro: "The living execution layer that ties everything above together.",
    bullets: [
      "SAT assignments",
      "Application assignments",
      "Mentor calls",
      "Essay / activity deadlines",
      "Parent updates",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Elite Roadmap"
        title="The Elite Roadmap"
        description="A personalized master plan connecting SAT strategy, application positioning, school list, essays, activities, mentor calls, and weekly execution."
        actions={
          <>
            <CtaButton href="/sat-admissions/apply" variant="primary" size="lg">
              Apply to Join
            </CtaButton>
            <CtaButton
              href="/sat-admissions/packages"
              variant="secondary"
              size="lg"
            >
              View Packages
            </CtaButton>
          </>
        }
      />

      {/* Overview strip */}
      <Section spacing="md" container="xl">
        <div className="grid gap-6 rounded-3xl border border-foreground/10 bg-background p-6 lg:grid-cols-[auto_1fr] lg:items-center lg:p-8">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="grid size-12 place-items-center rounded-2xl bg-foreground text-background"
            >
              <FileTextIcon className="size-5" />
            </span>
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                A deliverable, not a slide deck
              </span>
              <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-foreground">
                Nine sections. One executable plan.
              </h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
            The Roadmap is written for a specific student — their score, timeline, target schools, and story. It gets referenced every week, updated as things change, and drives every session.
          </p>
        </div>
      </Section>

      {/* 1–9. Roadmap sections */}
      <Section spacing="lg" container="xl">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <li
              key={s.number}
              className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-xl bg-foreground font-heading text-sm font-semibold text-background tabular-nums"
                >
                  {s.number}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>
              </div>
              {s.intro ? (
                <p className="text-sm text-muted-foreground">{s.intro}</p>
              ) : null}
              <ul className="mt-1 flex flex-col gap-1.5 border-t border-foreground/10 pt-4 text-sm text-foreground/90">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full bg-foreground/50"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section spacing="lg" container="xl">
        <div className="rounded-3xl bg-foreground p-8 text-background sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-background/60">
                Get your own Roadmap
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Ready to build your Elite Roadmap?
              </h2>
              <p className="max-w-xl text-background/80">
                The Roadmap is built for you once you&apos;re accepted into the flagship cohort. Start with the application or explore the packages.
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
                href="/sat-admissions/packages"
                variant="ghost"
                size="lg"
                className="border border-background/25 text-background hover:bg-background/10"
              >
                View Packages
              </CtaButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
