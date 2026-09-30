import type Stripe from "stripe";

import { sendSatPlannerPurchaseEmail } from "@/lib/email/send";
import {
  getStripeClient,
  getStripeWebhookSecret,
  StripeNotConfiguredError,
} from "@/lib/stripe/client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function stripeObjectId(
  value: string | { id: string } | null
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function updateEvent(
  eventId: string,
  values: Record<string, unknown>
) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("webhook_events")
    .update(values)
    .eq("provider_event_id", eventId);
  if (error) {
    console.error("[stripe-webhook] failed to update event ledger:", error);
  }
}

async function fulfillCheckout(
  event: Stripe.Event,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const productId = session.metadata?.product_id;
  if (!userId || !productId) {
    throw new Error("Checkout Session is missing user_id or product_id metadata.");
  }
  if (session.payment_status !== "paid") {
    await updateEvent(event.id, {
      processing_status: "skipped",
      processed_at: new Date().toISOString(),
      payload_reference: session.id,
      error_message: `Payment status is ${session.payment_status}`,
    });
    return;
  }

  const admin = getSupabaseAdminClient();
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? null;
  const purchase = {
    user_id: userId,
    product_id: productId,
    stripe_checkout_session_id: session.id,
    stripe_customer_id: stripeObjectId(session.customer),
    stripe_payment_intent_id: stripeObjectId(session.payment_intent),
    customer_email: customerEmail,
    amount_total: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    payment_status: "paid",
    access_granted: true,
    purchased_at: new Date(event.created * 1000).toISOString(),
  };

  // A manually granted entitlement may already exist during development. In
  // that case enrich it with Stripe data; otherwise insert by unique Session.
  const { data: existing } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("access_granted", true)
    .maybeSingle();

  const result = existing
    ? await admin.from("purchases").update(purchase).eq("id", existing.id)
    : await admin
        .from("purchases")
        .upsert(purchase, { onConflict: "stripe_checkout_session_id" });

  if (result.error) {
    throw new Error(`Purchase fulfillment failed: ${result.error.message}`);
  }

  // Email is best-effort and idempotent; it never causes fulfillment failure.
  if (customerEmail) {
    await sendSatPlannerPurchaseEmail({
      eventId: event.id,
      email: customerEmail,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
    });
  }

  await updateEvent(event.id, {
    processing_status: "processed",
    processed_at: new Date().toISOString(),
    payload_reference: session.id,
    error_message: null,
  });
}

export async function POST(request: Request): Promise<Response> {
  let event: Stripe.Event;
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    // Signature verification requires the unparsed raw body.
    const rawBody = await request.text();
    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret()
    );
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      console.error(`[stripe-webhook] ${error.message}`);
      return new Response("Webhook not configured", { status: 503 });
    }
    console.warn("[stripe-webhook] signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data: ledger, error: ledgerError } = await admin
    .from("webhook_events")
    .insert({
      provider: "stripe",
      provider_event_id: event.id,
      event_type: event.type,
      processing_status: "received",
    })
    .select("id")
    .single();

  if (ledgerError && ledgerError.code !== "23505") {
    console.error("[stripe-webhook] event ledger insert failed:", ledgerError);
    return new Response("Could not record event", { status: 500 });
  }

  if (!ledger) {
    const { data: prior } = await admin
      .from("webhook_events")
      .select("processing_status")
      .eq("provider_event_id", event.id)
      .maybeSingle();
    if (prior?.processing_status === "processed" || prior?.processing_status === "skipped") {
      return Response.json({ received: true, duplicate: true });
    }
    // `received` / `failed` events are safe to retry: fulfillment is an
    // idempotent upsert and the email has an idempotency key.
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillCheckout(
        event,
        event.data.object as Stripe.Checkout.Session
      );
    } else {
      await updateEvent(event.id, {
        processing_status: "skipped",
        processed_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown fulfillment error";
    console.error("[stripe-webhook] fulfillment failed:", error);
    await updateEvent(event.id, {
      processing_status: "failed",
      error_message: message,
    });
    return new Response("Fulfillment failed", { status: 500 });
  }

  return Response.json({ received: true });
}
