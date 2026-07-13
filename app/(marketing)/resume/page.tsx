import type { Metadata } from "next";
import {
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  DownloadIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  RocketIcon,
  WrenchIcon,
} from "lucide-react";
import {
  LinkedinBrandIcon,
  GithubBrandIcon,
} from "@/components/site/brand-icons";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Emmett Funston, Electrical Engineering student at Northwestern University.",
  alternates: { canonical: "/resume" },
};

// TODO(emmett): Fill in every "TODO:" string below with real dates, roles,
// bullets, GPA, and contact info. Leaving them in place until then so
// nothing accidentally goes live with fake numbers.

type Entry = {
  org: string;
  role: string;
  location?: string;
  dates: string;
  bullets: string[];
};

const education: Entry[] = [
  {
    org: "Northwestern University",
    role: "B.S. Electrical Engineering, McCormick School of Engineering",
    location: "Evanston, IL",
    dates: "TODO: start year – expected grad year",
    bullets: [
      "TODO: GPA (e.g. 3.8 / 4.0)",
      "TODO: Relevant coursework — Digital Systems, VLSI, Signals & Systems, Embedded Systems, Analog Circuits, Computer Architecture",
      "TODO: Honors / awards (Dean's List, scholarships)",
    ],
  },
  {
    org: "TODO: High school (optional — remove if not needed on resume)",
    role: "TODO: Diploma / notable coursework",
    location: "TODO: City, State",
    dates: "TODO: years",
    bullets: [
      "TODO: SAT 1510 (self-designed prep system)",
      "TODO: Relevant clubs, honors, or leadership roles",
    ],
  },
];

const experience: Entry[] = [
  {
    org: "Schneider Electric",
    role: "TODO: Engineering Intern",
    location: "TODO: City, State",
    dates: "TODO: Month YYYY – Month YYYY",
    bullets: [
      "TODO: Concrete impact bullet — quantify with numbers where possible.",
      "TODO: Technical contribution — tools, systems, scale.",
      "TODO: Cross-team or shipped-to-production outcome.",
    ],
  },
  {
    org: "Bambeck Systems",
    role: "TODO: Engineering Intern",
    location: "TODO: City, State",
    dates: "TODO: Month YYYY – Month YYYY",
    bullets: [
      "TODO: Concrete impact bullet — quantify with numbers where possible.",
      "TODO: Technical contribution — hardware/software work owned.",
      "TODO: Result the team saw as a consequence of your work.",
    ],
  },
  {
    org: "Emmett Funston SAT & Admissions",
    role: "Founder & Coach",
    location: "Remote",
    dates: "TODO: Month YYYY – Present",
    bullets: [
      "Designed a selective SAT and college-application coaching program helping ambitious high schoolers raise scores and strengthen applications.",
      "Coached students to score outcomes of 1510, 1510, and 1540 (results are not guaranteed).",
      "Built the end-to-end funnel — workshop, application, cohort ops, mentor calls — on a self-hosted stack.",
    ],
  },
  {
    org: "Pathway Tutors",
    role: "TODO: Role (Founder / Operator / Contributor)",
    location: "Remote",
    dates: "TODO: Month YYYY – Month YYYY",
    bullets: [
      "TODO: Marketplace, ops, growth, or product bullet.",
      "TODO: Concrete metric — signups, revenue, or matches.",
      "TODO: What you learned or built that transferred to later work.",
    ],
  },
];

const featuredProjects: {
  title: string;
  summary: string;
  href?: string;
}[] = [
  {
    title: "Smart PDU",
    summary:
      "Network-managed power distribution unit — embedded firmware + browser dashboard.",
    href: "/projects",
  },
  {
    title: "VLSI / Innovus",
    summary:
      "Full RTL-to-GDSII flow on standard-cell CMOS blocks using Cadence Innovus.",
    href: "/projects",
  },
  {
    title: "Formula SAE — Electrical",
    summary:
      "Wiring harness design, sensor integration, and telemetry for Northwestern's FSAE car.",
    href: "/projects",
  },
  {
    title: "FPGA Projects",
    summary:
      "SystemVerilog datapaths and accelerators with self-checking testbenches.",
    href: "/projects",
  },
];

const skillGroups: { label: string; items: string[] }[] = [
  {
    label: "Hardware",
    items: [
      "PCB Design",
      "Embedded Systems",
      "Firmware",
      "Sensor Integration",
      "Wiring Harnesses",
      "Power Systems",
    ],
  },
  {
    label: "Digital & Chip Design",
    items: [
      "SystemVerilog / Verilog",
      "RTL Design",
      "FPGA Development",
      "Cadence Innovus",
      "Standard-Cell Physical Design",
      "Simulation & Verification",
    ],
  },
  {
    label: "Software",
    items: [
      "Python",
      "C / C++",
      "TypeScript",
      "Next.js / React",
      "SQL",
      "Git",
    ],
  },
  {
    label: "Tools",
    items: [
      "Vivado",
      "Cadence Innovus",
      "MATLAB",
      "LTspice",
      "KiCad",
      "TCL",
    ],
  },
];

