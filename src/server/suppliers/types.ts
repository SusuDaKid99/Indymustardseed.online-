import "server-only";

/**
 * Supplier records are PRIVATE business data (terms, contacts, feed credentials).
 * They are only ever read on the server and never serialized to the client.
 */

export type SupplierChannel = "affiliate" | "dropship" | "wholesale";

export type SupplierFeedConfig =
  | { kind: "manual" }
  | { kind: "csv"; url: string }
  | { kind: "api"; baseUrl: string }
  | { kind: "affiliate-network"; network: string };

export interface Supplier {
  id: string;
  name: string;
  channels: SupplierChannel[];
  feed: SupplierFeedConfig;
  contactEmail?: string;
  /** Private terms / notes. Admin only. */
  notes?: string;
  minimumOrder?: number;
  isDemo?: boolean;
}

/**
 * A normalized product row as delivered by any supplier feed. Adapters convert
 * supplier-specific formats (CSV columns, JSON APIs, affiliate network feeds)
 * into this shape so the importer can upsert into the product store.
 */
export interface SupplierFeedItem {
  supplierSku: string;
  name: string;
  description?: string;
  brand?: string;
  cost: number;
  msrp?: number;
  quantityAvailable?: number;
  imageUrls: string[];
  productUrl?: string;
  affiliateUrl?: string;
  /** Raw attributes for mapping (country of origin, certifications, dimensions…). */
  attributes: Record<string, string>;
}

export interface SupplierFeedAdapter {
  supplierId: string;
  /** Pull the full catalog (or a page of it) from the supplier. */
  fetchCatalog(): Promise<SupplierFeedItem[]>;
  /** Pull inventory levels only – run frequently to keep availability accurate. */
  fetchInventory(skus: string[]): Promise<Record<string, number>>;
  /** Dropship only: transmit an order to the supplier for fulfillment. */
  submitOrder?(order: SupplierOrderRequest): Promise<{ supplierOrderId: string }>;
}

export interface SupplierOrderRequest {
  orderId: string;
  lines: { supplierSku: string; quantity: number }[];
  shipTo: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}
