import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/catalog/format";
import { getOrder, toPublicOrder } from "@/server/checkout/orders";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false } };

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { order: orderId } = await searchParams;
  const raw = typeof orderId === "string" ? await getOrder(orderId) : undefined;
  if (!raw) notFound();
  const order = toPublicOrder(raw);
  const isDraft = order.status === "draft";

  return (
    <div className="container-page max-w-3xl">
      <ClearCartOnMount />
      <div className="py-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-4xl font-semibold">Thank you!</h1>
        <p className="mt-2 text-lg">
          Your order number is <strong className="font-mono">{order.number}</strong>
        </p>
        {isDraft ? (
          <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-mustard-100 p-4 text-sm text-earth-900">
            Test order: online payments aren&apos;t connected yet, so nothing was charged and this order won&apos;t ship.
          </p>
        ) : (
          <p className="mt-2 text-muted">We&apos;ll email your receipt and send tracking details as each item ships.</p>
        )}
      </div>

      <section aria-labelledby="order-summary" className="card mt-6 p-6 sm:p-8">
        <h2 id="order-summary" className="text-xl font-semibold">
          Order summary
        </h2>
        <ul className="mt-4 divide-y divide-cream-200">
          {order.lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-4 py-3 text-sm">
              <Link href={`/products/${l.slug}`} className="hover:underline">
                {l.quantity} × {l.name}
              </Link>
              <span className="font-semibold">{formatPrice((l.unitPriceCents * l.quantity) / 100)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotalCents / 100)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents / 100)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatPrice(order.taxCents / 100)}</dd>
          </div>
          <div className="flex justify-between border-t border-cream-200 pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.totalCents / 100)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted">Items may arrive in separate packages because they ship directly from different suppliers.</p>
      </section>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/learn" className="btn-primary">
          Get growing tips
        </Link>
        <Link href="/track-order" className="btn-secondary">
          Track an order
        </Link>
      </div>

      <div className="mt-12">
        <NewsletterForm source="order-confirmation" variant="compact" />
      </div>
    </div>
  );
}
