import Image from "next/image";
import Link from "next/link";
import { paramsToFilters } from "@/lib/catalog/filters";
import { categories } from "@/lib/catalog/categories";
import type { Category, Subcategory } from "@/lib/catalog/types";
import { getCardsInCategory } from "@/server/catalog/repository";
import { Breadcrumbs, type Crumb } from "../ui/Breadcrumbs";
import { ShopBrowser } from "./ShopBrowser";

/** Server-rendered listing shell used by /shop, /shop/[category] and /shop/[category]/[subcategory]. */
export async function ShopListing({
  category,
  subcategory,
  searchParams,
}: {
  category?: Category;
  subcategory?: Subcategory;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const products = await getCardsInCategory(category?.slug, subcategory?.slug);
  const { filters, sort } = paramsToFilters(searchParams);

  const crumbs: Crumb[] = [{ label: "Shop", href: "/shop" }];
  if (category) crumbs.push({ label: category.name, href: `/shop/${category.slug}` });
  if (subcategory) crumbs.push({ label: subcategory.name });

  const title = subcategory?.name ?? category?.name ?? "Shop All";
  const description =
    subcategory?.description ?? category?.description ?? "Seeds, plants, tools and growing supplies for balconies, backyards and everything in between.";

  const categoryOptions = category ? undefined : categories.map((c) => ({ value: c.slug, label: c.name }));
  const subcategoryOptions = category && !subcategory ? category.subcategories.map((s) => ({ value: s.slug, label: s.name })) : undefined;

  return (
    <div className="container-page pb-8">
      <Breadcrumbs items={crumbs} />
      <header className="mb-6 grid items-center gap-6 overflow-hidden rounded-[2rem] bg-cream-100 md:grid-cols-[1.4fr_1fr]">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-semibold sm:text-5xl">
            {category && !subcategory && (
              <span aria-hidden="true" className="mr-3">
                {category.emoji}
              </span>
            )}
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-muted sm:text-lg">{description}</p>
        </div>
        {category && (
          <div className="relative hidden h-full min-h-48 md:block">
            <Image src={category.image.src} alt={category.image.alt} fill sizes="35vw" className="object-cover" priority />
          </div>
        )}
      </header>

      {category && (
        <nav aria-label={`${category.name} subcategories`} className="mb-8">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <li className="shrink-0">
              <Link
                href={`/shop/${category.slug}`}
                aria-current={!subcategory ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ring-1 ${!subcategory ? "bg-forest-800 text-white ring-forest-800" : "bg-white text-forest-900 ring-earth-200 hover:bg-leaf-50"}`}
              >
                All {category.shortName}
              </Link>
            </li>
            {category.subcategories.map((s) => {
              const current = s.slug === subcategory?.slug;
              return (
                <li key={s.slug} className="shrink-0">
                  <Link
                    href={`/shop/${category.slug}/${s.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ring-1 ${current ? "bg-forest-800 text-white ring-forest-800" : "bg-white text-forest-900 ring-earth-200 hover:bg-leaf-50"}`}
                  >
                    {s.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {products.length === 0 ? (
        <div className="rounded-3xl bg-cream-100 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-forest-900">New products are on the way.</p>
          <p className="mt-1 text-muted">We&apos;re still curating this section. In the meantime, explore our kits or growing guides.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/kits" className="btn-primary">
              Garden kits
            </Link>
            <Link href="/learn" className="btn-secondary">
              Learn
            </Link>
          </div>
        </div>
      ) : (
        <ShopBrowser
          key={JSON.stringify(searchParams)}
          products={products}
          initialFilters={filters}
          initialSort={sort}
          categoryOptions={categoryOptions}
          subcategoryOptions={subcategoryOptions}
        />
      )}
    </div>
  );
}
