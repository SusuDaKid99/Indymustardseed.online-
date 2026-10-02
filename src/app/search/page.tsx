import type { Metadata } from "next";
import Link from "next/link";
import { KitCard } from "@/components/kits/KitCard";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { searchCatalog } from "@/server/catalog/search";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const examples = ["tomatoes", "small apartment", "pollinators", "seed starting", "under $25", "composting", "grow lights"];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  return { title: query ? `Search: ${query.slice(0, 60)}` : "Search", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 120) : "";
  const results = query ? await searchCatalog(query) : null;
  const total = results ? results.products.length + results.kits.length + results.articles.length : 0;

  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="text-4xl font-semibold">{query ? <>Results for “{query}”</> : "Search the store"}</h1>

      <form role="search" action="/search" className="mt-6 flex max-w-2xl gap-2">
        <label htmlFor="search-page-q" className="sr-only">
          Search products, guides and kits
        </label>
        <input
          id="search-page-q"
          type="search"
          name="q"
          defaultValue={query}
          autoFocus={!query}
          placeholder="Try “tomatoes” or “small apartment”"
          className="field flex-1"
        />
        <button type="submit" className="btn-primary">
          <Icon name="search" className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only">Search</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Popular searches:</span>
        {examples.map((e) => (
          <Link key={e} href={`/search?q=${encodeURIComponent(e)}`} className="chip">
            {e}
          </Link>
        ))}
      </div>

      {results && (
        <div className="mt-10 space-y-14">
          <p aria-live="polite" className="text-muted">
            {total === 0 ? "No matches yet." : `${results.products.length} products, ${results.kits.length} kits and ${results.articles.length} guides found.`}
            {results.query.maxPrice !== undefined && ` Showing items under $${results.query.maxPrice}.`}
          </p>

          {results.categories.length > 0 && (
            <section aria-labelledby="sr-categories">
              <h2 id="sr-categories" className="mb-4 text-xl font-semibold">
                Categories
              </h2>
              <ul className="flex flex-wrap gap-2">
                {results.categories.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="chip">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.products.length > 0 && (
            <section aria-labelledby="sr-products">
              <h2 id="sr-products" className="mb-6 text-2xl font-semibold">
                Products
              </h2>
              <ProductGrid products={results.products.slice(0, 24)} priorityCount={2} />
            </section>
          )}

          {results.kits.length > 0 && (
            <section aria-labelledby="sr-kits">
              <h2 id="sr-kits" className="mb-6 text-2xl font-semibold">
                Garden kits
              </h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.kits.map((k) => (
                  <li key={k.slug}>
                    <KitCard kit={k} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.articles.length > 0 && (
            <section aria-labelledby="sr-articles">
              <h2 id="sr-articles" className="mb-6 text-2xl font-semibold">
                Growing guides
              </h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.articles.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {total === 0 && (
            <div className="rounded-[2rem] bg-cream-100 p-8 text-center">
              <h2 className="text-2xl font-semibold">Not sure what you need?</h2>
              <p className="mt-2 text-muted">Answer a few quick questions and we&apos;ll point you in the right direction.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/garden-finder" className="btn-primary">
                  What should I grow?
                </Link>
                <Link href="/shop" className="btn-secondary">
                  Browse all products
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
