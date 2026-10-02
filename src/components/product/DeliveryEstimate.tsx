"use client";

import { useHydrated } from "@/lib/client/local-store";

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
}

const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });

/**
 * Delivery window from business-day estimates. Rendered on the client so statically
 * generated pages always show dates relative to "today".
 * TODO(shipping): replace with carrier/supplier rate & transit APIs (ZIP-aware) when connected.
 */
export function DeliveryEstimate({ minDays, maxDays }: { minDays: number; maxDays: number }) {
  const hydrated = useHydrated();
  if (!hydrated) return <span>Estimated delivery in {minDays}–{maxDays} business days</span>;
  const now = new Date();
  return (
    <span>
      Estimated delivery <strong>{fmt.format(addBusinessDays(now, minDays))}</strong> – <strong>{fmt.format(addBusinessDays(now, maxDays))}</strong>
    </span>
  );
}
