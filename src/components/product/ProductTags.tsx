import { claimLabels, tagLabels } from "@/lib/catalog/labels";
import type { ProductTag, VerifiedClaim } from "@/lib/catalog/types";
import { Icon } from "../ui/Icon";

/**
 * Merchandising tags plus supplier-VERIFIED claims (e.g. "Made in USA").
 * Claims only appear when present in `verifiedClaims`, which is populated from
 * supplier documentation – never from marketing copy.
 */
export function ProductTags({
  tags,
  claims = [],
  limit,
}: {
  tags: ProductTag[];
  claims?: VerifiedClaim[];
  limit?: number;
}) {
  const shown = limit ? tags.slice(0, limit) : tags;
  if (shown.length === 0 && claims.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Product highlights">
      {claims.map((c) => (
        <li key={c} className="chip bg-cream-100 ring-earth-200">
          <Icon name="shield" className="h-3.5 w-3.5" />
          {claimLabels[c]}
        </li>
      ))}
      {shown.map((t) => (
        <li key={t} className="chip">
          {tagLabels[t]}
        </li>
      ))}
    </ul>
  );
}
