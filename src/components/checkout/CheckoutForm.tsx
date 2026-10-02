"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/config/site";
import { formatPrice, toCents } from "@/lib/catalog/format";
import { useCart } from "@/lib/cart/cart-store";
import { calculateShippingCents, shippingRates, type ShippingMethod } from "@/lib/checkout/shipping";
import { useHydrated } from "@/lib/client/local-store";
import { placeOrder } from "@/server/actions/checkout";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";

export interface PublicPaymentOption {
  id: "stripe" | "paypal" | "apple-pay" | "google-pay";
  label: string;
  enabled: boolean;
  setupHint?: string;
}

const STATES =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

function Input({
  name,
  label,
  error,
  className = "",
  optional,
  ...rest
}: { name: string; label: string; error?: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `co-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input id={id} name={name} className="field" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {error && (
        <p id={`${id}-err`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Guest checkout. Collects contact + shipping details only; card details are NEVER
 * collected here. When a payment provider is configured, its hosted UI (Stripe
 * Payment Element / PayPal Buttons) takes over after the order is created.
 */
export function CheckoutForm({ payments, showSetupHints }: { payments: PublicPaymentOption[]; showSetupHints: boolean }) {
  const { items, subtotal } = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const [method, setMethod] = useState<ShippingMethod>("standard");
  const enabled = payments.filter((p) => p.enabled);
  const [provider, setProvider] = useState(enabled[0]?.id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-cream-100" aria-label="Loading checkout" />;

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] bg-cream-100 px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link href="/shop" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  // Display estimate only – the server re-prices and recalculates shipping when the order is placed.
  // Free-shipping eligibility isn't stored in the cart, so the estimate assumes eligibility.
  const shippingCents = calculateShippingCents(
    items.map((i) => ({ priceCents: toCents(i.price), quantity: i.quantity, freeShippingEligible: true })),
    method,
  );
  const total = subtotal + shippingCents / 100;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setFormError(null);
    startTransition(async () => {
      const result = await placeOrder({
        email: get("email"),
        phone: get("phone") || undefined,
        shipping: {
          name: get("name"),
          line1: get("line1"),
          line2: get("line2") || undefined,
          city: get("city"),
          state: get("state"),
          postalCode: get("postalCode"),
        },
        shippingMethod: method,
        paymentProvider: provider,
        lines: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError([result.error, ...(result.issues ?? [])].join(" "));
        return;
      }
      setErrors({});
      // TODO(payments): when a provider returns a clientSecret, mount the Stripe Payment
      // Element here and confirm the payment before redirecting to the confirmation page.
      if (result.payment?.redirectUrl) {
        window.location.assign(result.payment.redirectUrl);
        return;
      }
      router.push(`/checkout/confirmation?order=${encodeURIComponent(result.orderId)}`);
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-8">
        {formError && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 font-medium text-red-900">
            {formError}
          </p>
        )}

        <fieldset className="card space-y-5 p-6">
          <legend className="float-left mb-2 w-full font-display text-2xl font-semibold">Contact</legend>
          <Input name="email" label="Email" type="email" autoComplete="email" required error={errors.email} className="clear-both" />
          <Input name="phone" label="Phone" type="tel" autoComplete="tel" optional />
          <p className="text-sm text-muted">
            Checking out as a guest.{" "}
            <Link href="/account" className="underline">
              Accounts
            </Link>{" "}
            are coming soon.
          </p>
        </fieldset>

        <fieldset className="card grid gap-5 p-6 sm:grid-cols-6">
          <legend className="float-left mb-2 w-full font-display text-2xl font-semibold sm:col-span-6">Shipping address</legend>
          <Input name="name" label="Full name" autoComplete="name" required error={errors.name} className="clear-both sm:col-span-6" />
          <Input name="line1" label="Street address" autoComplete="address-line1" required error={errors.line1} className="sm:col-span-6" />
          <Input name="line2" label="Apartment, suite, etc." autoComplete="address-line2" optional className="sm:col-span-6" />
          <Input name="city" label="City" autoComplete="address-level2" required error={errors.city} className="sm:col-span-3" />
          <div className="sm:col-span-1">
            <label htmlFor="co-state" className="field-label">
              State
            </label>
            <select id="co-state" name="state" autoComplete="address-level1" required className="field" defaultValue="IN" aria-invalid={errors.state ? true : undefined}>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p className="field-error">{errors.state}</p>}
          </div>
          <Input name="postalCode" label="ZIP code" autoComplete="postal-code" inputMode="numeric" required error={errors.postalCode} className="sm:col-span-2" />
          <p className="text-sm text-muted sm:col-span-6">We currently ship within the United States.</p>
        </fieldset>

        <fieldset className="card space-y-3 p-6">
          <legend className="float-left mb-2 w-full font-display text-2xl font-semibold">Shipping method</legend>
          {(Object.keys(shippingRates) as ShippingMethod[]).map((m) => (
            <label
              key={m}
              className={`clear-both flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 ${method === m ? "border-forest-700 bg-leaf-50" : "border-cream-200"}`}
            >
              <input type="radio" name="shippingMethod" value={m} checked={method === m} onChange={() => setMethod(m)} className="h-5 w-5 accent-forest-700" />
              <span className="flex-1">
                <span className="block font-semibold">{shippingRates[m].label}</span>
                <span className="block text-sm text-muted">{shippingRates[m].description}</span>
              </span>
              <span className="font-semibold">{formatPrice(shippingRates[m].cents / 100)}</span>
            </label>
          ))}
          <p className="text-sm text-muted">
            Free standard shipping on orders over {formatPrice(siteConfig.freeShippingThreshold)} when every item is eligible. Items may ship separately from different
            suppliers.
          </p>
        </fieldset>

        <fieldset className="card space-y-3 p-6">
          <legend className="float-left mb-2 w-full font-display text-2xl font-semibold">Payment</legend>
          {enabled.length > 0 ? (
            enabled.map((p) => (
              <label
                key={p.id}
                className={`clear-both flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 ${provider === p.id ? "border-forest-700 bg-leaf-50" : "border-cream-200"}`}
              >
                <input type="radio" name="paymentProvider" value={p.id} checked={provider === p.id} onChange={() => setProvider(p.id)} className="h-5 w-5 accent-forest-700" />
                <span className="font-semibold">{p.label}</span>
              </label>
            ))
          ) : (
            <div className="clear-both rounded-2xl bg-mustard-100 p-4 text-sm text-earth-900">
              <p className="flex items-center gap-2 font-semibold">
                <Icon name="info" className="h-4 w-4" /> Online payments are not connected yet.
              </p>
              <p className="mt-1">
                This is a development preview. Placing an order records it without charging you so the full flow can be tested. No card details are requested.
              </p>
              {showSetupHints && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
                  {payments.map((p) => (
                    <li key={p.id}>
                      <strong>{p.label}</strong>: {p.setupHint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p className="clear-both flex items-center gap-2 text-xs text-muted">
            <Icon name="shield" className="h-4 w-4" /> Card details are entered on our payment provider&apos;s secure form and never stored by Indy Mustard Seed.
          </p>
        </fieldset>
      </div>

      <aside aria-labelledby="co-summary" className="h-fit rounded-3xl bg-cream-50 p-6 ring-1 ring-cream-200 lg:sticky lg:top-28">
        <h2 id="co-summary" className="text-xl font-semibold">
          Order summary
        </h2>
        <ul className="mt-4 divide-y divide-cream-200">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                <CatalogImage src={i.image.src} alt={i.image.alt} fill sizes="56px" className="object-cover" />
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-forest-800 px-1 text-xs font-bold text-white">{i.quantity}</span>
              </div>
              <span className="flex-1 text-sm font-medium">{i.name}</span>
              <span className="text-sm font-semibold">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping (estimate)</dt>
            <dd>{shippingCents === 0 ? "Free" : formatPrice(shippingCents / 100)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Tax</dt>
            <dd>Calculated with payment</dd>
          </div>
          <div className="flex justify-between border-t border-cream-200 pt-3 text-lg font-bold">
            <dt>Estimated total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <button type="submit" className="btn-primary mt-6 w-full" disabled={pending}>
          <Icon name="lock" className="h-4 w-4" />
          {pending ? "Placing order…" : enabled.length ? "Continue to payment" : "Place test order"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          By placing your order you agree to our{" "}
          <Link href="/terms" className="underline">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}
