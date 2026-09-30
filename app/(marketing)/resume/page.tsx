import type { Metadata } from "next";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  DownloadIcon,
  GraduationCapIcon,
  MailIcon,
  WrenchIcon,
} from "lucide-react";

import { CtaButton } from "@/components/site/cta-button";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { SectionHeader } from "@/components/site/section-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Emmett Funston, an Electrical Engineering student at Northwestern focused on digital hardware and semiconductor design.",
  alternates: { canonical: "/resume" },
};

const skillGroups = [
  {
    label: "Digital & semiconductor",
    items: ["Verilog", "Cadence Virtuoso", "Spectre", "Innovus", "Genus", "Xcelium", "SRAM", "Physical design"],
  },
  {
    label: "Embedded & PCB",
    items: ["STM32", "RP2350", "C / C++", "Altium", "KiCad", "CAN", "I2C", "SPI", "UART", "Ethernet"],
  },
  {
    label: "Software & engineering",
    items: ["Python", "Assembly", "Unix / Linux", "Git", "MATLAB / Simulink", "LTspice", "Autodesk Fusion"],
  },
  {
    label: "Lab & fabrication",
    items: ["Oscilloscope", "Logic analyzer", "DMM", "Bench supply", "Soldering", "Hot-air rework", "Crimping"],
  },
];

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="Electrical engineering across silicon, RTL, and embedded systems."
        description="A concise professional overview. The project case studies contain the technical depth; the PDF is the application-ready version."
        actions={
          <>
            <CtaButton href="/Emmett-Funston-Resume.pdf" external size="lg">
              View resume PDF
            </CtaButton>
            <a
              href="/Emmett-Funston-Resume.pdf"
              download="Emmett-Funston-Resume.pdf"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-background px-6 text-[15px] font-medium tracking-tight text-foreground transition-colors hover:border-brand/45 hover:text-brand"
            >
              <DownloadIcon className="size-4" />
              Download PDF
            </a>
          </>
        }
      />

      <Section spacing="lg" container="xl">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="flex flex-col gap-8 border-t border-foreground/12 pt-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
                Contact
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>Irvine, CA</li>
                <li>
                  <a className="hover:text-brand" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-1 hover:text-brand"
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn <ArrowUpRightIcon className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-1 hover:text-brand"
                    href={siteConfig.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ArrowUpRightIcon className="size-3" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
                Focus
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                FPGA · ASIC/VLSI · RTL · Embedded hardware · PCB design ·
                Semiconductor computing
              </p>
            </div>
          </aside>

          <div className="space-y-14">
            <ResumeBlock Icon={GraduationCapIcon} title="Education">
              <ResumeEntry
                title="Northwestern University"
                subtitle="B.S. Electrical Engineering"
                meta="Expected June 2028"
                body="Relevant coursework includes VLSI Design, Digital Design, Mechatronics, Signals and Systems, Solid State, Circuits & Systems, Computer Systems, C/C++, and Data Structures & Algorithms. Planning to continue into Northwestern's combined B.S./M.S. Electrical Engineering program."
              />
              <ResumeEntry
                title="UC Santa Barbara"
                subtitle="Previous undergraduate study"
                meta="Transferred to Northwestern"
                body="Coursework across physics, electrical engineering, mathematics, circuits, electromagnetism, waves and optics, and modern physics."
              />
            </ResumeBlock>

            <ResumeBlock Icon={BriefcaseIcon} title="Experience">
              <ResumeEntry
                title="Schneider Electric / ASCO Power Technologies"
                subtitle="Engineering Intern"
                meta="June 2026 – September 2026"
                body="Analyzed electrical one-line diagrams, specifications, and application requirements for automatic transfer switches and power-control systems. Evaluated ratings, controllers, protection, transition modes, and accessories for customer power-distribution applications."
              />
              <ResumeEntry
                title="Bambeck Systems Inc."
                subtitle="Electrical Engineering Intern"
                meta="June 2024 – September 2024"
                body="Troubleshot and calibrated industrial quantum-cascade-laser gas analyzers in the field, combining electrical wiring, optical alignment, instrumentation, C++ control software, and Python data logging."
              />
            </ResumeBlock>
          </div>
        </div>
      </Section>

      <Section spacing="lg" container="xl" tone="band">
        <SectionHeader
          eyebrow="Technical skills"
          title="Organized by engineering domain."
          description="The detailed project pages show where and how these tools were applied."
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 md:grid-cols-2">
          {skillGroups.map((group) => (
            <article key={group.label} className="bg-card p-6">
              <div className="flex items-center gap-2">
                <WrenchIcon className="size-4 text-brand" />
                <h2 className="text-sm font-semibold">{group.label}</h2>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
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

      <Section spacing="lg" container="xl">
        <div className="flex flex-col gap-6 border-t border-foreground/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-brand uppercase">
              More detail
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-none">
              See the engineering behind the bullet points.
            </h2>
          </div>
          <div className="flex gap-3">
            <CtaButton href="/projects" variant="secondary">
              Project case studies
            </CtaButton>
            <CtaButton href={`mailto:${siteConfig.email}`} showArrow={false}>
              <MailIcon className="size-4" />
              Contact
            </CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function ResumeBlock({
  Icon,
  title,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-foreground/12 pb-4">
        <Icon className="size-4 text-brand" />
        <h2 className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-foreground/12">{children}</div>
    </section>
  );
}

function ResumeEntry({
  title,
  subtitle,
  meta,
  body,
}: {
  title: string;
  subtitle: string;
  meta: string;
  body: string;
}) {
  return (
    <article className="grid gap-4 py-6 sm:grid-cols-[1fr_auto]">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-foreground/70">{subtitle}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      <p className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
        {meta}
      </p>
    </article>
  );
}
