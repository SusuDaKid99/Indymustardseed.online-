import "server-only";
import { cache } from "react";
import type {
  GardenKit,
  Product,
  ProductCardData,
  PublicProduct,
  ResolvedKit,
} from "@/lib/catalog/types";
import { matchesCategory } from "@/lib/catalog/filters";
import { sumPrices } from "@/lib/catalog/format";
import { seedProducts } from "@/data/seed/products";
import { seedKits } from "@/data/seed/kits";

/**
 * ============================================================================
 *  PRODUCT REPOSITORY
 * ============================================================================
 *  The UI never imports product data directly. It asks this repository, which
 *  reads from a `CatalogSource`. Today the source is the in-repo seed data; in
 *  production swap in a database-backed source (Postgres/Prisma, Supabase,
 *  a headless commerce API, etc.) without touching any page or component.
 *
 *    CATALOG_SOURCE=seed      → src/data/seed/*.ts (development)
 *    CATALOG_SOURCE=database  → TODO: implement `databaseSource` below
 *
 *  Supplier feeds (src/server/suppliers) write INTO the database; this
 *  repository only reads.
 * ============================================================================
 */

export interface CatalogSource {
  listProducts(): Promise<Product[]>;
  listKits(): Promise<GardenKit[]>;
}

const seedSource: CatalogSource = {
  async listProducts() {
    return seedProducts;
  },
  async listKits() {
    return seedKits;
  },
};

// TODO(database): implement with your ORM of choice, e.g.
// const databaseSource: CatalogSource = {
//   listProducts: () => db.product.findMany({ where: { status: "active" } }),
//   listKits: () => db.kit.findMany({ include: { items: true } }),
// };

function getSource(): CatalogSource {
  switch (process.env.CATALOG_SOURCE ?? "seed") {
    case "seed":
    default:
      return seedSource;
  }
}

/* ----------------------------- Projections ----------------------------- */

/** Strip every internal field. Explicit allow-list – never spread `p`. */
export function toPublicProduct(p: Product): PublicProduct {
  const onSale = p.salePrice !== undefined && p.salePrice < p.retailPrice;
  const isAffiliate = p.fulfillmentType === "affiliate";
  const availability = isAffiliate ? "external" : p.inventoryStatus;
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    images: p.images,
    category: p.category,
    subcategory: p.subcategory,
    alsoIn: p.alsoIn ?? [],
    brand: p.brand,
    price: onSale ? p.salePrice! : p.retailPrice,
    compareAtPrice: onSale ? p.retailPrice : undefined,
    onSale,
    fulfillmentType: p.fulfillmentType,
    isAffiliate,
    affiliatePartnerName: isAffiliate ? p.affiliatePartnerName ?? "our partner retailer" : undefined,
    availability,
    purchasable: !isAffiliate && (availability === "in_stock" || availability === "low_stock" || availability === "preorder"),
    maxPerOrder: p.maxPerOrder ?? 10,
    shipping: {
      estimate: p.shipping.estimate,
      minDays: p.shipping.minDays,
      maxDays: p.shipping.maxDays,
      freeShippingEligible: p.shipping.freeShippingEligible,
      restrictions: p.shipping.restrictions,
    },
    tags: p.tags,
    verifiedClaims: p.verifiedClaims,
    attributes: p.attributes,
    specifications: p.specifications,
    whatsIncluded: p.whatsIncluded,
    instructions: p.instructions ?? [],
    faqs: p.faqs,
    relatedProductIds: p.relatedProductIds,
    frequentlyBoughtWithIds: p.frequentlyBoughtWithIds,
    reviews: p.reviews,
    seoTitle: p.seoTitle ?? p.name,
    seoDescription: p.seoDescription ?? p.shortDescription,
    featured: Boolean(p.featured),
    popularity: p.popularity,
    createdAt: p.createdAt,
    isDemo: Boolean(p.isDemo),
  };
}