const contact = {
  // TODO: Replace with real contact details.
  email: "TODO: hello@emmettfunston.com",
  location: "TODO: Evanston, IL",
  linkedin: "TODO: https://linkedin.com/in/…",
  github: "TODO: https://github.com/…",
  site: "https://emmettfunston.com",
};

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="Emmett Funston"
        description="Electrical Engineering @ Northwestern · Founder of a selective SAT & Admissions coaching program."
        actions={
          <>
            <CtaButton href="#" variant="primary" size="lg" showArrow={false}>
              <span className="inline-flex items-center gap-2">
                <DownloadIcon className="size-4" />
                Download PDF (coming soon)
              </span>
            </CtaButton>
            <CtaButton href="/projects" variant="secondary" size="lg">
              See projects
            </CtaButton>
          </>
        }
      />

      <Section spacing="lg" container="lg">
        {/* Contact strip */}
        <div className="mb-12 flex flex-wrap items-center gap-2 rounded-2xl border border-foreground/10 bg-background p-4">
          <ContactChip Icon={MailIcon} value={contact.email} />
          <ContactChip Icon={MapPinIcon} value={contact.location} />
          <ContactChip Icon={LinkedinBrandIcon} value={contact.linkedin} />
          <ContactChip Icon={GithubBrandIcon} value={contact.github} />
          <ContactChip Icon={GlobeIcon} value={contact.site} />
        </div>

        <div className="flex flex-col gap-14">
          <ResumeSection Icon={GraduationCapIcon} title="Education">
            {education.map((e) => (
              <ResumeEntry key={`${e.org}-${e.role}`} entry={e} />
            ))}
          </ResumeSection>

          <ResumeSection Icon={BriefcaseIcon} title="Experience">
            {experience.map((e) => (
              <ResumeEntry key={`${e.org}-${e.role}`} entry={e} />
            ))}
          </ResumeSection>

          <ResumeSection Icon={RocketIcon} title="Selected Projects">
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredProjects.map((p) => (
                <a
                  key={p.title}
                  href={p.href ?? "#"}
                  className="group flex flex-col gap-1.5 rounded-xl border border-foreground/10 bg-background p-4 transition-colors hover:border-foreground/25"
                >
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {p.title}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {p.summary}
                  </span>
                  <span className="mt-1 text-[11px] font-medium text-foreground/70 group-hover:text-foreground">
                    View →
                  </span>
                </a>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection Icon={WrenchIcon} title="Skills">
            <div className="grid gap-4 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-xl border border-foreground/10 bg-background p-4"
                >
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                    {group.label}
                  </span>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-foreground/10 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          A downloadable PDF version is coming soon. In the meantime, reach out
          through the contact links above.
        </p>
      </Section>
    </>
  );
}

function ResumeSection({
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
      <div className="mb-5 flex items-center gap-2.5 border-b border-foreground/10 pb-3">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function ResumeEntry({ entry }: { entry: Entry }) {
  const isTodo = (v: string) => v.startsWith("TODO:");
  return (
    <article className="rounded-xl border border-foreground/10 bg-background p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            {entry.org}
          </h3>
          <p
            className={cn(
              "text-sm",
              isTodo(entry.role) ? "text-amber-700" : "text-foreground/85"
            )}
          >
            {entry.role}
          </p>
        </div>
        <div className="text-xs whitespace-nowrap text-muted-foreground sm:text-right">
          <div className={cn(isTodo(entry.dates) && "text-amber-700")}>
            {entry.dates}
          </div>
          {entry.location ? (
            <div className={cn("mt-0.5", isTodo(entry.location) && "text-amber-700")}>
              {entry.location}
            </div>
          ) : null}
        </div>
      </div>
      {entry.bullets.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className={cn(
                "flex gap-2 text-sm leading-relaxed",
                isTodo(b) ? "text-amber-700" : "text-foreground/90"
              )}
            >
              <span className="mt-2 size-1 shrink-0 rounded-full bg-current opacity-60" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ContactChip({
  Icon,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  const isTodo = value.startsWith("TODO:");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
        isTodo
          ? "border-amber-300/60 bg-amber-50 text-amber-800"
          : "border-foreground/10 bg-muted/50 text-foreground/85"
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="truncate">{value}</span>
    </span>
  );
}
