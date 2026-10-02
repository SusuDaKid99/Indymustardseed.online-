import "server-only";
import type { SupplierFeedAdapter, SupplierFeedItem } from "../types";

/**
 * Example adapter for suppliers that publish a CSV product feed.
 *
 * TODO(supplier-feed): map the real supplier's column names below, store any
 * credentials in environment variables (never in source), and run
 * `syncSupplier()` on a schedule (cron / queue worker).
 */
export function createCsvFeedAdapter(options: {
  supplierId: string;
  feedUrl: string;
  /** Map supplier columns → normalized fields. */
  columns: { sku: string; name: string; cost: string; quantity?: string; image?: string; description?: string; brand?: string };
  authHeader?: string;
}): SupplierFeedAdapter {
  async function load(): Promise<Record<string, string>[]> {
    const res = await fetch(options.feedUrl, {
      headers: options.authHeader ? { Authorization: options.authHeader } : undefined,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Feed ${options.supplierId} responded ${res.status}`);
    return parseCsv(await res.text());
  }

  return {
    supplierId: options.supplierId,
    async fetchCatalog() {
      const rows = await load();
      const c = options.columns;
      return rows.map<SupplierFeedItem>((r) => ({
        supplierSku: r[c.sku],
        name: r[c.name],
        description: c.description ? r[c.description] : undefined,
        brand: c.brand ? r[c.brand] : undefined,
        cost: Number(r[c.cost]),
        quantityAvailable: c.quantity ? Number(r[c.quantity]) : undefined,
        imageUrls: c.image && r[c.image] ? [r[c.image]] : [],
        attributes: r,
      }));
    },
    async fetchInventory(skus) {
      const rows = await load();
      const c = options.columns;
      const out: Record<string, number> = {};
      for (const r of rows) if (skus.includes(r[c.sku]) && c.quantity) out[r[c.sku]] = Number(r[c.quantity]);
      return out;
    },
  };
}

/** Minimal RFC-4180-ish CSV parser (quoted fields, escaped quotes). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows.filter((r) => r.some((v) => v.trim() !== ""));
  if (!header) return [];
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}
