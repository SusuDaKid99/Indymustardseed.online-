/**
 * Catalog domain types.
 *
 * There are two shapes of product:
 *  - `Product`        → the full internal record (admin / server only). Contains supplier
 *                       cost, supplier SKU, private notes, affiliate destinations, etc.
 *  - `PublicProduct`  → the customer-safe projection sent to the browser.
 *
 * Only server code (src/server/**) may touch `Product`. Everything rendered in the UI
 * receives a `PublicProduct` produced by `toPublicProduct()` in the repository.
 */

/** How an order for this product is fulfilled. Maps to the business growth stages. */
export type FulfillmentType =
  | "affiliate" // Stage 1 – customer buys from partner site via tracked link
  | "dropship" // Stage 2 – we sell, supplier ships
  | "wholesale" // Stage 3 – we buy inventory and ship ourselves
  | "house-brand"; // Stage 4 – Indy Mustard Seed branded products

export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder" | "external";

export type IndoorOutdoor = "indoor" | "outdoor" | "both";
export type ExperienceLevel = "beginner" | "intermediate" | "experienced";
export type PlantType =
  | "vegetable"
  | "herb"
  | "flower"
  | "fruit"
  | "houseplant"
  | "succulent"
  | "pollinator"
  | "microgreen";
export type GrowingSpace = "balcony" | "patio" | "backyard" | "raised-bed" | "indoor" | "windowsill";
export type SunRequirement = "full-sun" | "part-sun" | "shade" | "low-light" | "grow-light";

/** Customer-facing merchandising tags. */
export type ProductTag =
  | "beginner-friendly"
  | "indoor"
  | "outdoor"
  | "food-growing"
  | "pollinator-friendly"
  | "small-space"
  | "kid-friendly";

/**
 * Claims that MUST be confirmed by supplier documentation before display
 * (e.g. country of origin, certifications). Never set these from marketing copy.
 */
export type VerifiedClaim = "made-in-usa" | "usda-organic" | "omri-listed" | "non-gmo-project";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** True for development placeholder artwork. */
  placeholder?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  /**
   * "demo" ratings are development seed data. They are only rendered when
   * `siteConfig.demoMode` is on (never in production by default), always carry a
   * visible "Demo" label, and are never emitted in structured data.
   */
  source: "demo" | "verified";
}

export interface ShippingInfo {
  /** Customer-facing estimate, e.g. "Ships in 2–4 business days". */
  estimate: string;
  /** Business days, used for delivery date calculations. */
  minDays: number;
  maxDays: number;
  freeShippingEligible: boolean;
  /** Internal: where the parcel originates (supplier warehouse, our shelf, partner). */
  source: "supplier" | "indy-warehouse" | "partner";
  /** Live plants and seeds can have seasonal or regional restrictions. */
  restrictions?: string;
  weightLbs?: number;
}

export interface CategoryPlacement {
  category: string;
  subcategory?: string;
}

/** Full internal product record (server / admin only). */
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  category: string;
  subcategory: string;
  /** Secondary placements, e.g. a grow light listed under Seeds and Indoor Growing. */
  alsoIn?: CategoryPlacement[];
  brand: string;

  // --- Internal supplier & pricing data (never sent to the browser) ---
  supplierId: string;
  supplierSku: string;
  supplierUrl?: string;
  supplierCost: number;
  internalNotes?: string;

  retailPrice: number;
  /** Only set when a real, supplier-approved promotion exists. */
  salePrice?: number;

  fulfillmentType: FulfillmentType;
  /** Required for affiliate products. Resolved server-side via /go/[slug]. */
  affiliateUrl?: string;
  /** Display name of the retailer the customer will be sent to. */
  affiliatePartnerName?: string;

  inventoryStatus: InventoryStatus;
  /** Exact on-hand count (internal). Customers only see the status. */
  inventoryQuantity?: number;
  maxPerOrder?: number;

  shipping: ShippingInfo;
  tags: ProductTag[];
  verifiedClaims: VerifiedClaim[];
  attributes: {
    indoorOutdoor: IndoorOutdoor;
    experience: ExperienceLevel;
    plantTypes: PlantType[];
    growingSpaces: GrowingSpace[];
    sun: SunRequirement[];
  };
  specifications: ProductSpec[];
  whatsIncluded: string[];
  instructions?: string[];
  faqs: ProductFaq[];
  relatedProductIds: string[];
  frequentlyBoughtWithIds: string[];
  reviews?: ReviewSummary;

  seoTitle?: string;
  seoDescription?: string;

  /** Merchandising */
  featured?: boolean;
  popularity: number;
  createdAt: string;

  /** Marks development seed data so it can be purged before launch. */
  isDemo?: boolean;
}

/** Customer-safe projection. Keep this list explicit – never spread a `Product`. */
export interface PublicProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  category: string;
  subcategory: string;
  alsoIn: CategoryPlacement[];
  brand: string;
  price: number;
  compareAtPrice?: number;
  onSale: boolean;
  fulfillmentType: FulfillmentType;
  isAffiliate: boolean;
  affiliatePartnerName?: string;
  availability: InventoryStatus;
  purchasable: boolean;
  maxPerOrder: number;
  shipping: Pick<ShippingInfo, "estimate" | "minDays" | "maxDays" | "freeShippingEligible" | "restrictions">;
  tags: ProductTag[];
  verifiedClaims: VerifiedClaim[];
  attributes: Product["attributes"];
  specifications: ProductSpec[];
  whatsIncluded: string[];
  instructions: string[];
  faqs: ProductFaq[];
  relatedProductIds: string[];
  frequentlyBoughtWithIds: string[];
  reviews?: ReviewSummary;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  popularity: number;
  createdAt: string;
  isDemo: boolean;
}

/** Lightweight card data for grids & rails (smaller payload than PublicProduct). */
export type ProductCardData = Pick<
  PublicProduct,
  | "id"
  | "slug"
  | "name"
  | "brand"
  | "shortDescription"
  | "price"
  | "compareAtPrice"
  | "onSale"
  | "isAffiliate"
  | "affiliatePartnerName"
  | "availability"
  | "purchasable"
  | "maxPerOrder"
  | "reviews"
  | "tags"
  | "verifiedClaims"
  | "category"
  | "subcategory"
  | "alsoIn"
  | "attributes"
  | "fulfillmentType"
  | "popularity"
  | "createdAt"
  | "featured"
  | "isDemo"
> & { image: ProductImage; shippingEstimate: string };

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
  image: { src: string; alt: string };
  subcategories: Subcategory[];
}

export interface KitItem {
  productId: string;
  quantity: number;
  /** Why this item is in the kit – shown to customers. */
  note?: string;
}

export interface GardenKit {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  image: ProductImage;
  items: KitItem[];
  experience: ExperienceLevel;
  spaces: GrowingSpace[];
  goals: PlantType[];
  steps: string[];
  isDemo?: boolean;
}

/** A kit with its products resolved to customer-safe card data. */
export interface ResolvedKit extends Omit<GardenKit, "items"> {
  items: (KitItem & { product: ProductCardData })[];
  total: number;
  purchasableTotal: number;
}
