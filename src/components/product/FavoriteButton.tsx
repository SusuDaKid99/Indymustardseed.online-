"use client";

import { useFavorites, type SavedSnapshot } from "@/lib/client/saved";
import { Icon } from "../ui/Icon";

export function FavoriteButton({ product, className = "" }: { product: SavedSnapshot; className?: string }) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);
  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from saved products` : `Save ${product.name}`}
      className={`grid h-11 w-11 place-items-center rounded-full bg-white/95 text-forest-800 shadow-sm ring-1 ring-black/5 transition hover:scale-105 hover:text-red-700 ${className}`}
    >
      <Icon name="heart" className={`h-5 w-5 ${saved ? "fill-red-600 text-red-700" : ""}`} />
    </button>
  );
}
