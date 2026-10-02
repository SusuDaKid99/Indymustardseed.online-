"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog/format";
import { useCart } from "@/lib/cart/cart-store";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";
import { QuantitySelector } from "../product/QuantitySelector";

/** Cart line items (image, name, quantity, price, remove). Shared by drawer + cart page. */
export function CartLines({ compact = false }: { compact?: boolean }) {
  const { items, setQuantity, remove } = useCart();
  return (
    <ul className="divide-y divide-earth-100">
      {items.map((item) => (
        <li key={item.productId} className="flex gap-4 py-4">
          <div className={`relative shrink-0 overflow-hidden rounded-xl bg-cream-100 ${compact ? "h-20 w-20" : "h-24 w-24 sm:h-28 sm:w-28"}`}>
            <CatalogImage src={item.image.src} alt={item.image.alt} fill sizes="112px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                <Link href={`/products/${item.slug}`} data-close className="font-semibold leading-snug text-forest-900 hover:underline">
                  {item.name}
                </Link>
              </div>
              <p className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
            {item.quantity > 1 && <p className="text-sm text-muted">{formatPrice(item.price)} each</p>}
            <div className="mt-auto flex items-center justify-between gap-2">
              <QuantitySelector
                size="sm"
                value={item.quantity}
                max={item.maxPerOrder}
                onChange={(n) => setQuantity(item.productId, n)}
                label={`Quantity for ${item.name}`}
              />
              <button
                type="button"
                onClick={() => remove(item.productId)}
                className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-earth-700 hover:bg-cream-100"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Icon name="trash" className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
