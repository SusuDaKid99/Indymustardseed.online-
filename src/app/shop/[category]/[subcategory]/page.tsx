import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing } from "@/components/shop/ShopListing";
import { categories, getCategory, getSubcategory } from "@/lib/catalog/categories";

type Props = {
  params: Promise<{ category: string; subcategory: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ category: c.slug, subcategory: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) return {};
  return {
    title: `${sub.name} | ${cat.name}`,
    description: `${sub.description} Shop ${sub.name.toLowerCase()} at Indy Mustard Seed.`,
    alternates: { canonical: `/shop/${cat.slug}/${sub.slug}` },
  };
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) notFound();
  return <ShopListing category={cat} subcategory={sub} searchParams={await searchParams} />;
}
