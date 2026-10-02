import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { articles, getLearnCategory, learnCategories } from "@/data/content/articles";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return learnCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getLearnCategory((await params).category);
  if (!cat) return {};
  return { title: `${cat.name} Guides`, description: cat.description, alternates: { canonical: `/learn/category/${cat.slug}` } };
}

export default async function LearnCategoryPage({ params }: Props) {
  const cat = getLearnCategory((await params).category);
  if (!cat) notFound();
  const list = articles.filter((a) => a.category === cat.slug);
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, { label: cat.name }]} />
      <header className="mb-10">
        <h1 className="text-4xl font-semibold sm:text-5xl">
          <span aria-hidden="true" className="mr-3">
            {cat.emoji}
          </span>
          {cat.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{cat.description}</p>
      </header>
      {list.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl bg-cream-100 p-8 text-center text-muted">New guides for this topic are being written. Check back soon!</p>
      )}
    </div>
  );
}
