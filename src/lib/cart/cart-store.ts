"use client";

import { createLocalStore, useLocalStore } from "@/lib/client/local-store";
import { sumPrices } from "@/lib/catalog/format";
import type { ProductCardData } from "@/lib/catalog/types";

/**
 * Browser cart. This is a convenience copy for display only – the server
 * re-prices and validates every line at checkout (src/server/checkout/pricing.ts).
 *
 * Affiliate products can never be added: they are purchased on the partner's site.
 */

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: { src: string; alt: string };
  price: number;
  quantity: number;
  maxPerOrder: number;
}

const cartStore = createLocalStore<CartItem[]>("ims-cart-v1", []);

type Addable = Pick<ProductCardData, "id" | "slug" | "name" | "brand" | "image" | "price" | "maxPerOrder" | "isAffiliate" | "purchasable">;

function toItem(p: Addable, quantity: number): CartItem {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    image: { src: p.image.src, alt: p.image.alt },
    price: p.price,
    quantity: Math.min(quantity, p.maxPerOrder),
    maxPerOrder: p.maxPerOrder,
  };
}

export const cartActions = {
  /** Returns false when the product can't go through store checkout. */
  add(p: Addable, quantity = 1) {
    if (p.isAffiliate || !p.purchasable || quantity < 1) return false;
    cartStore.set((items) => {
      const existing = items.find((i) => i.productId === p.id);
      if (existing) {
        return items.map((i) =>
          i.productId === p.id ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxPerOrder) } : i,
        );
      }
      return [...items, toItem(p, quantity)];
    });
    return true;
  },
  addMany(lines: { product: Addable; quantity: number }[]) {
    let added = 0;
    for (const l of lines) if (cartActions.add(l.product, l.quantity)) added += 1;
    return added;
  },
  setQuantity(productId: string, quantity: number) {
    cartStore.set((items) =>
      quantity < 1
        ? items.filter((i) => i.productId !== productId)
        : items.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(quantity, i.maxPerOrder) } : i)),
    );
  },
  remove(productId: string) {
    cartStore.set((items) => items.filter((i) => i.productId !== productId));
  },
  clear() {
    cartStore.set([]);
  },
};

export function useCart() {
  const items = useLocalStore(cartStore);
  const count = items.reduce((t, i) => t + i.quantity, 0);
  const subtotal = sumPrices(items);
  return { items, count, subtotal, ...cartActions };
}
