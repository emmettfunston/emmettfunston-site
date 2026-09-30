import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon, CheckIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { CtaButton } from "@/components/site/cta-button";
import { Section } from "@/components/site/section";
import { SectionHeader } from "@/components/site/section-header";
import {
  getProject,
  getProjectStatusClass,
  projects,
} from "@/lib/portfolio/projects";
import { cn } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <Section spacing="lg" container="xl" className="border-b border-foreground/10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeftIcon className="size-4" />
          All projects
        </Link>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
                {project.category}
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {project.year}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-wider uppercase",
                  getProjectStatusClass(project.status)
                )}
              >
                {project.status}
              </span>
            </div>
            <h1 className="mt-6 max-w-5xl font-heading text-6xl leading-[0.9] tracking-[-0.045em] text-balance sm:text-7xl md:text-8xl">
              {project.title}
            </h1>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-foreground/78">
              {project.headline}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded border border-foreground/12 bg-muted/55 px-2.5 py-1.5 font-mono text-[9px] tracking-wide text-foreground/65 uppercase"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section spacing="lg" container="xl">
        <div className="technical-grid flex min-h-[24rem] items-center justify-center overflow-x-auto rounded-xl border border-foreground/12 bg-foreground p-7 text-background sm:min-h-[30rem] sm:p-10">
          <div className="flex min-w-[42rem] items-center">
            {project.diagram.map((node, index) => (
              <div key={node} className="contents">
                <div className="flex min-h-24 flex-1 flex-col items-center justify-center rounded-md border border-background/20 bg-background/5 px-4 text-center">
                  <span className="font-mono text-[9px] tracking-[0.12em] text-background/50 uppercase">
                    0{index + 1}
                  </span>
                  <span className="mt-3 text-sm font-medium text-background">{node}</span>
                </div>
                {index < project.diagram.length - 1 ? (
                  <span className="h-px min-w-5 flex-1 bg-background/30" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
          System-level architecture · simplified for portfolio presentation
        </p>
      </Section>

      <Section spacing="lg" container="xl" tone="band">
        <SectionHeader
          eyebrow="Overview"
          title="What was built."
          description={project.problem}
        />
        <div className="grid gap-8 lg:grid-cols-2">
          {project.overview.map((paragraph) => (
            <p
              key={paragraph}
              className="border-t border-foreground/12 pt-5 text-base leading-relaxed text-foreground/78"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section spacing="xl" container="xl">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
              My work
            </p>
            <h2 className="mt-4 font-heading text-5xl leading-none tracking-tight">
              Ownership and implementation.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 sm:grid-cols-2">
            {project.contributions.map((contribution) => (
              <div key={contribution} className="bg-card p-6">
                <CheckIcon className="size-4 text-brand" aria-hidden />
                <p className="mt-5 text-sm leading-relaxed text-foreground/75">
                  {contribution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section spacing="xl" container="xl" tone="contrast">
        <SectionHeader
          eyebrow="Technical implementation"
          title="The engineering stack."
          description="The implementation details that shaped the architecture, verification, and physical system."
          inverted
        />
        <div className="grid gap-px overflow-hidden rounded-lg border border-background/15 bg-background/15 md:grid-cols-2 lg:grid-cols-3">
          {project.implementation.map((item, index) => (
            <div key={item} className="bg-foreground p-6">
              <span className="font-mono text-[9px] text-background/35">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-5 text-sm font-medium text-background">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="xl" container="xl">
        <div className="grid gap-14 lg:grid-cols-2">
          <CaseStudyList
            eyebrow="Engineering decisions"
            title="Why it was built this way."
            items={project.decisions}
          />
          <CaseStudyList
            eyebrow="Results"
            title={project.status === "In Development" ? "Current state." : "What was verified."}
            items={project.results}
          />
        </div>
      </Section>

      <Section spacing="lg" container="xl" tone="band">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
              What I learned
            </p>
            <p className="mt-5 max-w-3xl font-heading text-3xl leading-tight tracking-[-0.015em] sm:text-4xl">
              {project.learnings}
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-foreground/20 bg-background/50 p-6">
            <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
              Future gallery slot
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {project.mediaPrompt}
            </p>
            <p className="mt-8 text-xs text-muted-foreground">
              No placeholder image is presented as real project evidence.
            </p>
          </div>
        </div>
      </Section>

      <Section spacing="lg" container="xl">
        <div className="flex flex-col gap-6 border-t border-foreground/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.16em] text-brand uppercase">
              Next project
            </p>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="mt-3 inline-flex items-center gap-3 font-heading text-4xl leading-none tracking-tight transition-colors hover:text-brand"
            >
              {nextProject.shortTitle}
              <ArrowUpRightIcon className="size-5" />
            </Link>
          </div>
          <CtaButton href="/projects" variant="secondary">
            Back to all projects
          </CtaButton>
        </div>
      </Section>
    </>
  );
}

function CaseStudyList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <section>
      <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-4xl leading-none tracking-tight">
        {title}
      </h2>
      <ol className="mt-8 border-t border-foreground/12">
        {items.map((item, index) => (
          <li
            key={item}
            className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-foreground/12 py-5 text-sm leading-relaxed text-foreground/75"
          >
            <span className="font-mono text-[9px] text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
