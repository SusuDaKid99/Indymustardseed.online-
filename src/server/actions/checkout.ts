"use server";

import { isEmail } from "@/lib/forms";
import type { ShippingMethod } from "@/lib/checkout/shipping";
import { priceCart, type CartLineInput } from "@/server/checkout/pricing";
import { findOrderByNumber, saveOrder, toPublicOrder, type PublicOrder } from "@/server/checkout/orders";
import { createPaymentSession, getEnabledPaymentProviders, type PaymentProviderId } from "@/server/checkout/payments";
import { getSession } from "@/server/auth/session";

export interface CheckoutInput {
  email: string;
  phone?: string;
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  shippingMethod: ShippingMethod;
  paymentProvider?: PaymentProviderId;
  lines: CartLineInput[];
}

export type CheckoutResult =
  | { ok: true; orderId: string; orderNumber: string; payment: { redirectUrl?: string; clientSecret?: string } | null; issues: string[] }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; issues?: string[] };

const US_STATES = new Set(
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "),
);

/**
 * Create an order from the customer's cart.
 *
 * Flow: validate → re-price on server → save order (awaiting payment) →
 * create payment session with the provider. Card data never touches our server.
 */
export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const fieldErrors: Record<string, string> = {};
  const s = input.shipping ?? ({} as CheckoutInput["shipping"]);
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) fieldErrors.email = "Enter a valid email.";
  if (!s.name?.trim()) fieldErrors.name = "Full name is required.";
  if (!s.line1?.trim()) fieldErrors.line1 = "Street address is required.";
  if (!s.city?.trim()) fieldErrors.city = "City is required.";
  if (!US_STATES.has(String(s.state ?? "").toUpperCase())) fieldErrors.state = "Choose a state.";
  if (!/^\d{5}(-\d{4})?$/.test(String(s.postalCode ?? "").trim())) fieldErrors.postalCode = "Enter a 5-digit ZIP code.";
  if (Object.keys(fieldErrors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };

  const method: ShippingMethod = input.shippingMethod === "expedited" ? "expedited" : "standard";
  const priced = await priceCart(Array.isArray(input.lines) ? input.lines : [], method);
  if (priced.lines.length === 0) {
    return { ok: false, error: "Your cart doesn't contain any items that can be checked out here.", issues: priced.issues };
  }

  const enabled = getEnabledPaymentProviders();
  const provider = enabled.find((p) => p.id === input.paymentProvider) ?? enabled[0];
  const session = await getSession();

  const order = await saveOrder({
    email,
    phone: input.phone?.slice(0, 30),
    shippingAddress: {
      name: s.name.trim().slice(0, 120),
      line1: s.line1.trim().slice(0, 200),
      line2: s.line2?.trim().slice(0, 200) || undefined,
      city: s.city.trim().slice(0, 120),
      state: s.state.toUpperCase(),
      postalCode: s.postalCode.trim(),
      country: "US",
    },
    shippingMethod: method,
    lines: priced.lines,
    subtotalCents: priced.subtotalCents,
    shippingCents: priced.shippingCents,
    taxCents: priced.taxCents,
    totalCents: priced.totalCents,
    // Without a configured provider the order stays a draft (development only).
    status: provider ? "awaiting_payment" : "draft",
    customerId: session?.customerId,
  });

  let payment: Awaited<ReturnType<typeof createPaymentSession>> = null;
  if (provider) {
    try {
      payment = await createPaymentSession(provider.id, { id: order.id, totalCents: order.totalCents, email });
    } catch (err) {
      console.error("Payment session failed", err);
      return { ok: false, error: "We couldn't start the payment. Please try again or contact us." };
    }
  }

  // TODO(fulfillment): after the payment webhook confirms payment, group dropship
  // lines by supplierId and call each supplier adapter's submitOrder().
  return { ok: true, orderId: order.id, orderNumber: order.number, payment, issues: priced.issues };
}

export async function trackOrder(
  _prev: { status: "idle" | "found" | "not-found" | "error"; order?: PublicOrder; message?: string },
  form: FormData,
): Promise<{ status: "idle" | "found" | "not-found" | "error"; order?: PublicOrder; message?: string }> {
  const number = String(form.get("orderNumber") ?? "").slice(0, 40);
  const email = String(form.get("email") ?? "").slice(0, 254);
  if (!number || !isEmail(email)) return { status: "error", message: "Enter your order number and the email used at checkout." };
  // TODO(tracking): include carrier tracking numbers from supplier shipment notifications.
  const order = await findOrderByNumber(number, email);
  return order ? { status: "found", order: toPublicOrder(order) } : { status: "not-found", message: "We couldn't find an order with those details." };
}
