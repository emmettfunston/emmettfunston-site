import Link from "next/link";
import type { Metadata } from "next";
import { CheckIcon } from "lucide-react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SupabasePublicEnvMissingError } from "@/lib/supabase/config";
import type { Tables } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
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
    return { product: product ?? null, signedIn: userData.user !== null };
  } catch (err) {
    if (err instanceof SupabasePublicEnvMissingError) {
      console.warn(`[sat-planner] ${err.message}`);
      return { product: null, signedIn: false };
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

export default async function SatPlannerPage() {
  const { product, signedIn } = await loadProduct();

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
          {product?.description ??
            "A personalized day-by-day SAT study plan: chapter assignments from proven prep books, weekly practice tests, score tracking, and a mistake journal."}
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
            <Button size="lg" disabled className="h-11 w-full text-base sm:text-sm">
              Checkout opening soon
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Secure payment is being finalized. {signedIn ? "You're signed in — " : ""}
              check back shortly.
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
    </div>
  );
}
