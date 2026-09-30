"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import {
  getProjectStatusClass,
  type PortfolioProject,
  type ProjectCategory,
} from "@/lib/portfolio/projects";
import { cn } from "@/lib/utils";

const categories: ReadonlyArray<"All" | ProjectCategory> = [
  "All",
  "ASIC / VLSI",
  "FPGA",
  "Embedded / PCB",
  "Industry",
  "Creative",
];

export function ProjectGrid({ projects }: { projects: PortfolioProject[] }) {
  const [activeCategory, setActiveCategory] =
    React.useState<(typeof categories)[number]>("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <div
        className="mb-10 flex flex-wrap gap-x-2 gap-y-2 border-b border-foreground/12 pb-5"
        aria-label="Filter projects by category"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors",
              activeCategory === category
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="mb-4 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex min-h-[23rem] flex-col bg-card p-7 transition-colors hover:bg-accent/60 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.15em] text-brand uppercase">
          {project.category}
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

      <div className="technical-grid my-7 flex min-h-36 items-center rounded-md border border-foreground/10 bg-muted/40 p-4">
        <div className="flex w-full items-center">
          {project.diagram.slice(0, 4).map((node, index) => (
            <div key={node} className="contents">
              <span className="flex min-h-12 flex-1 items-center justify-center rounded border border-foreground/15 bg-background/90 px-1.5 text-center font-mono text-[8px] tracking-wide text-foreground/65 uppercase">
                {node}
              </span>
              {index < Math.min(project.diagram.length, 4) - 1 ? (
                <span className="h-px min-w-2 flex-1 bg-brand/40" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[9px] text-muted-foreground">{project.year}</p>
          <h2 className="mt-2 font-heading text-3xl leading-none tracking-[-0.025em]">
            {project.shortTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </div>
        <ArrowUpRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
      </div>
    </Link>
  );
}
