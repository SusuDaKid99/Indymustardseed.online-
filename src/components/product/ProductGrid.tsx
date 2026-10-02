import type { ProductCardData } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, priorityCount = 0 }: { products: ProductCardData[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal, swipeable rail on mobile; grid on desktop. */
export function ProductRail({ products, label }: { products: ProductCardData[]; label: string }) {
  return (
    <ul
      aria-label={label}
      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4"
    >
      {products.map((p) => (
        <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
