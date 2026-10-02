"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductCardData } from "@/lib/catalog/types";
import { formatPrice } from "@/lib/catalog/format";
import { useCartUI } from "@/lib/cart/cart-ui";
import { cartActions } from "@/lib/cart/cart-store";
import { useHydrated } from "@/lib/client/local-store";
import { useFavorites, useRecentlyViewed, useSavedGardens, type SavedSnapshot } from "@/lib/client/saved";
import { useComplementary } from "../cart/CartDrawer";
import { ProductCard } from "../product/ProductCard";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";
import type { AccountSection } from "./sections";

function SignInNotice() {
  return (
    <div className="rounded-2xl bg-cream-100 p-6">
      <h3 className="text-lg font-semibold">Customer accounts are coming soon</h3>
      <p className="mt-2 text-muted">
        You don&apos;t need an account to shop—guest checkout is always available. Until sign-in launches, saved products, gardens and recently viewed items are kept in this browser.
      </p>
      {/* TODO(auth): replace with the auth provider's sign-in / create-account buttons. */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" disabled aria-disabled="true">
          Sign in (coming soon)
        </button>
        <Link href="/track-order" className="btn-secondary">
          Track a guest order
        </Link>
      </div>
    </div>
  );
}

function SnapshotList({ items, onRemove, empty }: { items: SavedSnapshot[]; onRemove?: (id: string) => void; empty: React.ReactNode }) {
  if (items.length === 0) return <div className="rounded-2xl bg-cream-100 p-6 text-muted">{empty}</div>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <li key={p.id} className="card flex items-center gap-4 p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
            <CatalogImage src={p.image.src} alt={p.image.alt} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{p.brand}</p>
            <Link href={`/products/${p.slug}`} className="font-semibold hover:underline">
              {p.name}
            </Link>
            <p className="text-sm">{formatPrice(p.price)}</p>
          </div>
          {onRemove && (
            <button type="button" onClick={() => onRemove(p.id)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-100" aria-label={`Remove ${p.name}`}>
              <Icon name="trash" className="h-5 w-5" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function useProductsByIds(ids: string[]) {
  const key = ids.join(",");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    fetch(`/api/products?ids=${encodeURIComponent(key)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d: { products: ProductCardData[] }) => setProducts(d.products))
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]);
  return key ? products : [];
}

function GardenItem({ garden, onRemove }: { garden: ReturnType<typeof useSavedGardens>["gardens"][number]; onRemove: () => void }) {
  const { openCart } = useCartUI();
  const products = useProductsByIds(garden.productIds);
  const addAll = () => {
    const n = cartActions.addMany(products.map((p) => ({ product: p, quantity: 1 })));
    openCart(`${n} items from “${garden.name}” added to cart`);
  };
  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{garden.name}</h3>
          <p className="text-sm text-muted">
            {garden.summary} · Saved {new Date(garden.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button type="button" onClick={onRemove} className="btn-ghost btn-sm">
          <Icon name="trash" className="h-4 w-4" /> Remove
        </button>
      </div>
      {products.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/products/${p.slug}`} className="chip">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={addAll} disabled={products.length === 0} className="btn-primary btn-sm mt-4">
        Add store items to cart
      </button>
    </li>
  );
}

export function AccountDashboard({ section }: { section: AccountSection }) {
  const hydrated = useHydrated();
  const favorites = useFavorites();
  const recent = useRecentlyViewed();
  const { gardens, remove } = useSavedGardens();
  const seedIds = [...favorites.items, ...recent].map((p) => p.id).slice(0, 8);
  // With nothing saved yet, the API falls back to popular starter products.
  const recommended = useComplementary(section === "recommendations" ? (seedIds.length ? seedIds : ["popular"]) : [], 8);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-cream-100" />;

  switch (section) {
    case "profile":
      return <SignInNotice />;
    case "orders":
      return (
        <div className="space-y-4">
          <SignInNotice />
          <p className="text-muted">Order history will appear here after you sign in. Guest orders can be looked up with your order number and email.</p>
        </div>
      );
    case "addresses":
      return (
        <div className="space-y-4">
          <SignInNotice />
          <p className="text-muted">Saved shipping addresses will make checkout faster once accounts launch.</p>
        </div>
      );
    case "saved":
      return (
        <SnapshotList
          items={favorites.items}
          onRemove={favorites.remove}
          empty={
            <>
              Tap the heart on any product to save it here. <Link href="/shop" className="underline">Browse the shop</Link>.
            </>
          }
        />
      );
    case "recently-viewed":
      return <SnapshotList items={recent} empty="Products you view will show up here." />;
    case "gardens":
      return gardens.length === 0 ? (
        <div className="rounded-2xl bg-cream-100 p-6 text-muted">
          No saved gardens yet. <Link href="/build-your-garden" className="underline">Build your garden</Link> and save the plan to find it here.
        </div>
      ) : (
        <ul className="space-y-4">
          {gardens.map((g) => (
            <GardenItem key={g.id} garden={g} onRemove={() => remove(g.id)} />
          ))}
        </ul>
      );
    case "recommendations":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-leaf-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">Get personalized suggestions based on your space, light and goals.</p>
            <div className="flex gap-3">
              <Link href="/garden-finder" className="btn-primary btn-sm">
                Garden Finder
              </Link>
              <Link href="/build-your-garden" className="btn-secondary btn-sm">
                Build a garden
              </Link>
            </div>
          </div>
          {recommended.length > 0 && (
            <>
              <h3 className="text-xl font-semibold">{seedIds.length ? "Based on what you've saved and viewed" : "Popular with new growers"}</h3>
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {recommended.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
  }
}
