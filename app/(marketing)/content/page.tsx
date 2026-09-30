import type { Metadata } from "next";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ClapperboardIcon,
  FlaskConicalIcon,
  PlayIcon,
} from "lucide-react";

import { YoutubeBrandIcon } from "@/components/site/brand-icons";
import { CtaButton } from "@/components/site/cta-button";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { SectionHeader } from "@/components/site/section-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Videos from Emmett Funston covering engineering, math, science, technology, learning, and student life.",
  alternates: { canonical: "/content" },
};

const themes = [
  {
    Icon: FlaskConicalIcon,
    title: "Engineering & science",
    body: "Hardware, physics, computing, and the technical ideas behind systems that matter.",
  },
  {
    Icon: BookOpenIcon,
    title: "Learning & education",
    body: "Clear explanations of difficult academic ideas and the process of learning them.",
  },
  {
    Icon: ClapperboardIcon,
    title: "Building in public",
    body: "Projects, student life, career decisions, filmmaking, and broader technology stories.",
  },
];

export default function MediaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="Technical ideas, made understandable."
        description="I make videos across engineering, math, science, education, technology, and student life. The work supports the portfolio without turning it into an influencer site."
        actions={
          <CtaButton href={siteConfig.youtube} external size="lg">
            Visit YouTube
          </CtaButton>
        }
      />

      <Section spacing="xl" container="xl">
        <SectionHeader
          eyebrow="Featured"
          title="A current technical story."
          description="This card links to the channel until a stable direct video URL is added."
        />
        <a
          href={siteConfig.youtube}
          target="_blank"
          rel="noreferrer"
          className="group grid overflow-hidden rounded-xl border border-foreground/12 bg-card lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="technical-grid relative flex min-h-[24rem] items-center justify-center bg-foreground text-background">
            <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.16em] text-background/45 uppercase">
              Mathematics · AI · Fluid dynamics
            </div>
            <span className="grid size-20 place-items-center rounded-full border border-background/25 transition-transform group-hover:scale-105">
              <PlayIcon className="ml-1 size-6 fill-current" />
            </span>
          </div>
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <YoutubeBrandIcon className="size-6 text-brand" />
              <h2 className="mt-8 font-heading text-5xl leading-[0.95] tracking-[-0.03em]">
                Did AI Just Solve this $1 MILLION Math Problem?
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                A video about the Navier–Stokes existence and smoothness problem,
                Millennium Prize Problems, AI-assisted mathematical research, and
                what a claimed breakthrough would need to prove.
              </p>
            </div>
            <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium transition-colors group-hover:text-brand">
              Open @EmmettFunston
              <ArrowUpRightIcon className="size-4" />
            </span>
          </div>
        </a>
      </Section>

      <Section spacing="xl" container="xl" tone="band">
        <SectionHeader
          eyebrow="Editorial range"
          title="A supporting creative practice."
          description="The subject range is broad, but the approach is consistent: understand the technical core, then explain it clearly."
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 md:grid-cols-3">
          {themes.map(({ Icon, title, body }, index) => (
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
        <div className="grid gap-8 border-t border-foreground/12 pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
              Engineering first
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-4xl leading-none">
              The portfolio remains the center of the site.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Media shows how I communicate, research, and frame technical ideas.
              The project case studies show the engineering itself.
            </p>
          </div>
          <CtaButton href="/projects" variant="secondary">
            Explore projects
          </CtaButton>
        </div>
      </Section>
    </>
  );
}
