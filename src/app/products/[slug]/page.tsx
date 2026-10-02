import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductRail } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductTags } from "@/components/product/ProductTags";
import { Rating } from "@/components/product/Rating";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { getCategory, getSubcategory } from "@/lib/catalog/categories";
import { experienceLabels, indoorOutdoorLabels, sunLabels } from "@/lib/catalog/labels";
import { getAllProducts, getCardsByIds, getKitBySlug, getProductBySlug, toCardData } from "@/server/catalog/repository";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: "website",
      title: p.seoTitle,
      description: p.seoDescription,
      images: p.images.filter((i) => !i.src.endsWith(".svg")).map((i) => ({ url: i.src, alt: i.alt })),
    },
  };
}

const availabilitySchema = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
  external: "https://schema.org/InStock",
} as const;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    // Kits are bundles, not products – send /products/<kit-slug> to the kit page.
    if (await getKitBySlug(slug)) permanentRedirect(`/kits/${slug}`);
    notFound();
  }

  const card = toCardData(product);
  const [related, together] = await Promise.all([getCardsByIds(product.relatedProductIds), getCardsByIds(product.frequentlyBoughtWithIds)]);
  const category = getCategory(product.category);
  const sub = getSubcategory(product.category, product.subcategory);

  const quickFacts = [
    { label: "Experience", value: experienceLabels[product.attributes.experience] },
    { label: "Where", value: indoorOutdoorLabels[product.attributes.indoorOutdoor] },
    ...(product.attributes.sun.length ? [{ label: "Light", value: product.attributes.sun.map((s) => sunLabels[s]).join(", ") }] : []),
  ];

  // Structured data. Ratings are only emitted when they come from verified reviews – never demo data.
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.images.map((i) => `${siteConfig.url}${i.src}`),
    brand: { "@type": "Brand", name: product.brand },
    category: [category?.name, sub?.name].filter(Boolean).join(" > "),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: availabilitySchema[product.availability],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: product.isAffiliate ? (product.affiliatePartnerName ?? "Partner retailer") : siteConfig.name },
    },
  };
  if (product.reviews?.source === "verified" && product.reviews.count > 0) {
    productLd.aggregateRating = { "@type": "AggregateRating", ratingValue: product.reviews.average, reviewCount: product.reviews.count };
  }

  return (
    <div className="container-page pb-24 lg:pb-8">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
          ...(category && sub ? [{ label: sub.name, href: `/shop/${category.slug}/${sub.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
            <Rating reviews={product.reviews} size="md" />
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            <p className="text-lg text-muted">{product.shortDescription}</p>
            <ProductTags tags={product.tags} claims={product.verifiedClaims} />
          </div>

          <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-leaf-50 p-4 text-sm">
            {quickFacts.map((f) => (
              <div key={f.label}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="font-semibold text-forest-900">{f.value}</dd>
              </div>
            ))}
          </dl>

          <ProductPurchasePanel product={card} shipping={product.shipping} />

          {product.isDemo && (
            <p className="flex gap-2 text-xs text-muted">
              <Icon name="info" className="h-4 w-4 shrink-0" />
              Development demo listing. Brand, price and details are placeholders until real supplier data is imported.
            </p>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="space-y-12">
          <section aria-labelledby="desc">
            <h2 id="desc" className="mb-4 text-2xl font-semibold">
              Product description
            </h2>
            <div className="prose-garden">
              {product.description.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {product.instructions.length > 0 && (
            <section aria-labelledby="howto">
              <h2 id="howto" className="mb-4 text-2xl font-semibold">
                {product.attributes.plantTypes.length ? "Growing instructions" : "How to use"}
              </h2>
              <ol className="space-y-3">
                {product.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-800 text-sm font-bold text-white">{i + 1}</span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {product.faqs.length > 0 && (
            <section aria-labelledby="faq">
              <h2 id="faq" className="mb-4 text-2xl font-semibold">
                FAQ
              </h2>
              <div className="divide-y divide-cream-200 rounded-2xl border border-cream-200">
                {product.faqs.map((f) => (
                  <details key={f.question} className="group px-5">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-forest-900 [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <Icon name="plus" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="pb-4 text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          {product.whatsIncluded.length > 0 && (
            <section aria-labelledby="included" className="rounded-2xl bg-cream-100 p-5">
              <h2 id="included" className="mb-3 text-xl font-semibold">
                What&apos;s included
              </h2>
              <ul className="space-y-2">
                {product.whatsIncluded.map((x) => (
                  <li key={x} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-leaf-700" />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {product.specifications.length > 0 && (
            <section aria-labelledby="specs">
              <h2 id="specs" className="mb-3 text-xl font-semibold">
                Specifications
              </h2>
              <dl className="divide-y divide-cream-200 rounded-2xl border border-cream-200 text-sm">
                {product.specifications.map((s) => (
                  <div key={s.label} className="grid grid-cols-2 gap-3 px-4 py-3">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-medium text-forest-900">{s.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 px-4 py-3">
                  <dt className="text-muted">SKU</dt>
                  <dd className="font-medium text-forest-900">{product.sku}</dd>
                </div>
              </dl>
            </section>
          )}
        </aside>
      </div>

      {together.length > 0 && (
        <section aria-labelledby="fbt" className="mt-16">
          <h2 id="fbt" className="mb-5 text-2xl font-semibold sm:text-3xl">
            Frequently bought together
          </h2>
          <FrequentlyBoughtTogether product={card} others={together} />
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="related" className="text-2xl font-semibold sm:text-3xl">
              Related products
            </h2>
            {category && (
              <Link href={`/shop/${category.slug}`} className="text-sm font-semibold text-forest-700 hover:underline">
                More {category.shortName.toLowerCase()}
              </Link>
            )}
          </div>
          <ProductRail products={related.slice(0, 4)} label="Related products" />
        </section>
      )}

      <JsonLd data={productLd} />
    </div>
  );
}
