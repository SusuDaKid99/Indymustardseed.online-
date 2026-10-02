"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";
import { useCart } from "@/lib/cart/cart-store";
import { useHydrated } from "@/lib/client/local-store";
import { ProductCard } from "../product/ProductCard";
import { Icon } from "../ui/Icon";
import { useComplementary } from "./CartDrawer";
import { CartLines } from "./CartLines";
import { FreeShippingProgress } from "./FreeShippingProgress";

export function CartView() {
  const { items, subtotal, count } = useCart();
  const hydrated = useHydrated();
  const suggestions = useComplementary(items.map((i) => i.productId), 4);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-cream-100" aria-label="Loading cart" />;

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] bg-cream-100 px-6 py-16 text-center">
        <Icon name="sprout" className="mx-auto h-10 w-10 text-leaf-700" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted">Not sure where to start? Try a kit or the Garden Finder.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="btn-primary">
            Shop all
          </Link>
          <Link href="/kits" className="btn-secondary">
            Garden kits
          </Link>
          <Link href="/garden-finder" className="btn-ghost">
            What should I grow?
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="cart-items">
          <h2 id="cart-items" className="sr-only">
            Items in your cart
          </h2>
          <FreeShippingProgress subtotal={subtotal} />
          <CartLines />
        </section>
        <aside aria-labelledby="summary" className="h-fit rounded-3xl bg-cream-50 p-6 ring-1 ring-cream-200 lg:sticky lg:top-28">
          <h2 id="summary" className="text-xl font-semibold">
            Order summary
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>
                Subtotal ({count} {count === 1 ? "item" : "items"})
              </dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Shipping</dt>
              <dd>{subtotal >= siteConfig.freeShippingThreshold ? "Free on eligible items" : "Calculated at checkout"}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Tax</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            <Icon name="lock" className="h-4 w-4" /> Checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted">Guest checkout available. Prices are confirmed at checkout.</p>
          <Link href="/shop" className="mt-4 block text-center text-sm font-semibold text-forest-700 underline">
            Continue shopping
          </Link>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section aria-labelledby="also-need">
          <h2 id="also-need" className="mb-6 text-2xl font-semibold">
            You may also need
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
