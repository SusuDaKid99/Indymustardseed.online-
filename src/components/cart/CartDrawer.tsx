"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";
import { useCart } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import type { ProductCardData } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";
import { BuyButton } from "../product/BuyButton";
import { CartLines } from "./CartLines";
import { FreeShippingProgress } from "./FreeShippingProgress";

/** Fetches 2–4 complementary products for the current cart contents. */
export function useComplementary(productIds: string[], limit = 4) {
  const key = [...productIds].sort().join(",");
  const [result, setResult] = useState<{ key: string; items: ProductCardData[] }>({ key: "", items: [] });
  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    fetch(`/api/recommendations?ids=${encodeURIComponent(key)}&limit=${limit}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d: { products: ProductCardData[] }) => setResult({ key, items: d.products }))
      .catch(() => {});
    return () => ctrl.abort();
  }, [key, limit]);
  return key && result.key === key ? result.items : [];
}

/** Slide-out cart drawer built on the native <dialog> element (focus trap + Esc for free). */
export function CartDrawer() {
  const { open, closeCart, announcement } = useCartUI();
  const { items, subtotal, count } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const suggestions = useComplementary(open ? items.map((i) => i.productId) : [], 3);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <dialog
        ref={ref}
        onClose={closeCart}
        onClick={(e) => {
          if (e.target === ref.current || (e.target as HTMLElement).closest("a[data-close]")) closeCart();
        }}
        aria-labelledby="cart-drawer-title"
        className="drawer-right m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-white p-0 backdrop:bg-forest-950/40"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-earth-100 px-5 py-4">
            <h2 id="cart-drawer-title" className="text-xl font-semibold">
              Your cart {count > 0 && <span className="text-base font-normal text-muted">({count})</span>}
            </h2>
            <button type="button" onClick={closeCart} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-100" aria-label="Close cart">
              <Icon name="x" className="h-6 w-6" />
            </button>
          </header>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-leaf-50 text-leaf-700">
                <Icon name="sprout" className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-forest-900">Your cart is empty</p>
              <p className="text-muted">Every garden starts with a single seed.</p>
              <Link href="/shop" data-close className="btn-primary">
                Start shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <FreeShippingProgress subtotal={subtotal} />
                <CartLines compact />
                {suggestions.length > 0 && (
                  <section aria-labelledby="drawer-suggest" className="mt-6 border-t border-earth-100 pt-5">
                    <h3 id="drawer-suggest" className="mb-3 font-sans text-sm font-bold uppercase tracking-wide text-forest-800">
                      You may also need
                    </h3>
                    <ul className="space-y-3">
                      {suggestions.map((p) => (
                        <li key={p.id} className="flex items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                            <CatalogImage src={p.image.src} alt={p.image.alt} fill sizes="56px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/products/${p.slug}`} data-close className="line-clamp-1 text-sm font-semibold text-forest-900 hover:underline">
                              {p.name}
                            </Link>
                            <p className="text-sm text-muted">{formatPrice(p.price)}</p>
                          </div>
                          <BuyButton product={p} size="sm" label={p.isAffiliate ? "View" : "Add"} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
              <footer className="border-t border-earth-100 bg-cream-50 px-5 py-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">Shipping and tax are calculated at checkout.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/cart" data-close className="btn-secondary">
                    View cart
                  </Link>
                  <Link href="/checkout" data-close className="btn-primary">
                    Checkout
                  </Link>
                </div>
                <p className="mt-3 text-center text-xs text-muted">
                  Free standard shipping on eligible orders over {formatPrice(siteConfig.freeShippingThreshold)}
                </p>
              </footer>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
