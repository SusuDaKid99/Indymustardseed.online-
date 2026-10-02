import type {
  ExperienceLevel,
  FulfillmentType,
  GrowingSpace,
  IndoorOutdoor,
  PlantType,
  ProductCardData,
  SunRequirement,
} from "./types";

/** Pure filter + sort logic shared by the shop browser (client) and search (server). */

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "popular";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "popular", label: "Most popular" },
];

export type PriceBucket = "under-25" | "25-50" | "50-100" | "100-plus";

export const priceBuckets: { value: PriceBucket; label: string; min: number; max: number }[] = [
  { value: "under-25", label: "Under $25", min: 0, max: 25 },
  { value: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { value: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { value: "100-plus", label: "$100+", min: 100, max: Number.POSITIVE_INFINITY },
];

/** Product type filter groups our fulfillment types into what customers care about. */
export type PurchaseType = "store" | "partner";

export interface ProductFilters {
  categories: string[];
  subcategories: string[];
  price: PriceBucket[];
  brands: string[];
  indoorOutdoor: IndoorOutdoor[];
  experience: ExperienceLevel[];
  plantTypes: PlantType[];
  spaces: GrowingSpace[];
  sun: SunRequirement[];
  purchaseType: PurchaseType[];
  inStockOnly: boolean;
}

export const emptyFilters: ProductFilters = {
  categories: [],
  subcategories: [],
  price: [],
  brands: [],
  indoorOutdoor: [],
  experience: [],
  plantTypes: [],
  spaces: [],
  sun: [],
  purchaseType: [],
  inStockOnly: false,
};

export const purchaseTypeLabels: Record<PurchaseType, string> = {
  store: "Buy from Indy Mustard Seed",
  partner: "Buy from partner retailer",
};

export function purchaseTypeOf(fulfillment: FulfillmentType): PurchaseType {
  return fulfillment === "affiliate" ? "partner" : "store";
}

function inCategory(p: ProductCardData, category: string, subcategory?: string) {
  const placements = [{ category: p.category, subcategory: p.subcategory }, ...p.alsoIn];
  return placements.some(
    (pl) => pl.category === category && (!subcategory || pl.subcategory === subcategory),
  );
}

export function matchesCategory(p: ProductCardData, category?: string, subcategory?: string) {
  if (!category) return true;
  return inCategory(p, category, subcategory);
}

const anyOf = <T,>(selected: T[], values: T[]) =>
  selected.length === 0 || selected.some((s) => values.includes(s));

export function applyFilters(products: ProductCardData[], f: ProductFilters) {
  return products.filter((p) => {
    if (f.categories.length && !f.categories.some((c) => inCategory(p, c))) return false;
    if (f.subcategories.length) {
      const subs = [p.subcategory, ...p.alsoIn.map((a) => a.subcategory)];
      if (!f.subcategories.some((s) => subs.includes(s))) return false;
    }
    if (f.price.length) {
      const ok = f.price.some((b) => {
        const bucket = priceBuckets.find((x) => x.value === b);
        return bucket ? p.price >= bucket.min && p.price < bucket.max : true;
      });
      if (!ok) return false;
    }
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.indoorOutdoor.length) {
      const io = p.attributes.indoorOutdoor;
      const ok = f.indoorOutdoor.some((sel) => io === sel || io === "both" || sel === "both");
      if (!ok) return false;
    }
    if (!anyOf(f.experience, [p.attributes.experience])) return false;
    if (!anyOf(f.plantTypes, p.attributes.plantTypes)) return false;
    if (!anyOf(f.spaces, p.attributes.growingSpaces)) return false;
    if (!anyOf(f.sun, p.attributes.sun)) return false;
    if (!anyOf(f.purchaseType, [purchaseTypeOf(p.fulfillmentType)])) return false;
    if (f.inStockOnly && (p.availability === "out_of_stock" || p.availability === "preorder")) return false;
    return true;
  });
}

export function sortProducts(products: ProductCardData[], sort: SortOption) {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "popular":
      return list.sort((a, b) => b.popularity - a.popularity);
    case "featured":
    default:
      return list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity,
      );
  }
}

export function countActiveFilters(f: ProductFilters) {
  return (
    f.categories.length +
    f.subcategories.length +
    f.price.length +
    f.brands.length +
    f.indoorOutdoor.length +
    f.experience.length +
    f.plantTypes.length +
    f.spaces.length +
    f.sun.length +
    f.purchaseType.length +
    (f.inStockOnly ? 1 : 0)
  );
}

/** Serialize filters to URL query params (shareable filtered URLs). */
export function filtersToParams(f: ProductFilters, sort: SortOption) {
  const params = new URLSearchParams();
  const set = (key: string, values: string[]) => values.length && params.set(key, values.join(","));
  set("cat", f.categories);
  set("sub", f.subcategories);
  set("price", f.price);
  set("brand", f.brands);
  set("where", f.indoorOutdoor);
  set("level", f.experience);
  set("plant", f.plantTypes);
  set("space", f.spaces);
  set("sun", f.sun);
  set("buy", f.purchaseType);
  if (f.inStockOnly) params.set("instock", "1");
  if (sort !== "featured") params.set("sort", sort);
  return params;
}

export function paramsToFilters(params: Record<string, string | string[] | undefined>) {
  const get = (key: string) => {
    const v = params[key];
    const s = Array.isArray(v) ? v[0] : v;
    return s ? s.split(",").filter(Boolean) : [];
  };
  const filters: ProductFilters = {
    categories: get("cat"),
    subcategories: get("sub"),
    price: get("price") as PriceBucket[],
    brands: get("brand"),
    indoorOutdoor: get("where") as IndoorOutdoor[],
    experience: get("level") as ExperienceLevel[],
    plantTypes: get("plant") as PlantType[],
    spaces: get("space") as GrowingSpace[],
    sun: get("sun") as SunRequirement[],
    purchaseType: get("buy") as PurchaseType[],
    inStockOnly: get("instock")[0] === "1",
  };
  const sortRaw = get("sort")[0] as SortOption | undefined;
  const sort: SortOption = sortOptions.some((o) => o.value === sortRaw) ? sortRaw! : "featured";
  return { filters, sort };
}
