import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ShopListing } from "@/components/shop/ShopListing";
import { categories, getCategory } from "@/lib/catalog/categories";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | Shop`,
    description: cat.description,
    alternates: { canonical: `/shop/${cat.slug}` },
    openGraph: { images: [{ url: cat.image.src, alt: cat.image.alt }] },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  // "Kits" lives at /kits but people (and old links) may try /shop/kits.
  if (category === "kits") permanentRedirect("/kits");
  const cat = getCategory(category);
  if (!cat) notFound();
  return <ShopListing category={cat} searchParams={await searchParams} />;
}
