import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  GraduationCapIcon,
  MailIcon,
  Music2Icon,
  PlayIcon,
} from "lucide-react";

import {
  GithubBrandIcon,
  LinkedinBrandIcon,
  YoutubeBrandIcon,
} from "@/components/site/brand-icons";
import { CtaButton } from "@/components/site/cta-button";
import { Section } from "@/components/site/section";
import { SectionHeader } from "@/components/site/section-header";
import {
  featuredProjects,
  getProjectStatusClass,
} from "@/lib/portfolio/projects";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Emmett Funston — Digital Hardware Engineer" },
  description:
    "Electrical Engineering student at Northwestern building digital hardware across RTL, ASIC physical design, FPGA, embedded systems, and PCBs.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Emmett Funston — Digital Hardware Engineer",
    description:
      "Electrical Engineering at Northwestern. FPGA, ASIC/VLSI, RTL, embedded hardware, and PCB design.",
    url: siteConfig.url,
    type: "website",
  },
};

const stackLayers = [
  { index: "01", label: "Transistors", detail: "SRAM · CMOS · Spectre" },
  { index: "02", label: "RTL", detail: "Verilog · MAC arrays" },
  { index: "03", label: "FPGA / ASIC", detail: "Vivado · Innovus" },
  { index: "04", label: "PCB", detail: "Altium · KiCad · Power" },
  { index: "05", label: "System", detail: "STM32 · CAN · Ethernet" },
];

const experience = [
  {
    period: "2026",
    company: "Schneider Electric / ASCO Power Technologies",
    role: "Engineering Intern",
    summary:
      "Analyzed one-line diagrams, specifications, and application requirements for automatic transfer switches and power-control systems; explored engineering workflow automation.",
    skills: ["Power Systems", "One-Lines", "Application Engineering"],
  },
  {
    period: "2024",
    company: "Bambeck Systems",
    role: "Electrical Engineering Intern",
    summary:
      "Troubleshot, repaired, aligned, and calibrated industrial quantum-cascade-laser gas analyzers in the field, supported by C++ control software and Python logging tools.",
    skills: ["Instrumentation", "C++", "Python", "Field Engineering"],
  },
  {
    period: "Current",
    company: "Formula SAE Electric",
    role: "Embedded Electronics",
    summary:
      "Designed STM32 and CAN-based vehicle electronics spanning mixed-signal sensing, multi-rail power, PCB layout, firmware, and board bring-up.",
    skills: ["STM32", "CAN", "Altium", "Embedded C++"],
  },
];

const skillGroups = [
  {
    title: "Digital Hardware",
    items: ["Verilog", "RTL design", "Testbenches", "Synthesis", "Timing analysis", "Hardware acceleration"],
  },
  {
    title: "Semiconductor / VLSI",
    items: ["Virtuoso", "Spectre", "Innovus", "SRAM", "Physical design", "CTS", "DRC / LVS"],
  },
  {
    title: "Embedded / FPGA",
    items: ["STM32", "RP2350", "Artix-7", "C / C++", "Vivado", "Firmware", "Board bring-up"],
  },
  {
    title: "PCB / Interfaces",
    items: ["KiCad", "Altium", "CAN", "I2C", "SPI", "UART", "Ethernet", "MQTT"],
  },
];

