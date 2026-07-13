import type { Metadata } from "next";
import { CheckIcon, XIcon } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { ProofCard } from "@/components/site/proof-card";
import { PackageCard } from "@/components/site/package-card";
import { Faq, type FaqItem } from "@/components/site/faq";
import { getPathwayBookingUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "SAT & Admissions Coaching",
  description:
    "SAT score improvement and elite college application strategy for ambitious students. A selective coaching program built by a Northwestern Engineering student.",
  alternates: { canonical: "/sat-admissions" },
  openGraph: {
    title: "SAT & Admissions Coaching — Emmett Funston",
    description:
      "SAT score improvement and elite college application strategy for ambitious students, built by a Northwestern Engineering student.",
  },
};

const idealFor = [
  "Students aiming for 1450–1550+ SAT scores",
  "Students applying to selective or elite colleges",
  "Students who are already motivated but need a sharper system",
  "Students who want accountability, structure, and serious peers",
  "Students interested in engineering, CS, business, pre-med, or competitive majors",
];

const notFor = [
  "Students looking for basic homework help",
  "Students expecting guaranteed results without work",
  "Students who want someone to write their application for them",
  "Students who are not willing to follow a structured plan",
];

const processSteps = [
  {
    title: "Apply",
    body: "Submit a short application so we can understand the student's goals and timeline.",
  },
  {
    title: "Interview",
    body: "A brief call to make sure the program is the right fit for the student and family.",
  },
  {
    title: "Get accepted",
    body: "Accepted students are invited to join the current cohort with a package recommendation.",
  },
  {
    title: "Receive roadmap / study plan",
    body: "A personalized SAT and admissions roadmap based on starting score, target schools, and timeline.",
  },
  {
    title: "Join private Discord / community",
    body: "Serious peers only — for accountability, feedback, and momentum between sessions.",
  },
  {
    title: "Attend weekly group meetings",
    body: "Structured cohort sessions to teach the system, review progress, and troubleshoot in real time.",
  },
  {
    title: "Complete assigned work",
    body: "Targeted problem sets, timed practice, and application milestones — the reps that actually move scores.",
  },
  {
    title: "Use mentor / private call credits",
    body: "Cohort packages include private mentor call credits for essay work and 1-on-1 strategy time.",
  },
  {
    title: "Track progress through parent updates",
    body: "Structured updates so parents can see momentum without getting in the middle of the coaching.",
  },
];

const faqs: FaqItem[] = [
  {
    question: "Is this normal tutoring?",
    answer:
      "No. This is a selective coaching program — not homework help and not a general tutoring service. It combines an SAT prep system, application strategy, and weekly accountability inside a small cohort.",
  },
  {
    question: "Who is the ideal student?",
    answer:
      "An ambitious high schooler — usually already scoring in the 1300s or 1400s — who wants to break into the 1500s and apply to selective universities with a real strategy, not a template.",
  },
  {
    question: "Do you guarantee a score increase?",
    answer:
      "No. Nobody credible does. Score gains depend on the student's effort and starting point. What we guarantee is a real system, honest feedback, and weekly accountability.",
  },
  {
    question: "Do you guarantee college admission?",
    answer:
      "No. Admissions decisions are made by universities and involve many factors outside anyone's control. We focus on making applications as strong and memorable as possible.",
  },
  {
    question: "How do mentor call credits work?",
    answer:
      "Cohort packages include a set number of private mentor call credits with Emmett. Students book those calls during their program for targeted essay reviews, strategy sessions, or SAT deep-dives.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "You'll hear back within a few days with next steps. Accepted students go through a brief interview, receive a package recommendation, and are onboarded into the current cohort.",
  },
  {
    question: "Can parents be involved?",
    answer:
      "Yes. Parents receive structured progress updates so they can stay informed without getting in the middle of the coaching relationship.",
  },
  {
    question: "Is this separate from Pathway Tutors?",
    answer:
      "This site is Emmett Funston's personal SAT/admissions coaching site. Individual 1-on-1 calls may be booked through an external booking profile, but cohort applications and packages are managed separately.",
  },
];

