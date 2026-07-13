import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import { getPathwayBookingUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Application received",
  description:
    "Thanks for applying to coach with Emmett Funston. We'll review your application and reach out with next steps.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sat-admissions/thanks-apply" },
};

export default function ThanksApplyPage() {
  const pathwayBookingUrl = getPathwayBookingUrl();

  return (
    <Section spacing="xl" container="md">
      <div className="flex flex-col items-center gap-6 text-center">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-full bg-foreground text-background"
        >
          <CheckCircle2Icon className="size-6" />
        </span>
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Application received.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Thanks for applying to coach with Emmett. Every application is read personally. Expect a response within a few days with next steps or a package recommendation.
          </p>
        </div>

        <div className="mt-4 grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 bg-background p-6 text-left">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              While you wait
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Watch the free workshop to see the framework in one sitting.
            </p>
            <CtaButton
              href="/sat-admissions/workshop"
              variant="primary"
              size="md"
              className="mt-4 w-fit"
            >
              Watch workshop
            </CtaButton>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-background p-6 text-left">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              Need something sooner?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Book a private 1-on-1 mentor call through our external booking link.
            </p>
            <CtaButton
              href={pathwayBookingUrl}
              variant="secondary"
              size="md"
              external
              className="mt-4 w-fit"
            >
              Book 1-on-1
            </CtaButton>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Return home
          </Link>
        </p>
      </div>
    </Section>
  );
}
