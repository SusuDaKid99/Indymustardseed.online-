"use client";

import { useActionState } from "react";
import { formatPrice } from "@/lib/catalog/format";
import { trackOrder } from "@/server/actions/checkout";

const statusLabels: Record<string, string> = {
  draft: "Received (payment not yet connected)",
  awaiting_payment: "Awaiting payment",
  paid: "Paid – preparing your order",
  fulfilling: "Being prepared by our supplier",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export function TrackOrderForm() {
  const [state, action, pending] = useActionState(trackOrder, { status: "idle" as const });
  return (
    <div className="space-y-6">
      <form action={action} className="card space-y-5 p-6 sm:p-8">
        <div>
          <label htmlFor="orderNumber" className="field-label">
            Order number
          </label>
          <input id="orderNumber" name="orderNumber" required placeholder="IMS-XXXXXX" className="field uppercase" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="track-email" className="field-label">
            Email used at checkout
          </label>
          <input id="track-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Looking…" : "Track order"}
        </button>
        {(state.status === "error" || state.status === "not-found") && (
          <p role="alert" className="field-error">
            {state.message}
          </p>
        )}
      </form>

      {state.status === "found" && state.order && (
        <section aria-live="polite" className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Order {state.order.number}</h2>
          <p className="mt-1 font-semibold text-leaf-700">{statusLabels[state.order.status] ?? state.order.status}</p>
          <ul className="mt-4 divide-y divide-cream-200">
            {state.order.lines.map((l) => (
              <li key={l.slug} className="flex justify-between py-2 text-sm">
                <span>
                  {l.quantity} × {l.name}
                </span>
                <span>{formatPrice((l.unitPriceCents * l.quantity) / 100)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(state.order.totalCents / 100)}</span>
          </p>
          <p className="mt-4 text-sm text-muted">Tracking numbers will appear here once your items ship.</p>
        </section>
      )}
    </div>
  );
}
