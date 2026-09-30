import type { Metadata } from "next";
import {
  ActivityIcon,
  AudioLinesIcon,
  CircleDotIcon,
  Music2Icon,
} from "lucide-react";

import { CtaButton } from "@/components/site/cta-button";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { SectionHeader } from "@/components/site/section-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Drumming",
  description:
    "Drumming, music, and leadership outside engineering from Emmett Funston.",
  alternates: { canonical: "/drums" },
};

const chapters = [
  {
    Icon: CircleDotIcon,
    title: "10+ years playing",
    body: "Drum set, ensemble playing, practice, performance, and the repetition required to make timing feel natural.",
  },
  {
    Icon: ActivityIcon,
    title: "Leadership",
    body: "Marching and school music experience including Drum Major and section leadership responsibilities.",
  },
  {
    Icon: AudioLinesIcon,
    title: "Creative discipline",
    body: "Music provides a different feedback loop from engineering: immediate, physical, collaborative, and impossible to fake.",
  },
];

export default function DrumsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Outside engineering"
        title="Ten years of rhythm, repetition, and performance."
        description="Drumming is the longest-running personal practice in my life. It is a small part of this portfolio, but an important part of how I work."
        actions={
          <CtaButton href={siteConfig.youtube} external variant="secondary" size="lg">
            Visit YouTube
          </CtaButton>
        }
      />

      <Section spacing="xl" container="xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="technical-grid flex min-h-[32rem] flex-col justify-between rounded-xl bg-foreground p-7 text-background sm:p-10">
            <Music2Icon className="size-8 text-background/55" />
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-background/45 uppercase">
                Personal practice
              </p>
              <p className="mt-5 max-w-2xl font-heading text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
                Precision means listening before reacting.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-lg leading-relaxed text-foreground/78">
                Music taught me to work through difficult passages slowly, isolate
                the real problem, and build speed only after the fundamentals are
                reliable. That process transfers directly to debugging hardware.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Performance clips and photography will be added when there are
                finished pieces worth showing. This page does not use fabricated
                cover titles, durations, or placeholder achievements.
              </p>
            </div>
            <div className="mt-12 border-t border-foreground/12 pt-5">
              <p className="font-mono text-[9px] tracking-[0.16em] text-brand uppercase">
                Future visual
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Add a real performance photo or approved video still here.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="xl" container="xl" tone="band">
        <SectionHeader
          eyebrow="What it represents"
          title="A different kind of technical practice."
          description="The point is not to turn the site into a music portfolio. It is to show the discipline and leadership behind the engineer."
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 md:grid-cols-3">
          {chapters.map(({ Icon, title, body }, index) => (
            <article key={title} className="bg-card p-7">
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-brand" />
                <span className="font-mono text-[9px] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-12 text-base font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section spacing="lg" container="xl">
        <div className="flex flex-col gap-6 border-t border-foreground/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
              Back to the work
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-none">
              See the engineering portfolio.
            </h2>
          </div>
          <CtaButton href="/projects" variant="secondary">
            View projects
          </CtaButton>
        </div>
      </Section>
    </>
  );
}
