import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KitCard } from "@/components/kits/KitCard";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { articles, getArticle, getLearnCategory } from "@/data/content/articles";
import { getAllKits, getCardsByIds } from "@/server/catalog/repository";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/learn/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: a.publishedAt, images: [{ url: a.image.src, alt: a.image.alt }] },
  };
}

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const cat = getLearnCategory(article.category);

  // Resolve product recommendation blocks against the live catalog.
  const blocks = await Promise.all(
    article.body.map(async (b) => (b.type === "products" ? { ...b, products: await getCardsByIds(b.productIds) } : b)),
  );
  const kits = (await getAllKits()).filter((k) => article.relatedKitSlugs.includes(k.slug));
  const more = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  return (
    <article className="container-page">
      <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, ...(cat ? [{ label: cat.name, href: `/learn/category/${cat.slug}` }] : []), { label: article.title }]} />

      <header className="mx-auto max-w-3xl text-center">
        {cat && (
          <Link href={`/learn/category/${cat.slug}`} className="eyebrow hover:underline">
            {cat.name}
          </Link>
        )}
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
        <p className="mt-4 text-sm text-muted">
          <time dateTime={article.publishedAt}>{dateFmt.format(new Date(article.publishedAt))}</time> · {article.readMinutes} min read
        </p>
      </header>

      <div className="relative mx-auto mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-[2rem] bg-cream-100">
        <Image src={article.image.src} alt={article.image.alt} fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
      </div>

      <div className="prose-garden mx-auto mt-10 max-w-3xl">
        {blocks.map((b, i) => {
          switch (b.type) {
            case "p":
              return <p key={i}>{b.text}</p>;
            case "h2":
              return <h2 key={i}>{b.text}</h2>;
            case "list":
              return b.ordered ? (
                <ol key={i}>
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              ) : (
                <ul key={i}>
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              );
            case "tip":
              return (
                <aside key={i} className="my-8 flex gap-3 rounded-2xl bg-leaf-50 p-5 ring-1 ring-leaf-100">
                  <Icon name="leaf" className="mt-1 h-5 w-5 shrink-0 text-leaf-700" />
                  <div>
                    <p className="m-0 font-semibold text-forest-900">{b.title}</p>
                    <p className="m-0 mt-1 text-base">{b.text}</p>
                  </div>
                </aside>
              );
            case "products":
              return b.products.length ? (
                <section key={i} aria-label={b.title} className="my-10 rounded-[1.5rem] bg-cream-50 p-5 ring-1 ring-cream-200 sm:p-6">
                  <p className="mb-4 mt-0 font-sans text-sm font-bold uppercase tracking-wide text-forest-800">{b.title}</p>
                  <ul className="m-0 grid list-none grid-cols-2 gap-3 space-y-0 p-0 sm:grid-cols-3">
                    {b.products.slice(0, 3).map((p) => (
                      <li key={p.id}>
                        <ProductCard product={p} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null;
          }
        })}
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-sm text-muted">
        Some links on this page go to products sold by partner retailers. See our{" "}
        <Link href="/affiliate-disclosure" className="underline">
          affiliate disclosure
        </Link>
        .
      </p>

      {kits.length > 0 && (
        <section aria-labelledby="article-kits" className="mx-auto mt-16 max-w-5xl">
          <h2 id="article-kits" className="mb-6 text-2xl font-semibold">
            Ready to get started?
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {kits.map((k) => (
              <li key={k.id}>
                <KitCard kit={k} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-5xl">
        <NewsletterForm source={`article:${article.slug}`} />
      </div>

      <section aria-labelledby="more-guides" className="mt-16">
        <h2 id="more-guides" className="mb-6 text-2xl font-semibold">
          Keep learning
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {more.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          image: `${siteConfig.url}${article.image.src}`,
          author: { "@type": "Organization", name: siteConfig.name },
          publisher: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: `${siteConfig.url}/learn/${article.slug}`,
        }}
      />
    </article>
  );
}
