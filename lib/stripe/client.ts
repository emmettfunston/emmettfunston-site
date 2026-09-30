import "server-only";

import Stripe from "stripe";

export class StripeNotConfiguredError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Stripe is not configured. Missing: ${missing.join(", ")}`);
    this.name = "StripeNotConfiguredError";
  }
}

let cached: Stripe | null = null;

/**
 * Server-only Stripe client. A restricted key (rk_) with the minimum required
 * Checkout permissions is preferred over a full secret key.
 */
export function getStripeClient(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new StripeNotConfiguredError(["STRIPE_SECRET_KEY"]);

  cached = new Stripe(key, {
    appInfo: {
      name: "Emmett Funston SAT Planner",
      version: "1.0.0",
    },
  });
  return cached;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new StripeNotConfiguredError(["STRIPE_WEBHOOK_SECRET"]);
  }
  return secret;
}

export function getSatPlannerPriceId(fallback?: string | null): string {
  const priceId =
    process.env.STRIPE_SAT_PLANNER_PRICE_ID?.trim() || fallback?.trim();
  if (!priceId) {
    throw new StripeNotConfiguredError(["STRIPE_SAT_PLANNER_PRICE_ID"]);
  }
  return priceId;
}
