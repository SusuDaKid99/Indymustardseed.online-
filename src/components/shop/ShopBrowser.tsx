"use client";

import { useMemo, useRef, useState } from "react";
import {
  applyFilters,
  countActiveFilters,
  emptyFilters,
  filtersToParams,
  priceBuckets,
  purchaseTypeLabels,
  purchaseTypeOf,
  sortOptions,
  sortProducts,
  type ProductFilters,
  type SortOption,
} from "@/lib/catalog/filters";
import { experienceLabels, indoorOutdoorLabels, plantTypeLabels, spaceLabels, sunLabels } from "@/lib/catalog/labels";
import type { ProductCardData } from "@/lib/catalog/types";
import { ProductGrid } from "../product/ProductGrid";
import { Icon } from "../ui/Icon";

type ArrayKey = Exclude<keyof ProductFilters, "inStockOnly">;

interface FacetOption {
  value: string;
  label: string;
  count: number;
}
interface Facet {
  key: ArrayKey;
  title: string;
  options: FacetOption[];
}

/** Build facet options (with counts) from the products in scope, so empty options never show. */
function buildFacets(products: ProductCardData[], scope: { categoryOptions?: { value: string; label: string }[]; subcategoryOptions?: { value: string; label: string }[] }): Facet[] {
  const tally = <T extends string>(values: (p: ProductCardData) => T[], labels: Record<T, string> | ((v: T) => string)) => {
    const counts = new Map<T, number>();
    for (const p of products) for (const v of new Set(values(p))) counts.set(v, (counts.get(v) ?? 0) + 1);
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count, label: typeof labels === "function" ? labels(value) : labels[value] }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };
  const fromList = (opts: { value: string; label: string }[] | undefined, get: (p: ProductCardData) => string[]) =>
    (opts ?? [])
      .map((o) => ({ ...o, count: products.filter((p) => get(p).includes(o.value)).length }))
      .filter((o) => o.count > 0);

  const facets: Facet[] = [
    { key: "categories", title: "Category", options: fromList(scope.categoryOptions, (p) => [p.category, ...p.alsoIn.map((a) => a.category)]) },
    { key: "subcategories", title: "Type", options: fromList(scope.subcategoryOptions, (p) => [p.subcategory, ...p.alsoIn.map((a) => a.subcategory ?? "")]) },
    {
      key: "price",
      title: "Price",
      options: priceBuckets
        .map((b) => ({ value: b.value, label: b.label, count: products.filter((p) => p.price >= b.min && p.price < b.max).length }))
        .filter((o) => o.count > 0),
    },
    { key: "brands", title: "Brand", options: tally((p) => [p.brand], (v) => v) },
    { key: "indoorOutdoor", title: "Indoor / outdoor", options: tally((p) => [p.attributes.indoorOutdoor], indoorOutdoorLabels) },
    { key: "experience", title: "Experience level", options: tally((p) => [p.attributes.experience], experienceLabels) },
    { key: "plantTypes", title: "Plant type", options: tally((p) => p.attributes.plantTypes, plantTypeLabels) },
    { key: "spaces", title: "Growing space", options: tally((p) => p.attributes.growingSpaces, spaceLabels) },
    { key: "sun", title: "Sun requirements", options: tally((p) => p.attributes.sun, sunLabels) },
    { key: "purchaseType", title: "Product type", options: tally((p) => [purchaseTypeOf(p.fulfillmentType)], purchaseTypeLabels) },
  ];
  return facets.filter((f) => f.options.length > 1 || (f.options.length === 1 && f.key === "purchaseType"));
}