export default function HomePage() {
  return (
    <>
      <Section spacing="xl" container="xl" className="overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-brand uppercase">
              Electrical Engineering · Northwestern University
            </p>
            <h1 className="mt-6 max-w-5xl font-heading text-[clamp(4.4rem,11vw,9rem)] leading-[0.78] tracking-[-0.055em] text-balance">
              Emmett
              <br />
              Funston
            </h1>
          </div>
          <div className="border-t border-foreground/15 pt-6">
            <p className="text-xl leading-snug font-medium text-foreground sm:text-2xl">
              Digital Hardware
              <br />
              FPGA · ASIC/VLSI
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              I design hardware across the stack—from transistor-level circuits
              and RTL to PCBs, firmware, and complete embedded systems.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-foreground/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <CtaButton href="/projects" size="lg">
              View selected work
            </CtaButton>
            <CtaButton href="/resume" size="lg" variant="secondary">
              Resume
            </CtaButton>
          </div>
          <div className="flex items-center gap-5">
            <SocialLink href={siteConfig.github} label="GitHub" Icon={GithubBrandIcon} />
            <SocialLink href={siteConfig.linkedin} label="LinkedIn" Icon={LinkedinBrandIcon} />
          </div>
        </div>
      </Section>

      <Section spacing="md" container="xl" tone="contrast">
        <p className="font-mono text-[10px] tracking-[0.18em] text-background/45 uppercase">
          Hardware stack
        </p>
        <div className="mt-6 grid divide-y divide-background/15 border-y border-background/15 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {stackLayers.map((layer, index) => (
            <div key={layer.label} className="group relative px-4 py-6 first:pl-0 sm:py-8">
              <span className="font-mono text-[10px] text-background/35">{layer.index}</span>
              <h2 className="mt-5 text-lg font-semibold text-background">{layer.label}</h2>
              <p className="mt-1 text-xs text-background/50">{layer.detail}</p>
              {index < stackLayers.length - 1 ? (
                <ArrowRightIcon
                  className="absolute top-1/2 right-0 hidden size-4 -translate-y-1/2 translate-x-1/2 text-background/30 sm:block"
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="xl" container="xl">
        <SectionHeader
          eyebrow="Selected work"
          title="Hardware, carried through."
          description="Projects are ordered by relevance to digital design, semiconductor engineering, and system-level hardware. In-progress work is labeled explicitly."
          action={
            <CtaButton href="/projects" variant="ghost">
              View all projects
            </CtaButton>
          }
        />

        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={cn(
                "group relative flex min-h-[22rem] flex-col bg-card p-7 transition-colors hover:bg-accent/65 sm:p-9",
                index === 0 && "lg:col-span-2 lg:min-h-[26rem]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
                  {project.category}
                </p>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-wider uppercase",
                    getProjectStatusClass(project.status)
                  )}
                >
                  {project.status}
                </span>
              </div>
              <div className="technical-grid my-8 flex flex-1 items-center justify-center rounded-lg border border-foreground/10 bg-muted/35 p-6">
                <div className="flex w-full max-w-2xl items-center">
                  {project.diagram.map((node, nodeIndex) => (
                    <div key={node} className="contents">
                      <span className="flex min-h-16 flex-1 items-center justify-center rounded border border-foreground/15 bg-background/90 px-2 text-center font-mono text-[9px] tracking-wide text-foreground/70 uppercase">
                        {node}
                      </span>
                      {nodeIndex < project.diagram.length - 1 ? (
                        <span className="h-px min-w-3 flex-1 bg-brand/40" aria-hidden />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between gap-5">
                <div>
                  <h3
                    className={cn(
                      "font-heading leading-none tracking-[-0.025em] text-foreground",
                      index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"
                    )}
                  >
                    {project.shortTitle}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                </div>
                <ArrowUpRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="experience" spacing="xl" container="xl" tone="band">
        <SectionHeader
          eyebrow="Experience"
          title="Engineering in the field."
          description="Semiconductor coursework and project depth paired with industrial instrumentation, power-system applications, and vehicle electronics."
        />
        <div className="border-t border-foreground/12">
          {experience.map((item) => (
            <article
              key={item.company}
              className="grid gap-4 border-b border-foreground/12 py-7 md:grid-cols-[8rem_1fr_1.3fr] md:gap-8"
            >
              <p className="font-mono text-[10px] tracking-wider text-brand uppercase">
                {item.period}
              </p>
              <div>
                <h3 className="text-base font-semibold text-foreground">{item.company}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-foreground/75">{item.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <li key={skill} className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="about" spacing="xl" container="xl">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="technical-grid flex min-h-[28rem] flex-col justify-between rounded-xl border border-foreground/12 bg-foreground p-7 text-background">
            <GraduationCapIcon className="size-8 text-background/65" aria-hidden />
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-background/45 uppercase">
                Education
              </p>
              <p className="mt-3 font-heading text-4xl leading-none">
                Northwestern University
              </p>
              <p className="mt-4 text-sm text-background/65">
                B.S. Electrical Engineering · Expected June 2028
                <br />
                Planned continuation into the combined B.S./M.S. program
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-brand uppercase">
                About
              </p>
              <h2 className="mt-5 max-w-3xl font-heading text-5xl leading-[0.98] tracking-[-0.03em] text-balance sm:text-6xl">
                From architecture and circuits to working hardware.
              </h2>
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m an Electrical Engineering student at Northwestern focused on
                  digital hardware and semiconductor design. My work spans SRAM,
                  Verilog accelerators, ASIC physical design, FPGA systems, embedded
                  electronics, and PCBs.
                </p>
                <p>
                  I&apos;m most interested in roles where performance, power,
                  reliability, and hardware/software interaction are measurable
                  engineering constraints—especially in semiconductor computing,
                  defense, aerospace, and high-performance systems.
                </p>
                <p>
                  Long term, I hope to combine deep semiconductor expertise with
                  entrepreneurship to build advanced hardware technologies.
                </p>
              </div>
            </div>
            <p className="mt-10 border-t border-foreground/12 pt-5 text-sm text-muted-foreground">
              Previously attended UC Santa Barbara before transferring to Northwestern.
            </p>
          </div>
        </div>
      </Section>

      <Section id="stack" spacing="xl" container="xl" tone="band">
        <SectionHeader
          eyebrow="Technical stack"
          title="Tools organized by the work."
          description="The focus is digital hardware and semiconductor implementation—not a wall of unrelated logos."
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <article key={group.title} className="bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-brand">0{index + 1}</span>
                <h3 className="text-base font-semibold">{group.title}</h3>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded border border-foreground/10 bg-muted/55 px-2.5 py-1.5 text-xs text-foreground/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section spacing="xl" container="xl">
        <SectionHeader
          eyebrow="Media"
          title="Technical ideas, explained clearly."
          description="YouTube videos on engineering, math, science, learning, and student life—kept secondary to the engineering work."
          action={
            <CtaButton href={siteConfig.youtube} external variant="secondary">
              Visit YouTube
            </CtaButton>
          }
        />
        <a
          href={siteConfig.youtube}
          target="_blank"
          rel="noreferrer"
          className="group grid overflow-hidden rounded-xl border border-foreground/12 bg-card md:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="technical-grid flex min-h-72 items-center justify-center bg-foreground text-background">
            <span className="grid size-16 place-items-center rounded-full border border-background/25 transition-transform group-hover:scale-105">
              <PlayIcon className="ml-1 size-5 fill-current" aria-hidden />
            </span>
          </div>
          <div className="flex flex-col justify-between p-7 sm:p-9">
            <div>
              <p className="font-mono text-[10px] tracking-wider text-brand uppercase">
                Featured video
              </p>
              <h3 className="mt-4 font-heading text-4xl leading-none tracking-tight">
                Did AI Just Solve this $1 MILLION Math Problem?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The Navier–Stokes existence and smoothness problem, AI-assisted
                mathematical research, fluid dynamics, and what a claimed solution
                would actually mean.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
              Watch on YouTube
              <ArrowUpRightIcon className="size-4" />
            </span>
          </div>
        </a>
      </Section>

      <Section spacing="xl" container="xl" tone="contrast">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-background/45 uppercase">
              Outside engineering
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-none tracking-tight text-background">
              Rhythm, framing, and a life beyond the bench.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PersonalCard
              href="/drums"
              Icon={Music2Icon}
              title="Drumming"
              body="10+ years behind the kit, plus marching, Drum Major, and section leadership experience."
            />
            <PersonalCard
              href="/content"
              Icon={YoutubeBrandIcon}
              title="Media"
              body="Engineering, math, science, education, technology, and the process of learning in public."
            />
          </div>
        </div>
      </Section>

      <Section spacing="xl" container="xl">
        <div className="grid gap-8 rounded-xl border border-foreground/12 bg-card p-7 md:grid-cols-[1fr_auto] md:items-end sm:p-10">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
              Contact
            </p>
            <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-none tracking-tight">
              Building digital hardware that has to work.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              I&apos;m interested in internship and early-career opportunities across
              FPGA, ASIC/VLSI, digital design, embedded hardware, defense, aerospace,
              and high-performance computing systems.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <CtaButton href={`mailto:${siteConfig.email}`} size="lg" showArrow={false}>
              <MailIcon className="size-4" />
              Email me
            </CtaButton>
            <CtaButton href="/resume" size="lg" variant="secondary">
              View resume
            </CtaButton>
          </div>
        </div>

        <div className="mt-6 grid gap-5 border-t border-foreground/12 pt-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <BriefcaseBusinessIcon className="size-4 text-brand" />
              SAT &amp; Admissions Coaching
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              I also run a focused coaching program for ambitious students. It has
              its own section and remains separate from the engineering portfolio.
            </p>
          </div>
          <CtaButton href="/sat-admissions" variant="ghost">
            Visit coaching
          </CtaButton>
        </div>
      </Section>
    </>
  );
}

function SocialLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
    >
      <Icon className="size-4" />
      {label}
      <ArrowUpRightIcon className="size-3" />
    </a>
  );
}

function PersonalCard({
  href,
  Icon,
  title,
  body,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-background/15 p-5 transition-colors hover:bg-background/8"
    >
      <Icon className="size-5 text-background/55" aria-hidden />
      <h3 className="mt-8 text-base font-semibold text-background">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-background/55">{body}</p>
      <ArrowUpRightIcon className="mt-6 size-4 text-background/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
