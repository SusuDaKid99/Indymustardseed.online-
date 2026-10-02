"use client";

import Link from "next/link";
import { useState } from "react";
import { cartActions } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import { formatPrice, sumPrices } from "@/lib/catalog/format";
import type { ProductCardData } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";

/**
 * "Frequently bought together" – curated pairings from product data
 * (TODO(analytics): replace with real co-purchase data once orders exist).
 * Partner (affiliate) items are listed as links, never added to our cart.
 */
export function FrequentlyBoughtTogether({ product, others }: { product: ProductCardData; others: ProductCardData[] }) {
  const all = [product, ...others];
  const storeItems = all.filter((p) => !p.isAffiliate && p.purchasable);
  const [selected, setSelected] = useState<string[]>(storeItems.map((p) => p.id));
  const { openCart } = useCartUI();
  const chosen = storeItems.filter((p) => selected.includes(p.id));
  const total = sumPrices(chosen.map((p) => ({ price: p.price, quantity: 1 })));

  return (
    <div className="card p-5 sm:p-6">
      <ul className="divide-y divide-cream-200">
        {all.map((p, i) => {
          const canAdd = !p.isAffiliate && p.purchasable;
          const id = `fbt-${p.id}`;
          return (
            <li key={p.id} className="flex items-center gap-4 py-3">
              {canAdd ? (
                <input
                  id={id}
                  type="checkbox"
                  className="h-5 w-5 shrink-0 accent-forest-700"
                  checked={selected.includes(p.id)}
                  onChange={() => setSelected((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                />
              ) : (
                <span className="h-5 w-5 shrink-0" />
              )}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                <CatalogImage src={p.image.src} alt={p.image.alt} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor={canAdd ? id : undefined} className="block text-sm font-semibold text-forest-900">
                  {i === 0 && <span className="text-muted">This item: </span>}
                  {p.name}
                </label>
                {p.isAffiliate ? (
                  <a href={`/go/${p.slug}`} target="_blank" rel="sponsored nofollow noopener" className="inline-flex items-center gap-1 text-xs font-medium text-forest-700 underline">
                    Sold by {p.affiliatePartnerName} <Icon name="external" className="h-3 w-3" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  i > 0 && (
                    <Link href={`/products/${p.slug}`} className="text-xs text-muted underline">
                      View details
                    </Link>
                  )
                )}
              </div>
              <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-col gap-3 border-t border-cream-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">
          Total for {chosen.length} {chosen.length === 1 ? "item" : "items"}: <span className="text-lg">{formatPrice(total)}</span>
        </p>
        <button
          type="button"
          className="btn-primary"
          disabled={chosen.length === 0}
          onClick={() => {
            const added = cartActions.addMany(chosen.map((p) => ({ product: p, quantity: 1 })));
            if (added) openCart(`${added} items added to cart`);
          }}
        >
          Add selected to cart
        </button>
      </div>
    </div>
  );
}
