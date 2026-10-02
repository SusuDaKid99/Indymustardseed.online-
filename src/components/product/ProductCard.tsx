import Link from "next/link";
import type { ProductCardData } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";
import { BuyButton } from "./BuyButton";
import { FavoriteButton } from "./FavoriteButton";
import { PriceTag } from "./PriceTag";
import { QuickView } from "./QuickView";
import { Rating } from "./Rating";

/**
 * Product card: image, name, brand, price (+ original price when a real sale
 * exists), rating, short description, Add to Cart / Buy from partner,
 * Quick View and favorite.
 */
export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <CatalogImage
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1280px) 18rem, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.onSale && <span className="rounded-full bg-mustard-400 px-2.5 py-1 text-xs font-bold text-forest-950">Sale</span>}
          {product.isAffiliate && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-earth-800 ring-1 ring-earth-200">Partner product</span>
          )}
          {product.availability === "low_stock" && <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-earth-800">Low stock</span>}
          {product.availability === "preorder" && <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-forest-800">Pre-order</span>}
        </div>
        <FavoriteButton product={product} className="absolute right-3 top-3 z-10" />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 hidden justify-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:flex [&>*]:pointer-events-auto">
          <QuickView product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.brand}</p>
        <h3 className="font-sans text-base font-semibold leading-snug text-forest-900">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <Rating reviews={product.reviews} />
        <p className="line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
          {product.isAffiliate && (
            <p className="flex items-center gap-1 text-xs text-muted">
              <Icon name="external" className="h-3.5 w-3.5" /> Sold by {product.affiliatePartnerName}
            </p>
          )}
          {/* relative z-10 keeps the button clickable above the stretched card link */}
          <div className="relative z-10">
            <BuyButton product={product} size="sm" className="w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
