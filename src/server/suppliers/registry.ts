import "server-only";
import type { Product } from "@/lib/catalog/types";
import { seedSuppliers } from "@/data/seed/suppliers";
import type { Supplier, SupplierFeedAdapter, SupplierFeedItem } from "./types";

/**
 * ============================================================================
 *  SUPPLIER REGISTRY & SYNC
 * ============================================================================
 *  1. Register an adapter per supplier (CSV feed, REST API, affiliate network).
 *  2. `syncSupplier()` pulls the feed and produces upserts for the product store.
 *  3. Merchandisers review/enrich new products in the admin dashboard before
 *     they are published (descriptions, tags, kit placement, retail price).
 *
 *  Pricing, margins and supplier terms stay server-side. Only the fields in
 *  `PublicProduct` ever reach customers.
 * ============================================================================
 */

const adapters = new Map<string, SupplierFeedAdapter>();

export function registerSupplierAdapter(adapter: SupplierFeedAdapter) {
  adapters.set(adapter.supplierId, adapter);
}

// Example registration (disabled – the URL is a placeholder):
// registerSupplierAdapter(createCsvFeedAdapter({
//   supplierId: "sup-demo-grow",
//   feedUrl: process.env.DEMO_GROW_FEED_URL!,
//   columns: { sku: "SKU", name: "Title", cost: "Wholesale", quantity: "Qty", image: "Image" },
// }));

export async function getSuppliers(): Promise<Supplier[]> {
  // TODO(database): load from suppliers table.
  return seedSuppliers;
}

export async function getSupplier(id: string) {
  return (await getSuppliers()).find((s) => s.id === id);
}

/** Default pricing rule for newly imported items. Merchandisers can override per product. */
export function suggestRetailPrice(cost: number, msrp?: number) {
  const keystone = Math.ceil(cost * 2.2) - 0.01;
  return msrp ? Math.min(msrp, keystone) : keystone;
}

/** Map a feed row onto the fields we own; returns a partial for upsert. */
export function mapFeedItem(supplierId: string, item: SupplierFeedItem): Partial<Product> {
  return {
    supplierId,
    supplierSku: item.supplierSku,
    supplierCost: item.cost,
    supplierUrl: item.productUrl,
    affiliateUrl: item.affiliateUrl,
    inventoryQuantity: item.quantityAvailable,
    inventoryStatus:
      item.quantityAvailable === undefined
        ? undefined
        : item.quantityAvailable <= 0
          ? "out_of_stock"
          : item.quantityAvailable < 10
            ? "low_stock"
            : "in_stock",
    // Claims like "Made in USA" are only set when the supplier provides
    // explicit documentation – never inferred from product names.
    verifiedClaims: item.attributes["country_of_origin_verified"] === "US" ? ["made-in-usa"] : [],
  };
}

export async function syncSupplier(supplierId: string) {
  const adapter = adapters.get(supplierId);
  if (!adapter) throw new Error(`No adapter registered for ${supplierId}`);
  const items = await adapter.fetchCatalog();
  const upserts = items.map((i) => mapFeedItem(supplierId, i));
  // TODO(database): upsert by (supplierId, supplierSku); new SKUs are created as drafts.
  return { supplierId, received: items.length, upserts };
}
