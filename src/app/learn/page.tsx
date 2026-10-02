import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { articles, learnCategories } from "@/data/content/articles";

export const metadata: Metadata = {
  title: "Learn to Grow – Gardening Guides",
  description: "Beginner-friendly guides on starting a garden, seed starting, vegetables, composting, indoor growing, pollinators and small-space gardening.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  const [featured, ...rest] = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Learn" }]} />
      <header className="mb-10 max-w-3xl">
        <p className="eyebrow mb-2">Learn</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Grow with confidence</h1>
        <p className="mt-3 text-lg text-muted">Practical, no-jargon guides for growing food and flowers wherever you are—from Indianapolis backyards to apartment windowsills.</p>
      </header>

      <nav aria-label="Guide categories" className="mb-12">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {learnCategories.map((c) => (
            <li key={c.slug}>
              <Link href={`/learn/category/${c.slug}`} className="flex h-full items-center gap-3 rounded-2xl bg-cream-100 p-4 font-semibold text-forest-900 hover:bg-cream-200">
                <span aria-hidden="true" className="text-2xl">
                  {c.emoji}
                </span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {featured && (
        <section aria-label="Featured guide" className="mb-12">
          <div className="grid gap-5 md:grid-cols-2">
            <ArticleCard article={featured} priority />
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {rest.slice(0, 2).map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="all-guides">
        <h2 id="all-guides" className="mb-6 text-2xl font-semibold sm:text-3xl">
          All guides
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16">
        <NewsletterForm source="learn" />
      </div>
    </div>
  );
}
