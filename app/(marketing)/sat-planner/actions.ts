"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { hasPlannerAccess, requireUser } from "@/lib/auth/session";
import { createPlannerCheckoutSession } from "@/lib/stripe/checkout";
import { StripeNotConfiguredError } from "@/lib/stripe/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function requestOrigin(): Promise<string> {
  const store = await headers();
  const origin = store.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = store.get("x-forwarded-host") ?? store.get("host");
  const protocol = store.get("x-forwarded-proto") ?? "https";
  if (host) return `${protocol}://${host}`;
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/**
 * Authenticated Checkout entry point. The browser receives only Stripe's
 * hosted URL; no secret or entitlement state crosses the client boundary.
 */
export async function startSatPlannerCheckout(): Promise<void> {
  const user = await requireUser("/sat-planner");

  if (await hasPlannerAccess(user.id)) {
    redirect("/planner");
  }

  const supabase = await getSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("id, stripe_price_id")
    .eq("slug", "sat-planner")
    .eq("active", true)
    .single();

  if (error || !product) {
    console.error("[checkout] SAT planner product unavailable:", error);
    redirect("/sat-planner?checkout=unavailable");
  }

  let checkoutUrl: string;
  try {
    const session = await createPlannerCheckoutSession({
      userId: user.id,
      customerEmail: user.email ?? "",
      productId: product.id,
      databasePriceId: product.stripe_price_id,
      siteUrl: await requestOrigin(),
    });

    if (!session.url) {
      console.error("[checkout] Stripe session has no hosted URL:", session.id);
      throw new Error("Stripe returned a Checkout Session without a URL.");
    }
    checkoutUrl = session.url;
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      console.error(`[checkout] ${error.message}`);
    } else {
      console.error("[checkout] session creation failed:", error);
    }
    redirect("/sat-planner?checkout=failed");
  }

  redirect(checkoutUrl);
}
