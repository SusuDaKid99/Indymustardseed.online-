"use client";

import Link from "next/link";
import { useState } from "react";
import { cartActions } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import { formatPrice, sumPrices } from "@/lib/catalog/format";
import type { ProductCardData } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";

export interface ShoppingListItem {
  product: ProductCardData;
  quantity: number;
  note?: string;
}

/**
 * Editable shopping list used by Garden Kits and Build Your Garden.
 * Customers can remove individual items before "Add all to cart".
 * Partner (affiliate) items stay as outbound links and are never added to our cart.
 */
export function ShoppingList({
  items,
  addAllLabel = "ADD ALL TO CART",
  onSave,
}: {
  items: ShoppingListItem[];
  addAllLabel?: string;
  onSave?: (productIds: string[]) => void;
}) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const { openCart } = useCartUI();
  const visible = items.filter((i) => !removed.includes(i.product.id));
  const storeLines = visible.filter((i) => !i.product.isAffiliate && i.product.purchasable);
  const partnerLines = visible.filter((i) => i.product.isAffiliate);
  const storeTotal = sumPrices(storeLines.map((i) => ({ price: i.product.price, quantity: i.quantity })));

  return (
    <div className="card overflow-hidden">
      <ul className="divide-y divide-cream-200">
        {visible.map(({ product: p, quantity, note }) => (
          <li key={p.id} className="flex gap-4 p-4 sm:p-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-24 sm:w-24">
              <CatalogImage src={p.image.src} alt={p.image.alt} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/products/${p.slug}`} className="font-semibold text-forest-900 hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {p.brand}
                    {quantity > 1 && ` · Qty ${quantity}`}
                  </p>
                </div>
                <p className="shrink-0 font-semibold">{formatPrice(p.price * quantity)}</p>
              </div>
              {note && <p className="mt-1 text-sm text-muted">{note}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {p.isAffiliate ? (
                  <a
                    href={`/go/${p.slug}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex min-h-9 items-center gap-1 rounded-full bg-cream-100 px-3 text-xs font-semibold text-earth-900"
                  >
                    Buy from {p.affiliatePartnerName ?? "partner"} <Icon name="external" className="h-3.5 w-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : !p.purchasable ? (
                  <span className="text-xs font-semibold text-red-800">Currently unavailable</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setRemoved((r) => [...r, p.id])}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-medium text-earth-700 hover:bg-cream-100"
                  aria-label={`Remove ${p.name} from list`}
                >
                  <Icon name="x" className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="p-6 text-center text-muted">You removed every item.</p>}

      <div className="space-y-3 border-t border-cream-200 bg-cream-50 p-4 sm:p-5">
        {removed.length > 0 && (
          <button type="button" onClick={() => setRemoved([])} className="text-sm font-medium text-forest-700 underline">
            Restore {removed.length} removed {removed.length === 1 ? "item" : "items"}
          </button>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">
              {formatPrice(storeTotal)} <span className="text-sm font-normal text-muted">for {storeLines.length} store items</span>
            </p>
            {partnerLines.length > 0 && (
              <p className="text-xs text-muted">
                {partnerLines.length} partner {partnerLines.length === 1 ? "item is" : "items are"} purchased separately on the retailer&apos;s site.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {onSave && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  onSave(visible.map((i) => i.product.id));
                  setSaved(true);
                }}
              >
                <Icon name={saved ? "check" : "heart"} className="h-4 w-4" /> {saved ? "Saved to account" : "Save this garden"}
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              disabled={storeLines.length === 0}
              onClick={() => {
                const added = cartActions.addMany(storeLines.map((l) => ({ product: l.product, quantity: l.quantity })));
                if (added) openCart(`${added} items added to cart`);
              }}
            >
              <Icon name="bag" className="h-4 w-4" /> {addAllLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
