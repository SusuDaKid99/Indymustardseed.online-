import "server-only";
import { serverEnv } from "@/config/server-env";

/**
 * ============================================================================
 *  PAYMENT PROVIDER REGISTRY
 * ============================================================================
 *  A provider is only "enabled" when its credentials are configured. The UI
 *  must never present a payment method as available unless it is enabled here.
 *
 *  We NEVER handle raw card numbers. Card data is collected by the provider's
 *  hosted fields / hosted checkout (Stripe Payment Element or Checkout, PayPal
 *  Buttons) and we only receive tokens, payment intents and webhooks.
 *
 *  Integration points:
 *   - Stripe:   create a PaymentIntent / Checkout Session in `createPaymentSession`
 *               and confirm via webhook at /api/webhooks/stripe (TODO).
 *               Apple Pay and Google Pay are offered through Stripe's Payment
 *               Request / Express Checkout Element once domain verification
 *               is complete.
 *   - PayPal:   create an order with the Orders v2 API and capture on approval.
 * ============================================================================
 */

export type PaymentProviderId = "stripe" | "paypal" | "apple-pay" | "google-pay";

export interface PaymentProviderStatus {
  id: PaymentProviderId;
  label: string;
  enabled: boolean;
  /** Why it is not available yet – shown only in development. */
  setupHint: string;
}

export function getPaymentProviders(): PaymentProviderStatus[] {
  const stripeReady = Boolean(serverEnv.stripe.secretKey && serverEnv.stripe.publishableKey);
  const paypalReady = Boolean(serverEnv.paypal.clientId && serverEnv.paypal.clientSecret);
  // Wallets require Stripe plus explicit opt-in after Apple Pay domain verification.
  const walletsReady = stripeReady && process.env.STRIPE_WALLETS_ENABLED === "true";

  return [
    { id: "stripe", label: "Credit / debit card", enabled: stripeReady, setupHint: "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY." },
    { id: "paypal", label: "PayPal", enabled: paypalReady, setupHint: "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET." },
    { id: "apple-pay", label: "Apple Pay", enabled: walletsReady, setupHint: "Enable Stripe, verify your domain with Apple, then set STRIPE_WALLETS_ENABLED=true." },
    { id: "google-pay", label: "Google Pay", enabled: walletsReady, setupHint: "Enable Stripe, then set STRIPE_WALLETS_ENABLED=true." },
  ];
}

export function getEnabledPaymentProviders() {
  return getPaymentProviders().filter((p) => p.enabled);
}

/**
 * Create a provider payment session for a draft order.
 * Returns null when no provider is configured (development mode).
 */
export async function createPaymentSession(
  provider: PaymentProviderId,
  order: { id: string; totalCents: number; email: string },
): Promise<{ redirectUrl?: string; clientSecret?: string } | null> {
  const status = getPaymentProviders().find((p) => p.id === provider);
  if (!status?.enabled) return null;

  switch (provider) {
    case "stripe":
    case "apple-pay":
    case "google-pay":
      // TODO(stripe): `npm i stripe`, then:
      // const stripe = new Stripe(serverEnv.stripe.secretKey);
      // const intent = await stripe.paymentIntents.create({
      //   amount: order.totalCents, currency: "usd",
      //   metadata: { orderId: order.id }, receipt_email: order.email,
      //   automatic_payment_methods: { enabled: true },
      // });
      // return { clientSecret: intent.client_secret ?? undefined };
      throw new Error("Stripe integration not implemented yet.");
    case "paypal":
      // TODO(paypal): create order via PayPal Orders v2 API and return approval URL.
      throw new Error("PayPal integration not implemented yet.");
  }
}