export default function SatAdmissionsPage() {
  const pathwayBookingUrl = getPathwayBookingUrl();

  return (
    <>
      <PageHeader
        eyebrow="SAT & Admissions"
        title="SAT score improvement and elite college application strategy for ambitious students."
        description="Built by a Northwestern Engineering student whose SAT method helped produce 1510, 1510, and 1540 score outcomes."
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

      {/* 1. Who this is for / 2. Who this is not for */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-background p-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-xl bg-foreground text-background"
              >
                <CheckIcon className="size-4" />
              </span>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Who this is for
                </span>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Ambitious. Coachable. Serious.
                </h2>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {idealFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-muted/40 p-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-xl bg-muted-foreground/15 text-muted-foreground"
              >
                <XIcon className="size-4" />
              </span>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Who this is not for
                </span>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Not a fit for everyone — on purpose.
                </h2>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {notFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 3. Proof / Results */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Proof
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The method has been repeated.
            </h2>
          </div>
          <CtaButton
            href="/sat-admissions/proof"
            variant="ghost"
            size="md"
            className="w-fit"
          >
            See full proof
          </CtaButton>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProofCard
            student="Emmett"
            context="Founder · self-coached"
            before={1390}
            after={1510}
            outcome="Broke into the 1500s and unlocked Northwestern Engineering."
            featured
          />
          <ProofCard
            student="Brother"
            context="Northwestern Engineering ED"
            before={1480}
            after={1540}
            outcome="Sharpened the last 60 points and executed a decisive Early Decision application."
          />
          <ProofCard
            student="Student"
            context="Same method, repeated"
            before={1390}
            after={1510}
            outcome="Repeatable 120-point improvement — not a one-off."
          />
        </div>

        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
          Score increases and admissions outcomes are not guaranteed.
        </p>
      </Section>

      {/* 4. How the program works */}
      <Section spacing="lg" container="xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            How the program works
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A clear, structured process from day one.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every student goes through the same nine steps. The specifics are tailored to starting score, timeline, and target schools.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-xl bg-foreground font-heading text-sm font-semibold text-background tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5. Package overview */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Packages
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Three ways to work together.
            </h2>
          </div>
          <CtaButton
            href="/sat-admissions/packages"
            variant="ghost"
            size="md"
            className="w-fit"
          >
            Compare all packages
          </CtaButton>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <PackageCard
            name="SAT Score Jump Lab"
            positioning="For students focused on breaking through the SAT and hitting a target score."
            price="$2,000"
            bullets={[
              "Structured SAT roadmap and problem sets",
              "Weekly group cohort meetings",
              "Private Discord / community access",
              "Progress tracking with parent updates",
            ]}
            ctaLabel="View details"
            ctaHref="/sat-admissions/packages"
          />
          <PackageCard
            name="Elite SAT + Admissions Cohort"
            positioning="The full program — SAT system plus complete elite admissions strategy."
            price="$4,500"
            bullets={[
              "Everything in SAT Score Jump Lab",
              "Complete elite college application strategy",
              "Mentor / private call credits with Emmett",
              "Essay coaching and supplement strategy",
            ]}
            ctaLabel="View details"
            ctaHref="/sat-admissions/packages"
            featured
            badge="Most Popular"
          />
          <PackageCard
            name="Elite Application Lab"
            positioning="For students who already have their SAT locked and need a serious application strategy."
            price="$3,000"
            bullets={[
              "College list build (reach / target / likely)",
              "Common App essay coaching",
              "Activities list and supplement essay strategy",
              "Mentor / private call credits with Emmett",
            ]}
            ctaLabel="View details"
            ctaHref="/sat-admissions/packages"
          />
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Payment is only requested after your application is accepted.
        </p>
      </Section>

      {/* 6. Mentor / private call explanation */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-8 rounded-3xl border border-foreground/10 bg-background p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:p-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Mentor & private calls
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Two ways to work 1-on-1 with Emmett.
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-foreground/10 bg-muted/40 p-5">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                Inside a cohort package
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cohort packages include mentor call credits. Students book those private calls with Emmett throughout the program for essay work, SAT deep-dives, and strategy sessions.
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-muted/40 p-5">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                Standalone 1-on-1 calls
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Individual 1-on-1 calls with Emmett can be booked separately through an external booking profile. Great for a single strategic question, essay feedback, or a gut-check.
              </p>
              <CtaButton
                href={pathwayBookingUrl}
                variant="secondary"
                size="md"
                external
                className="mt-4 w-fit"
              >
                Book a 1-on-1 call
              </CtaButton>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. FAQ */}
      <Section spacing="lg" container="md">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            FAQ
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions from parents and students
          </h2>
        </div>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </Section>

      {/* 8. Final CTA */}
      <Section spacing="lg" container="xl">
        <div className="rounded-3xl bg-foreground p-8 text-background sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-background/60">
                Take the next step
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Ready to work on your SAT and application?
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
