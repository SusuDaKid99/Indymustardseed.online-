import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoppingList } from "@/components/kits/ShoppingList";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Icon } from "@/components/ui/Icon";
import { articles } from "@/data/content/articles";
import { formatPrice } from "@/lib/catalog/format";
import { experienceLabels, spaceLabels } from "@/lib/catalog/labels";
import { getAllKits, getKitBySlug } from "@/server/catalog/repository";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllKits()).map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kit = await getKitBySlug(slug);
  if (!kit) return {};
  return {
    title: `${kit.name} – Garden Kit`,
    description: `${kit.tagline} ${kit.description}`.slice(0, 160),
    alternates: { canonical: `/kits/${kit.slug}` },
  };
}

export default async function KitPage({ params }: Props) {
  const { slug } = await params;
  const kit = await getKitBySlug(slug);
  if (!kit) notFound();
  const guides = articles.filter((a) => a.relatedKitSlugs.includes(kit.slug)).slice(0, 3);

  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Garden Kits", href: "/kits" }, { label: kit.name }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cream-100">
            <CatalogImage src={kit.image.src} alt={kit.image.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow mb-2">Garden kit · {experienceLabels[kit.experience]}</p>
            <h1 className="text-4xl font-semibold">
              <span aria-hidden="true" className="mr-2">
                {kit.emoji}
              </span>
              {kit.name}
            </h1>
            <p className="mt-3 text-lg text-forest-800">{kit.tagline}</p>
            <p className="mt-3 text-muted">{kit.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {kit.spaces.map((s) => (
                <li key={s} className="chip">
                  {spaceLabels[s]}
                </li>
              ))}
            </ul>
          </div>
          {kit.steps.length > 0 && (
            <section aria-labelledby="kit-steps" className="rounded-2xl bg-leaf-50 p-5">
              <h2 id="kit-steps" className="mb-3 text-xl font-semibold">
                How to get growing
              </h2>
              <ol className="space-y-2">
                {kit.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest-800 text-xs font-bold text-white">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <section aria-labelledby="kit-list">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 id="kit-list" className="text-2xl font-semibold">
              What&apos;s in this kit
            </h2>
            <p className="text-sm text-muted">{formatPrice(kit.total)} if bought separately</p>
          </div>
          <ShoppingList items={kit.items.map((i) => ({ product: i.product, quantity: i.quantity, note: i.note }))} />
          <p className="mt-3 flex gap-2 text-sm text-muted">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
            Kits are shopping guides: items ship separately from their suppliers and are priced individually. Remove anything you already own.
          </p>
        </section>
      </div>

      {guides.length > 0 && (
        <section aria-labelledby="kit-guides" className="mt-16">
          <h2 id="kit-guides" className="mb-6 text-2xl font-semibold sm:text-3xl">
            Helpful guides
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {guides.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
