import type { Metadata } from "next";

import { CtaButton } from "@/components/site/cta-button";
import { PageHeader } from "@/components/site/page-header";
import { ProjectGrid } from "@/components/site/project-grid";
import { Section } from "@/components/site/section";
import { projects } from "@/lib/portfolio/projects";

export const metadata: Metadata = {
  title: "Engineering Projects",
  description:
    "ASIC/VLSI, FPGA, embedded electronics, PCB, and industrial engineering projects by Emmett Funston.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering portfolio"
        title="Selected projects and technical work."
        description="Digital hardware is the center of this portfolio. Each case study separates completed results from active development and documents the architecture, implementation, and engineering decisions."
        actions={
          <>
            <CtaButton href="/Emmett-Funston-Resume.pdf" external size="lg">
              View resume PDF
            </CtaButton>
            <CtaButton href="/#experience" variant="secondary" size="lg">
              Experience
            </CtaButton>
          </>
        }
      />

      <Section spacing="lg" container="xl">
        <ProjectGrid projects={projects} />
      </Section>
    </>
  );
}
