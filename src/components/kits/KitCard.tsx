import Link from "next/link";
import { formatPrice } from "@/lib/catalog/format";
import { experienceLabels } from "@/lib/catalog/labels";
import type { ResolvedKit } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";
import { Icon } from "../ui/Icon";

export function KitCard({ kit }: { kit: ResolvedKit }) {
  const partnerItems = kit.items.filter((i) => i.product.isAffiliate).length;
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] bg-cream-100">
        <CatalogImage src={kit.image.src} alt={kit.image.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-forest-800">
          {experienceLabels[kit.experience]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-semibold text-forest-900">
          <Link href={`/kits/${kit.slug}`} className="after:absolute after:inset-0 after:content-['']">
            <span aria-hidden="true" className="mr-1.5">
              {kit.emoji}
            </span>
            {kit.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">{kit.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-xs text-muted">{kit.items.length} items · shopping guide</p>
            <p className="font-semibold text-forest-900">
              {formatPrice(kit.total)} <span className="text-sm font-normal text-muted">total</span>
            </p>
            {partnerItems > 0 && <p className="text-xs text-muted">Includes {partnerItems} partner {partnerItems === 1 ? "item" : "items"}</p>}
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf-50 text-forest-800 transition-colors group-hover:bg-forest-800 group-hover:text-white">
            <Icon name="arrowRight" className="h-5 w-5" />
          </span>
        </div>
      </div>
    </article>
  );
}