function FilterPanel({
  facets,
  filters,
  onToggle,
  onInStock,
  idPrefix,
}: {
  facets: Facet[];
  filters: ProductFilters;
  onToggle: (key: ArrayKey, value: string) => void;
  onInStock: (v: boolean) => void;
  idPrefix: string;
}) {
  return (
    <div className="divide-y divide-cream-200">
      {facets.map((facet, i) => {
        const selected = filters[facet.key] as string[];
        return (
          <details key={facet.key} open={i < 4 || selected.length > 0} className="group py-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold text-forest-900 [&::-webkit-details-marker]:hidden">
              <span>
                {facet.title}
                {selected.length > 0 && <span className="ml-2 rounded-full bg-leaf-100 px-2 py-0.5 text-xs">{selected.length}</span>}
              </span>
              <Icon name="chevronDown" className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <fieldset className="mt-1 space-y-0.5">
              <legend className="sr-only">{facet.title}</legend>
              {facet.options.map((o) => {
                const id = `${idPrefix}-${facet.key}-${o.value}`;
                return (
                  <div key={o.value} className="flex min-h-10 items-center gap-3">
                    <input
                      id={id}
                      type="checkbox"
                      className="h-5 w-5 shrink-0 rounded border-earth-200 accent-forest-700"
                      checked={selected.includes(o.value)}
                      onChange={() => onToggle(facet.key, o.value)}
                    />
                    <label htmlFor={id} className="flex flex-1 cursor-pointer justify-between gap-2 text-sm text-ink">
                      <span>{o.label}</span>
                      <span className="text-muted">{o.count}</span>
                    </label>
                  </div>
                );
              })}
            </fieldset>
          </details>
        );
      })}
      <div className="py-4">
        <div className="flex min-h-10 items-center gap-3">
          <input
            id={`${idPrefix}-instock`}
            type="checkbox"
            className="h-5 w-5 rounded accent-forest-700"
            checked={filters.inStockOnly}
            onChange={(e) => onInStock(e.target.checked)}
          />
          <label htmlFor={`${idPrefix}-instock`} className="cursor-pointer text-sm font-semibold text-forest-900">
            Availability: in stock only
          </label>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive product listing: filters (sidebar on desktop, drawer on mobile),
 * sorting and shareable URLs. Initial results are server-rendered by the page.
 */
export function ShopBrowser({
  products,
  initialFilters,
  initialSort,
  categoryOptions,
  subcategoryOptions,
}: {
  products: ProductCardData[];
  initialFilters: ProductFilters;
  initialSort: SortOption;
  categoryOptions?: { value: string; label: string }[];
  subcategoryOptions?: { value: string; label: string }[];
}) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const drawerRef = useRef<HTMLDialogElement>(null);

  const facets = useMemo(() => buildFacets(products, { categoryOptions, subcategoryOptions }), [products, categoryOptions, subcategoryOptions]);
  const results = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort]);
  const active = countActiveFilters(filters);

  const commit = (next: ProductFilters, nextSort: SortOption) => {
    setFilters(next);
    setSort(nextSort);
    const qs = filtersToParams(next, nextSort).toString();
    // Shallow URL update keeps filtered views shareable without a server round-trip.
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };
  const toggle = (key: ArrayKey, value: string) => {
    const current = filters[key] as string[];
    const nextValues = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    commit({ ...filters, [key]: nextValues }, sort);
  };
  const setInStock = (v: boolean) => commit({ ...filters, inStockOnly: v }, sort);
  const clearAll = () => commit(emptyFilters, sort);

  const chips = facets.flatMap((f) =>
    (filters[f.key] as string[]).map((v) => ({ key: f.key, value: v, label: f.options.find((o) => o.value === v)?.label ?? v })),
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
      <aside aria-label="Product filters" className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-forest-800">Filters</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-sm font-medium text-forest-700 underline">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel facets={facets} filters={filters} onToggle={toggle} onInStock={setInStock} idPrefix="desk" />
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <strong className="text-forest-900">{results.length}</strong> {results.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => drawerRef.current?.showModal()} className="btn-secondary btn-sm lg:hidden">
              <Icon name="filter" className="h-4 w-4" /> Filters{active > 0 && ` (${active})`}
            </button>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => commit(filters, e.target.value as SortOption)}
              className="h-10 rounded-full border border-earth-200 bg-white px-4 text-sm font-medium text-forest-900"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={`${c.key}-${c.value}`}>
                <button type="button" onClick={() => toggle(c.key, c.value)} className="chip min-h-9 px-3 hover:bg-leaf-100" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <Icon name="x" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            {filters.inStockOnly && (
              <li>
                <button type="button" onClick={() => setInStock(false)} className="chip min-h-9 px-3 hover:bg-leaf-100" aria-label="Remove filter in stock only">
                  In stock only <Icon name="x" className="h-3.5 w-3.5" />
                </button>
              </li>
            )}
            <li>
              <button type="button" onClick={clearAll} className="min-h-9 px-2 text-sm font-medium text-forest-700 underline">
                Clear all
              </button>
            </li>
          </ul>
        )}

        {results.length > 0 ? (
          <ProductGrid products={results} priorityCount={2} />
        ) : (
          <div className="rounded-3xl bg-cream-100 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-forest-900">No products match those filters.</p>
            <p className="mt-1 text-muted">Try removing a filter or two.</p>
            <button type="button" onClick={clearAll} className="btn-primary mt-5">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={drawerRef}
        aria-label="Filters"
        className="drawer-right m-0 ml-auto h-dvh max-h-dvh w-full max-w-sm bg-white p-0 backdrop:bg-forest-950/40"
        onClick={(e) => e.target === drawerRef.current && drawerRef.current?.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-3">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button type="button" onClick={() => drawerRef.current?.close()} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-100" aria-label="Close filters">
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterPanel facets={facets} filters={filters} onToggle={toggle} onInStock={setInStock} idPrefix="mob" />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-cream-200 p-4">
            <button type="button" onClick={clearAll} className="btn-secondary" disabled={active === 0}>
              Clear all
            </button>
            <button type="button" onClick={() => drawerRef.current?.close()} className="btn-primary">
              Show {results.length}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
