import Link from "next/link";
import type { Metadata } from "next";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SupabasePublicEnvMissingError } from "@/lib/supabase/config";
import { SAT_RESOURCES } from "@/lib/planner/resources";
import type { Tables } from "@/lib/supabase/database.types";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/auth/submit-button";
import { startSatPlannerCheckout } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "SAT Study Planner",
  description:
    "A personalized day-by-day SAT study plan: chapter assignments, weekly practice tests, score tracking, and a mistake journal — from today through test day.",
};

const FEATURES = [
  "A daily chapter-by-chapter schedule built around your availability",
  "A full practice test every Saturday with score tracking",
  "Book recommendations tuned to your scores and target",
  "A catch-up list that keeps missed work visible — never silently rescheduled",
  "A mistake journal that turns errors into points",
];

async function loadProduct(): Promise<{
  product: Tables<"products"> | null;
  signedIn: boolean;
  hasAccess: boolean;
}> {
  try {
    const supabase = await getSupabaseServerClient();
    const [{ data: product, error }, { data: userData }] = await Promise.all([
      supabase.from("products").select("*").eq("slug", "sat-planner").single(),
      supabase.auth.getUser(),
    ]);
    if (error) {
      console.error(
        `[sat-planner] failed to load product: ${error.code ?? ""} ${error.message}` +
          `${error.hint ? ` (hint: ${error.hint})` : ""}`
      );
    }
    const user = userData.user;
    let hasAccess = false;
    if (user) {
      const { data, error: accessError } = await supabase.rpc(
        "has_sat_planner_access",
        { p_user_id: user.id }
      );
      if (accessError) {
        console.error("[sat-planner] access check failed:", accessError.message);
      }
      hasAccess = data === true;
    }
    return {
      product: product ?? null,
      signedIn: user !== null,
      hasAccess,
    };
  } catch (err) {
    if (err instanceof SupabasePublicEnvMissingError) {
      console.warn(`[sat-planner] ${err.message}`);
      return { product: null, signedIn: false, hasAccess: false };
    }
    throw err;
  }
}

function formatPrice(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100);
}

function normalizeMarketingCopy(value: string): string {
  return value.replaceAll("‚Äî", "—").replaceAll("â€”", "—");
}

export default async function SatPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const [{ product, signedIn, hasAccess }, params] = await Promise.all([
    loadProduct(),
    searchParams,
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          One-time purchase · Not a course
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {product?.name ?? "SAT Study Planner"}
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          {normalizeMarketingCopy(
            product?.description ??
              "A personalized day-by-day SAT study plan: chapter assignments from proven prep books, weekly practice tests, score tracking, and a mistake journal."
          )}
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-md [--card-spacing:--spacing(6)]">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-semibold">
            {product ? formatPrice(product.amount_cents, product.currency) : "$30"}
          </CardTitle>
          <CardDescription>
            One-time payment. Yours through test day.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {params.checkout === "cancelled" ? (
            <p role="status" className="rounded-lg bg-muted px-3 py-2 text-sm">
              Checkout was cancelled. You have not been charged.
            </p>
          ) : null}
          {params.checkout === "failed" ||
          params.checkout === "unavailable" ? (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              Checkout is not available right now. Please try again shortly.
            </p>
          ) : null}
          <ul className="flex flex-col gap-2.5">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <CheckIcon
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-foreground"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            {hasAccess ? (
              <Link
                href="/planner"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 w-full text-base sm:text-sm",
                })}
              >
                Open my planner
              </Link>
            ) : signedIn ? (
              <form action={startSatPlannerCheckout}>
                <SubmitButton>Buy once — start planning</SubmitButton>
              </form>
            ) : (
              <Link
                href="/signup?next=/sat-planner"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 w-full text-base sm:text-sm",
                })}
              >
                Create account to purchase
              </Link>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Stripe-hosted secure checkout. No subscription.
            </p>
          </div>
          {!signedIn ? (
            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/signup"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create an account
              </Link>{" "}
              or{" "}
              <Link
                href="/signin"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                sign in
              </Link>{" "}
              to get started.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <section className="mt-16" aria-labelledby="planner-resources">
        <div className="text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Recommended resources
          </p>
          <h2
            id="planner-resources"
            className="mt-2 font-heading text-2xl font-semibold tracking-tight"
          >
            The books used by this plan
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            These are the resources I used and recommend. Your planner assigns
            chapters from the books you select and reserves Saturdays for full
            practice exams.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SAT_RESOURCES.map((resource) => (
            <a
              key={resource.slug}
              href={resource.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="group rounded-xl border border-foreground/10 p-5 transition-colors hover:border-foreground/25"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-heading font-medium">
                  {resource.label}
                </span>
                <ExternalLinkIcon
                  aria-hidden
                  className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {resource.description}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      </section>
    </div>
  );
}
