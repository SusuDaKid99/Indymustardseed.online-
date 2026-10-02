import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles, learnCategories } from "@/data/content/articles";
import { categories } from "@/lib/catalog/categories";
import { getAllKits, getAllProducts } from "@/server/catalog/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const url = (path: string) => `${base}${path}`;

  const staticPaths = [
    "",
    "/shop",
    "/kits",
    "/learn",
    "/garden-finder",
    "/build-your-garden",
    "/growing-in-indianapolis",
    "/about",
    "/suppliers",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/track-order",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
    "/refund-policy",
  ];

  const [products, kits] = await Promise.all([getAllProducts(), getAllKits()]);

  return [
    ...staticPaths.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories
      .filter((c) => c.slug !== "kits")
      .flatMap((c) => [
        { url: url(`/shop/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 },
        ...c.subcategories.map((s) => ({ url: url(`/shop/${c.slug}/${s.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
      ]),
    ...products.map((p) => ({ url: url(`/products/${p.slug}`), lastModified: p.createdAt, priority: 0.8 })),
    ...kits.map((k) => ({ url: url(`/kits/${k.slug}`), priority: 0.7 })),
    ...learnCategories.map((c) => ({ url: url(`/learn/category/${c.slug}`), priority: 0.5 })),
    ...articles.map((a) => ({ url: url(`/learn/${a.slug}`), lastModified: a.publishedAt, priority: 0.6 })),
  ];
}
