import "server-only";

import { randomBytes } from "node:crypto";

import { getStripeClient, getSatPlannerPriceId } from "@/lib/stripe/client";

type CreatePlannerCheckoutInput = {
  userId: string;
  customerEmail: string;
  productId: string;
  databasePriceId?: string | null;
  siteUrl: string;
};

function integrationIdentifier(): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const bytes = randomBytes(8);
  let suffix = "";
  for (const byte of bytes) suffix += letters[byte % letters.length];
  return `sat_planner_${suffix}`;
}

/**
 * Create a Stripe-hosted, one-time Checkout Session. Access is not granted
 * here or on the success page; only the verified webhook can fulfill it.
 */
export async function createPlannerCheckoutSession(
  input: CreatePlannerCheckoutInput
) {
  const stripe = getStripeClient();
  const priceId = getSatPlannerPriceId(input.databasePriceId);

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: input.customerEmail,
    client_reference_id: input.userId,
    metadata: {
      user_id: input.userId,
      product_id: input.productId,
      product_slug: "sat-planner",
    },
    success_url: `${input.siteUrl}/sat-planner/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.siteUrl}/sat-planner?checkout=cancelled`,
    integration_identifier: integrationIdentifier(),
  });
}
