import { siteConfig } from "@/config/site";
import { toCents } from "@/lib/catalog/format";

/** Shipping rules shared by cart (estimates) and server checkout (authoritative). */

export type ShippingMethod = "standard" | "expedited";

export const shippingRates: Record<ShippingMethod, { label: string; cents: number; description: string }> = {
  standard: { label: "Standard", cents: 695, description: "Typically 3–7 business days after the item ships" },
  expedited: { label: "Expedited", cents: 1495, description: "Typically 2–3 business days after the item ships" },
};

export function calculateShippingCents(
  lines: { priceCents: number; quantity: number; freeShippingEligible: boolean }[],
  method: ShippingMethod,
) {
  if (lines.length === 0) return 0;
  const eligibleSubtotal = lines
    .filter((l) => l.freeShippingEligible)
    .reduce((t, l) => t + l.priceCents * l.quantity, 0);
  const allEligible = lines.every((l) => l.freeShippingEligible);
  if (method === "standard" && allEligible && eligibleSubtotal >= toCents(siteConfig.freeShippingThreshold)) {
    return 0;
  }
  return shippingRates[method].cents;
}