export function toCardData(p: PublicProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    shortDescription: p.shortDescription,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    onSale: p.onSale,
    isAffiliate: p.isAffiliate,
    affiliatePartnerName: p.affiliatePartnerName,
    availability: p.availability,
    purchasable: p.purchasable,
    maxPerOrder: p.maxPerOrder,
    reviews: p.reviews,
    tags: p.tags,
    verifiedClaims: p.verifiedClaims,
    category: p.category,
    subcategory: p.subcategory,
    alsoIn: p.alsoIn,
    attributes: p.attributes,
    fulfillmentType: p.fulfillmentType,
    popularity: p.popularity,
    createdAt: p.createdAt,
    featured: p.featured,
    isDemo: p.isDemo,
    image: p.images[0],
    shippingEstimate: p.shipping.estimate,
  };
}

/* ------------------------------ Internal ------------------------------ */

/** Internal records – for checkout, admin API and supplier sync ONLY. */
export const getInternalProducts = cache(async () => getSource().listProducts());

export async function getInternalProductById(id: string) {
  return (await getInternalProducts()).find((p) => p.id === id);
}

export async function getInternalProductBySlug(slug: string) {
  return (await getInternalProducts()).find((p) => p.slug === slug);
}

/* ------------------------------- Public ------------------------------- */

export const getAllProducts = cache(async (): Promise<PublicProduct[]> => {
  const products = await getInternalProducts();
  return products.map(toPublicProduct);
});

export const getAllCards = cache(async (): Promise<ProductCardData[]> => {
  return (await getAllProducts()).map(toCardData);
});

export async function getProductBySlug(slug: string) {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getCardsByIds(ids: string[]) {
  const all = await getAllCards();
  return ids.map((id) => all.find((p) => p.id === id)).filter((p): p is ProductCardData => Boolean(p));
}

export async function getCardsInCategory(category?: string, subcategory?: string) {
  return (await getAllCards()).filter((p) => matchesCategory(p, category, subcategory));
}

/** Named merchandising collections used on the homepage. */
export async function getCollection(
  name: "popular" | "under-25" | "beginner" | "indoor" | "food" | "new",
  limit = 8,
) {
  const all = await getAllCards();
  const byPop = (a: ProductCardData, b: ProductCardData) => b.popularity - a.popularity;
  const pick = (list: ProductCardData[]) => list.sort(byPop).slice(0, limit);
  switch (name) {
    case "popular":
      return pick([...all]);
    case "under-25":
      return pick(all.filter((p) => p.price < 25));
    case "beginner":
      return pick(all.filter((p) => p.tags.includes("beginner-friendly")));
    case "indoor":
      return pick(all.filter((p) => p.attributes.indoorOutdoor !== "outdoor" && p.tags.includes("indoor")));
    case "food":
      return pick(all.filter((p) => p.tags.includes("food-growing")));
    case "new":
      return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  }
}

export async function getBrands() {
  return [...new Set((await getAllCards()).map((p) => p.brand))].sort();
}

/* -------------------------------- Kits -------------------------------- */

export const getAllKits = cache(async (): Promise<ResolvedKit[]> => {
  const kits = await getSource().listKits();
  const cards = await getAllCards();
  return kits.map((kit) => {
    const items = kit.items
      .map((item) => ({ ...item, product: cards.find((c) => c.id === item.productId) }))
      .filter((i): i is typeof i & { product: ProductCardData } => Boolean(i.product));
    return {
      ...kit,
      items,
      total: sumPrices(items.map((i) => ({ price: i.product.price, quantity: i.quantity }))),
      purchasableTotal: sumPrices(
        items.filter((i) => i.product.purchasable).map((i) => ({ price: i.product.price, quantity: i.quantity })),
      ),
    };
  });
});

export async function getKitBySlug(slug: string) {
  return (await getAllKits()).find((k) => k.slug === slug);
}
