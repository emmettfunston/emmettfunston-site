import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CompassIcon,
  CpuIcon,
  MusicIcon,
  TrendingUpIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { ProofCard } from "@/components/site/proof-card";
import {
  disclaimer,
  getPathwayBookingUrl,
  siteConfig,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "Emmett Funston" },
  description:
    "Northwestern EE student helping ambitious students improve SAT scores, build stronger college applications, and pursue serious academic and career goals.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Emmett Funston",
    description:
      "Northwestern EE student helping ambitious students improve SAT scores, build stronger college applications, and pursue serious academic and career goals.",
    url: siteConfig.url,
    type: "website",
  },
};

const proofResultDisclaimer =
  "Results are not guarantees. They show the type of focused, ambitious student this system is designed for.";

const helpWith = [
  {
    icon: TrendingUpIcon,
    title: "SAT Score Improvement",
    body: "A focused system to move ambitious scorers from the 1300s into the 1500s with disciplined practice, not busywork.",
  },
  {
    icon: CompassIcon,
    title: "Elite College Application Strategy",
    body: "Positioning, essays, and activity narratives designed to stand out at selective schools and engineering programs.",
  },
  {
    icon: UsersIcon,
    title: "1-on-1 Mentorship",
    body: "Direct private mentor calls for targeted essay feedback, strategy sessions, and honest guidance.",
  },
  {
    icon: CpuIcon,
    title: "EE / Projects / Career Portfolio",
    body: "Electrical engineering work from Northwestern — projects, hardware, and career thinking as it takes shape.",
  },
  {
    icon: VideoIcon,
    title: "Content / YouTube",
    body: "Essays, breakdowns, and videos on SAT prep, selective admissions, and the mindset of ambitious students.",
  },
  {
    icon: MusicIcon,
    title: "Drums",
    body: "The other discipline that keeps the mind sharp. Recordings and practice clips coming soon.",
  },
];

const personalLinks = [
  {
    title: "Projects",
    href: "/projects",
    body: "Engineering work, coaching, and side experiments.",
  },
  {
    title: "Resume",
    href: "/resume",
    body: "Background, education, and highlights.",
  },
  {
    title: "Content",
    href: "/content",
    body: "Essays, breakdowns, and short videos.",
  },
  {
    title: "Drums",
    href: "/drums",
    body: "Practice clips and playing.",
  },
];

export default function HomePage() {
  const pathwayBookingUrl = getPathwayBookingUrl();

  return (
    <>
      {/* Hero */}
      <Section spacing="xl" container="xl" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_70%)]"
        />
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Northwestern EE · SAT & Admissions Coach
          </span>

          <h1 className="font-heading max-w-4xl text-5xl leading-[0.98] font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[88px]">
            Emmett Funston
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Northwestern EE student helping ambitious students improve SAT scores, build stronger college applications, and pursue serious academic and career goals.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:flex-wrap">
            <CtaButton
              href="/sat-admissions"
              variant="primary"
              size="lg"
            >
              View SAT &amp; Admissions Packages
            </CtaButton>
            <CtaButton
              href="/sat-admissions/workshop"
              variant="secondary"
              size="lg"
            >
              Register for Free Workshop
            </CtaButton>
            <CtaButton
              href={pathwayBookingUrl}
              variant="ghost"
              size="lg"
              external
            >
              Book a 1-on-1 Call
            </CtaButton>
          </div>
        </div>
      </Section>

      {/* 1. Proof */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Proof
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Real score jumps. Real admissions.
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
            student="Emmett (Founder)"
            context="Self-coached with the same system"
            before={1390}
            after={1510}
            outcome="1390 → 1510 SAT. Broke into the 1500s and used the extra points to unlock Northwestern Engineering."
            featured
          />
          <ProofCard
            student="Emmett's brother"
            context="Admitted ED to Northwestern Engineering"
            before={1480}
            after={1540}
            outcome="1480 → 1540 + Northwestern Engineering ED. Sharpened the last 60 points and executed a decisive Early Decision application."
          />
          <ProofCard
            student="Coached student"
            context="Same method, repeated on a student"
            before={1390}
            after={1510}
            outcome="1390 → 1510 Student Result. Repeatable 120-point improvement — not a one-off."
          />
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {proofResultDisclaimer}
        </p>
      </Section>

      {/* 2. About */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              About
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built from experience,
              <br className="hidden sm:block" />
              not theory.
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-foreground/85">
              I&apos;m Emmett, an Electrical Engineering student at Northwestern University. I built my SAT/admissions approach after experiencing firsthand how much faster students can improve when they stop studying randomly and start using a focused system.
            </p>
            <div className="flex flex-col gap-3 border-l-2 border-foreground/15 pl-6">
              <p className="text-sm text-muted-foreground">
                Northwestern University · McCormick School of Engineering
              </p>
              <p className="text-sm text-muted-foreground">
                Coaching a small, selective group of ambitious students each cycle.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. What I help with */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              What I help with
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A focused set of things I take seriously.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {helpWith.map((h) => {
            const Icon = h.icon;
            return (
              <article
                key={h.title}
                className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-6 transition-shadow hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-xl bg-foreground/[0.06] text-foreground"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                  {h.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {h.body}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* 4. Featured SAT & Admissions */}
      <Section spacing="lg" container="xl">
        <div className="grid gap-10 rounded-3xl border border-foreground/10 bg-background p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-12">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Featured · SAT & Admissions
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The SAT & Admissions program
            </h2>
            <p className="text-muted-foreground">
              A serious, selective coaching program for ambitious high schoolers. Weekly accountability, a real SAT system, and college applications built to be memorable at selective schools. Intake-only — students apply first.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <CtaButton
                href="/sat-admissions"
                variant="primary"
                size="lg"
              >
                Explore the program
              </CtaButton>
              <CtaButton
                href="/sat-admissions/packages"
                variant="secondary"
                size="lg"
              >
                See packages
              </CtaButton>
            </div>
          </div>

          <ul className="grid gap-3">
            {[
              "Structured SAT prep, not busywork",
              "Weekly accountability with Emmett",
              "College list, essay, and activities strategy",
              "Selective intake — small cohort each cycle",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-muted/40 p-4 text-sm text-foreground/85"
              >
                <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Personal links */}
      <Section spacing="lg" container="xl" muted>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            More of me
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Beyond coaching.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {link.title}
                </h3>
                <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {link.body}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 6. Final CTA */}
      <Section spacing="lg" container="xl">
        <div className="rounded-3xl bg-foreground p-8 text-background sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-background/60">
                Ready when you are
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Want help with SAT strategy or college applications?
              </h2>
              <p className="max-w-xl text-background/80">
                Apply to the cohort, watch the free workshop, or book a private 1-on-1 mentor call. All three paths start below.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <CtaButton
                href="/sat-admissions/apply"
                variant="secondary"
                size="lg"
                className="border-transparent bg-background text-foreground hover:bg-background/90"
              >
                Apply to the Cohort
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
                Book 1-on-1
              </CtaButton>
            </div>
          </div>
          <p className="mt-10 max-w-3xl border-t border-background/15 pt-6 text-xs leading-relaxed text-background/60">
            {disclaimer}
          </p>
        </div>
      </Section>
    </>
  );
}
