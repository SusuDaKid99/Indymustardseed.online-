import "server-only";
import type { ProductCardData, ResolvedKit } from "@/lib/catalog/types";
import { categories } from "@/lib/catalog/categories";
import { tagLabels } from "@/lib/catalog/labels";
import { getAllCards, getAllKits } from "./repository";
import { articles } from "@/data/content/articles";

/**
 * Product search.
 *
 * Supports product names, categories, brands, keywords and "problems"
 * (e.g. "small apartment", "under $25"). This in-memory implementation is
 * fine for a few hundred products. For a larger catalog, swap in a hosted
 * search index (Algolia, Meilisearch, Typesense, Postgres full-text) behind
 * the same `searchCatalog()` signature.
 */

/** Problem/intent phrases mapped to extra search terms. */
const intentSynonyms: Record<string, string[]> = {
  apartment: ["small-space", "balcony", "indoor", "container", "grow bag", "windowsill"],
  "small space": ["small-space", "balcony", "patio", "windowsill", "container"],
  balcony: ["small-space", "balcony", "grow bag"],
  condo: ["small-space", "indoor", "balcony"],
  pollinator: ["pollinator", "bee", "butterfly", "wildflower", "coneflower", "zinnia"],
  bees: ["pollinator"],
  butterflies: ["pollinator"],
  "seed starting": ["seed tray", "heat mat", "grow light", "humidity dome", "seedling", "soil blocker"],
  seedlings: ["seed tray", "heat mat", "grow light"],
  tomato: ["tomato", "tomatoes", "cage"],
  tomatoes: ["tomato", "cage"],
  "leggy seedlings": ["grow light"],
  winter: ["indoor", "grow light", "microgreen"],
  "no sun": ["grow light", "low-light", "indoor"],
  shade: ["shade", "low-light"],
  kids: ["kid-friendly"],
  beginner: ["beginner-friendly"],
  compost: ["compost", "worm", "castings"],
  "food scraps": ["compost", "worm"],
  herbs: ["herb", "basil", "rosemary"],
  salad: ["lettuce", "microgreen"],
  "raised bed": ["raised bed", "raised-bed", "trellis", "soil"],
};

const STOP = new Set(["for", "a", "the", "to", "and", "of", "in", "my", "i", "how", "with", "under", "below", "less", "than"]);

export interface ParsedQuery {
  text: string;
  terms: string[];
  maxPrice?: number;
}

export function parseQuery(raw: string): ParsedQuery {
  const text = raw.trim().toLowerCase().slice(0, 120);
  const priceMatch = text.match(/(?:under|below|less than|<)\s*\$?\s*(\d+(?:\.\d+)?)/);
  const maxPrice = priceMatch ? Number(priceMatch[1]) : undefined;
  const cleaned = text.replace(/(?:under|below|less than|<)\s*\$?\s*\d+(?:\.\d+)?/, " ");
  const terms = new Set(
    cleaned
      .split(/[^a-z0-9-]+/)
      .filter((t) => t.length > 1 && !STOP.has(t)),
  );
  for (const [phrase, extra] of Object.entries(intentSynonyms)) {
    if (cleaned.includes(phrase)) extra.forEach((e) => terms.add(e));
  }
  // Naive singularization so "tomatoes" also matches "tomato".
  for (const t of [...terms]) {
    if (t.endsWith("es") && t.length > 4) terms.add(t.slice(0, -2));
    else if (t.endsWith("s") && t.length > 3) terms.add(t.slice(0, -1));
  }
  return { text, terms: [...terms], maxPrice };
}

function haystack(p: ProductCardData) {
  const cat = categories.find((c) => c.slug === p.category);
  const sub = cat?.subcategories.find((s) => s.slug === p.subcategory);
  return [
    p.name,
    p.brand,
    p.shortDescription,
    cat?.name,
    sub?.name,
    ...p.tags,
    ...p.tags.map((t) => tagLabels[t]),
    ...p.attributes.plantTypes,
    ...p.attributes.growingSpaces,
    ...p.attributes.sun,
    p.attributes.indoorOutdoor,
  ]
    .join(" ")
    .toLowerCase();
}

function score(p: ProductCardData, q: ParsedQuery) {
  if (q.terms.length === 0) return 1;
  const name = p.name.toLowerCase();
  const hay = haystack(p);
  let s = 0;
  for (const t of q.terms) {
    if (name.includes(t)) s += 5;
    else if (hay.includes(t)) s += 2;
  }
  return s;
}

export async function searchCatalog(raw: string) {
  const q = parseQuery(raw);
  const all = await getAllCards();

  const products = all
    .filter((p) => (q.maxPrice === undefined ? true : p.price <= q.maxPrice))
    .map((p) => ({ p, s: score(p, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || b.p.popularity - a.p.popularity)
    .map((r) => r.p);

  const kits: ResolvedKit[] = (await getAllKits()).filter((k) => {
    const hay = `${k.name} ${k.tagline} ${k.description} ${k.goals.join(" ")} ${k.spaces.join(" ")}`.toLowerCase();
    const termMatch = q.terms.length === 0 ? q.maxPrice !== undefined : q.terms.some((t) => hay.includes(t));
    return termMatch && (q.maxPrice === undefined || k.total <= q.maxPrice);
  });

  const matchedArticles = articles.filter((a) => {
    const hay = `${a.title} ${a.excerpt} ${a.category} ${a.keywords.join(" ")}`.toLowerCase();
    return q.terms.some((t) => hay.includes(t));
  });

  const matchedCategories = categories.flatMap((c) => [
    ...(q.terms.some((t) => c.name.toLowerCase().includes(t)) ? [{ label: c.name, href: `/shop/${c.slug}` }] : []),
    ...c.subcategories
      .filter((s) => q.terms.some((t) => s.name.toLowerCase().includes(t)))
      .map((s) => ({ label: `${s.name} · ${c.shortName}`, href: `/shop/${c.slug}/${s.slug}` })),
  ]);

  return { query: q, products, kits, articles: matchedArticles, categories: matchedCategories.slice(0, 8) };
}
