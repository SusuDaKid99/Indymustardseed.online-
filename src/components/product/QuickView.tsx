"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { ProductCardData } from "@/lib/catalog/types";
import { availabilityLabels } from "@/lib/catalog/labels";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";
import { BuyButton } from "./BuyButton";
import { PriceTag } from "./PriceTag";
import { ProductTags } from "./ProductTags";
import { QuantitySelector } from "./QuantitySelector";
import { Rating } from "./Rating";

/** Quick View uses the native <dialog> element: built-in focus trapping, Esc to close, inert background. */
export function QuickView({ product }: { product: ProductCardData }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [qty, setQty] = useState(1);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-semibold text-forest-900 shadow-sm ring-1 ring-black/5 hover:bg-white"
        aria-haspopup="dialog"
      >
        <Icon name="eye" className="h-4 w-4" />
        Quick View
        <span className="sr-only">: {product.name}</span>
      </button>
      <dialog
        ref={ref}
        aria-labelledby={`qv-${product.id}`}
        className="m-auto w-[min(56rem,calc(100%-1.5rem))] rounded-3xl p-0 shadow-[var(--shadow-lift)] backdrop:bg-forest-950/50 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-2">
          <div className="relative aspect-square bg-cream-100">
            <CatalogImage src={product.image.src} alt={product.image.alt} fill sizes="(min-width: 768px) 28rem, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{product.brand}</p>
                <h2 id={`qv-${product.id}`} className="text-2xl font-semibold">
                  {product.name}
                </h2>
              </div>
              <button type="button" onClick={() => ref.current?.close()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-cream-100" aria-label="Close quick view">
                <Icon name="x" />
              </button>
            </div>
            <Rating reviews={product.reviews} />
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
            <p className="text-muted">{product.shortDescription}</p>
            <ProductTags tags={product.tags} claims={product.verifiedClaims} />
            <p className="flex items-center gap-2 text-sm text-forest-800">
              <Icon name="truck" className="h-4 w-4" />
              {product.isAffiliate ? `Sold & shipped by ${product.affiliatePartnerName}` : `${availabilityLabels[product.availability]} · ${product.shippingEstimate}`}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3">
              {!product.isAffiliate && product.purchasable && (
                <QuantitySelector value={qty} onChange={setQty} max={product.maxPerOrder} label={`Quantity for ${product.name}`} />
              )}
              <BuyButton product={product} quantity={qty} className="flex-1" />
            </div>
            {product.isAffiliate && (
              <p className="text-xs text-muted">
                This item is sold by a partner retailer. We may earn a commission. <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
              </p>
            )}
            <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-forest-700 underline underline-offset-2">
              View full details
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
