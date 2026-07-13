import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = {
  title: "You're registered — Free Workshop",
  description:
    "Thanks for registering for the free SAT & Admissions workshop. Check your email for the details.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sat-admissions/thanks-workshop" },
};

export default function ThanksWorkshopPage() {
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
            You&apos;re on the list.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Thanks for registering for the free workshop. Check your inbox in the next few minutes for the workshop details. If you don&apos;t see it, check your spam folder.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/sat-admissions/apply" variant="primary" size="lg">
            Apply to coach with Emmett
          </CtaButton>
          <CtaButton
            href="/sat-admissions/packages"
            variant="secondary"
            size="lg"
          >
            See packages
          </CtaButton>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Want to head back?{" "}
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
