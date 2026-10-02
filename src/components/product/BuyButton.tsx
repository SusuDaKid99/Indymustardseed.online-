"use client";

import { cartActions } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import type { ProductCardData } from "@/lib/catalog/types";
import { Icon } from "../ui/Icon";

type Purchasable = Pick<
  ProductCardData,
  "id" | "slug" | "name" | "brand" | "image" | "price" | "maxPerOrder" | "isAffiliate" | "purchasable" | "availability" | "affiliatePartnerName"
>;

/**
 * The single "buy" control used everywhere.
 *  - Store products (dropship / wholesale / house brand) → Add to Cart.
 *  - Affiliate products → "Buy from partner" link through /go/[slug], which
 *    resolves the tracked affiliate URL on the server. Never enters our cart.
 */
export function BuyButton({
  product,
  quantity = 1,
  className = "",
  size = "md",
  label,
}: {
  product: Purchasable;
  quantity?: number;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}) {
  const { openCart } = useCartUI();
  const sizeCls = size === "sm" ? "btn-sm" : "";

  if (product.isAffiliate) {
    return (
      <a
        href={`/go/${product.slug}`}
        target="_blank"
        rel="sponsored nofollow noopener"
        className={`btn-secondary ${sizeCls} ${className}`}
        aria-label={`Buy ${product.name} from ${product.affiliatePartnerName ?? "partner retailer"} (opens in a new tab)`}
      >
        {label ?? "Buy from partner"}
        <Icon name="external" className="h-4 w-4" />
      </a>
    );
  }

  if (!product.purchasable) {
    return (
      <button type="button" disabled className={`btn-primary ${sizeCls} ${className}`}>
        {product.availability === "out_of_stock" ? "Out of stock" : "Unavailable"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn-primary ${sizeCls} ${className}`}
      onClick={() => {
        if (cartActions.add(product, quantity)) openCart(`${product.name} added to cart`);
      }}
    >
      <Icon name="bag" className="h-4 w-4" />
      {label ?? (product.availability === "preorder" ? "Pre-order" : "Add to Cart")}
    </button>
  );
}
