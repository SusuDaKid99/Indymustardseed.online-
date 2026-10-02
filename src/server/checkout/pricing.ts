import "server-only";
import { getInternalProductById } from "@/server/catalog/repository";
import { calculateShippingCents, type ShippingMethod } from "@/lib/checkout/shipping";
import { toCents } from "@/lib/catalog/format";
import type { OrderLine } from "./orders";

/**
 * Server-side cart validation. The browser cart is only a convenience copy –
 * prices, availability and fulfillment rules are always re-checked here
 * against the catalog before an order is created.
 */

export interface CartLineInput {
  productId: string;
  quantity: number;
}

export interface PricedCart {
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  issues: string[];
}

export async function priceCart(input: CartLineInput[], method: ShippingMethod): Promise<PricedCart> {
  const issues: string[] = [];
  const lines: (OrderLine & { freeShippingEligible: boolean })[] = [];

  for (const raw of input.slice(0, 50)) {
    const quantity = Math.floor(Number(raw.quantity));
    if (!raw.productId || !Number.isFinite(quantity) || quantity < 1) continue;

    const product = await getInternalProductById(String(raw.productId));
    if (!product) {
      issues.push("An item in your cart is no longer available and was removed.");
      continue;
    }
    // Affiliate products are purchased on the partner's site – never through our checkout.
    if (product.fulfillmentType === "affiliate") {
      issues.push(`${product.name} is sold by ${product.affiliatePartnerName ?? "a partner retailer"} and can't be checked out here.`);
      continue;
    }
    if (product.inventoryStatus === "out_of_stock") {
      issues.push(`${product.name} is out of stock.`);
      continue;
    }
    const max = product.maxPerOrder ?? 10;
    const qty = Math.min(quantity, max);
    if (qty < quantity) issues.push(`Quantity for ${product.name} was limited to ${max}.`);

    const unit = product.salePrice !== undefined && product.salePrice < product.retailPrice ? product.salePrice : product.retailPrice;
    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      quantity: qty,
      unitPriceCents: toCents(unit),
      fulfillmentType: product.fulfillmentType,
      supplierId: product.supplierId,
      supplierSku: product.supplierSku,
      freeShippingEligible: product.shipping.freeShippingEligible,
    });
  }

  const subtotalCents = lines.reduce((t, l) => t + l.unitPriceCents * l.quantity, 0);
  const shippingCents = calculateShippingCents(
    lines.map((l) => ({ priceCents: l.unitPriceCents, quantity: l.quantity, freeShippingEligible: l.freeShippingEligible })),
    method,
  );
  // TODO(tax): calculate sales tax with Stripe Tax, TaxJar or Avalara once payments are live.
  const taxCents = 0;

  return {
    lines: lines.map(({ freeShippingEligible: _f, ...l }) => l),
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
    issues,
  };
}
