import { formatPrice } from "@/lib/catalog/format";

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "md" | "lg";
}) {
  const cls = size === "lg" ? "text-3xl" : "text-lg";
  return (
    <p className="flex items-baseline gap-2">
      <span className={`${cls} font-bold text-forest-900`}>
        {compareAtPrice && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-muted line-through">
          <span className="sr-only">Original price </span>
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </p>
  );
}
