"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { availabilityLabels } from "@/lib/catalog/labels";
import { cartActions } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import { formatPrice } from "@/lib/catalog/format";
import type { ProductCardData, PublicProduct } from "@/lib/catalog/types";
import { recordRecentlyViewed } from "@/lib/client/saved";
import { Icon } from "../ui/Icon";
import { BuyButton } from "./BuyButton";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { FavoriteButton } from "./FavoriteButton";
import { QuantitySelector } from "./QuantitySelector";

const availabilityTone: Record<PublicProduct["availability"], string> = {
  in_stock: "text-leaf-700",
  low_stock: "text-earth-700",
  out_of_stock: "text-red-800",
  preorder: "text-forest-700",
  external: "text-earth-700",
};

/** Buy box: availability, quantity, Add to Cart / Buy Now (or partner link), delivery estimate, sticky mobile bar. */
export function ProductPurchasePanel({ product, shipping }: { product: ProductCardData; shipping: PublicProduct["shipping"] }) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const { openCart } = useCartUI();
  const mainRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    recordRecentlyViewed(product);
  }, [product]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buyNow = () => {
    if (cartActions.add(product, qty)) router.push("/checkout");
  };
  const addToCart = () => {
    if (cartActions.add(product, qty)) openCart(`${qty} × ${product.name} added to cart`);
  };

  return (
    <>
      <div className="space-y-5">
        <p className={`flex items-center gap-2 text-sm font-semibold ${availabilityTone[product.availability]}`}>
          <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
          {product.isAffiliate ? `Sold by ${product.affiliatePartnerName ?? "a partner retailer"}` : availabilityLabels[product.availability]}
        </p>

        <div ref={mainRef}>
          {product.isAffiliate ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <BuyButton product={product} label="BUY FROM PARTNER" className="flex-1" />
                <FavoriteButton product={product} className="shrink-0 self-center" />
              </div>
              <p className="flex gap-2 rounded-2xl bg-cream-100 p-4 text-sm text-earth-900">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  This product is sold and shipped by <strong>{product.affiliatePartnerName ?? "a partner retailer"}</strong>. You&apos;ll complete your purchase on
                  their website, and their prices, shipping and return policies apply. Indy Mustard Seed may earn a commission at no extra cost to you.{" "}
                  <a href="/affiliate-disclosure" className="underline">
                    Affiliate disclosure
                  </a>
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <QuantitySelector value={qty} onChange={setQty} max={product.maxPerOrder} />
                <FavoriteButton product={product} className="" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={addToCart} disabled={!product.purchasable} className="btn-primary">
                  <Icon name="bag" className="h-4 w-4" />
                  {product.purchasable ? (product.availability === "preorder" ? "Pre-order" : "Add to Cart") : "Out of stock"}
                </button>
                <button type="button" onClick={buyNow} disabled={!product.purchasable} className="btn-mustard">
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>

        {!product.isAffiliate && (
          <ul className="space-y-2 rounded-2xl border border-cream-200 p-4 text-sm">
            <li className="flex gap-3">
              <Icon name="truck" className="h-5 w-5 shrink-0 text-leaf-700" />
              <span>
                <DeliveryEstimate minDays={shipping.minDays} maxDays={shipping.maxDays} />
                <span className="block text-muted">{shipping.estimate}</span>
              </span>
            </li>
            {shipping.freeShippingEligible && (
              <li className="flex gap-3">
                <Icon name="check" className="h-5 w-5 shrink-0 text-leaf-700" />
                <span>Eligible for free standard shipping on qualifying orders</span>
              </li>
            )}
            {shipping.restrictions && (
              <li className="flex gap-3">
                <Icon name="info" className="h-5 w-5 shrink-0 text-earth-700" />
                <span>{shipping.restrictions}</span>
              </li>
            )}
            <li className="flex gap-3">
              <Icon name="lock" className="h-5 w-5 shrink-0 text-leaf-700" />
              <span>Secure checkout · Guest checkout available</span>
            </li>
          </ul>
        )}
      </div>

      {/* Sticky Add to Cart (mobile) – appears once the main button scrolls out of view. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-cream-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(20_48_31/0.25)] backdrop-blur transition-transform lg:hidden ${showSticky ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
        aria-hidden={!showSticky}
        inert={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-forest-900">{product.name}</p>
            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
          </div>
          {product.isAffiliate ? (
            <BuyButton product={product} label="Buy from partner" />
          ) : (
            <button type="button" onClick={addToCart} disabled={!product.purchasable} className="btn-primary">
              <Icon name="bag" className="h-4 w-4" /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
}
