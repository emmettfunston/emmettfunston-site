import type { Metadata } from "next";
import {
  ZapIcon,
  CpuIcon,
  CarIcon,
  CircuitBoardIcon,
  GraduationCapIcon,
  BuildingIcon,
  BriefcaseIcon,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected engineering, education, and internship projects by Emmett Funston — Electrical Engineering at Northwestern.",
  alternates: { canonical: "/projects" },
};

// TODO: Replace placeholder copy, tech stacks, and links with real project
// details as each write-up ships. Each `href: "#"` renders a "Case study
// coming soon" state instead of a broken link.
type Project = {
  title: string;
  tag: string;
  Icon: LucideIcon;
  body: string;
  skills: string[];
  href: string;
  cta?: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "Smart PDU",
    tag: "Hardware",
    Icon: ZapIcon,
    body:
      "A network-managed power distribution unit combining embedded firmware, per-outlet control, and a browser dashboard for remote switching and telemetry.",
    skills: ["Embedded", "PCB Design", "Firmware", "Networking"],
    href: "#",
  },
  {
    title: "FPGA Projects",
    tag: "Digital Design",
    Icon: CpuIcon,
    body:
      "Digital design projects on FPGAs — pipelined datapaths, memory-mapped peripherals, and custom accelerators — implemented in SystemVerilog with self-checking testbenches.",
    skills: ["SystemVerilog", "Vivado", "Simulation", "RTL Design"],
    href: "#",
  },
  {
    title: "Formula SAE",
    tag: "Motorsports · Electrical",
    Icon: CarIcon,
    body:
      "Electrical subsystem work on Northwestern's Formula SAE team — wiring harness design, sensor integration, and telemetry for the competition car.",
    skills: ["Wiring Harness", "CAN Bus", "Sensors", "Telemetry"],
    href: "#",
  },
  {
    title: "VLSI / Innovus",
    tag: "Chip Design",
    Icon: CircuitBoardIcon,
    body:
      "Full RTL-to-GDSII flow on standard-cell CMOS blocks using Cadence Innovus — synthesis, floorplanning, placement, clock-tree synthesis, and routing.",
    skills: ["Cadence Innovus", "Standard Cells", "Physical Design", "TCL"],
    href: "#",
  },
  {
    title: "Pathway Tutors",
    tag: "Product · Education",
    Icon: GraduationCapIcon,
    body:
      "An SAT tutoring marketplace connecting motivated high schoolers with mentors at top universities. Product direction, ops, and go-to-market.",
    skills: ["Product", "Marketplace", "Ops", "Growth"],
    href: "#",
    cta: "Case study coming soon",
    featured: true,
  },
  {
    title: "Schneider Electric Internship",
    tag: "Internship",
    Icon: BriefcaseIcon,
    body:
      "Engineering internship at Schneider Electric — contributions on power management products and internal tooling.",
    skills: ["Power Systems", "Internship", "Industry"],
    href: "#",
  },
  {
    title: "Bambeck Systems Internship",
    tag: "Internship",
    Icon: BuildingIcon,
    body:
      "Engineering internship at Bambeck Systems — hardware and systems work in a production engineering environment.",
    skills: ["Hardware", "Systems", "Internship"],
    href: "#",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I build."
        description="Selected engineering, chip design, motorsports, education, and internship projects. Deeper write-ups land here as each one ships."
        actions={
          <CtaButton href="/resume" variant="secondary" size="lg">
            View resume
          </CtaButton>
        }
      />

      <Section spacing="lg" container="xl">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          More projects and full case studies are on the way.
        </p>
      </Section>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { title, tag, Icon, body, skills, href, cta, featured } = project;
  const isPlaceholder = href === "#";

  return (
    <article
      className={cn(
        "group flex flex-col gap-5 rounded-2xl border p-6 transition-colors",
        featured
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/10 bg-background hover:border-foreground/25"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase",
            featured ? "text-background/70" : "text-muted-foreground"
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {tag}
        </span>
        {featured ? (
          <span className="rounded-full bg-background/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-background">
            Featured
          </span>
        ) : null}
      </div>

      <div>
        <h2
          className={cn(
            "font-heading text-xl font-semibold tracking-tight",
            featured ? "text-background" : "text-foreground"
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            featured ? "text-background/80" : "text-muted-foreground"
          )}
        >
          {body}
        </p>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <li
            key={s}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
              featured
                ? "border-background/25 bg-background/10 text-background/90"
                : "border-foreground/10 bg-muted/60 text-foreground/80"
            )}
          >
            {s}
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-auto flex items-center justify-between border-t pt-4",
          featured ? "border-background/15" : "border-foreground/10"
        )}
      >
        {isPlaceholder ? (
          <span
            className={cn(
              "text-xs",
              featured ? "text-background/70" : "text-muted-foreground"
            )}
          >
            {cta ?? "Case study coming soon"}
          </span>
        ) : (
          <CtaButton
            href={href}
            variant={featured ? "secondary" : "ghost"}
            size="md"
            className={cn(featured && "bg-background text-foreground border-transparent hover:bg-background/90")}
          >
            {cta ?? "View project"}
          </CtaButton>
        )}
      </div>
    </article>
  );
}
