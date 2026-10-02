"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";
import { CatalogImage } from "../ui/CatalogImage";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;
  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-cream-100">
        <CatalogImage src={current.src} alt={current.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3" aria-label={`${name} images`}>
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                className={`relative block h-20 w-20 overflow-hidden rounded-2xl bg-cream-100 ring-2 transition sm:h-24 sm:w-24 ${i === active ? "ring-forest-700" : "ring-transparent hover:ring-earth-200"}`}
              >
                <CatalogImage src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
