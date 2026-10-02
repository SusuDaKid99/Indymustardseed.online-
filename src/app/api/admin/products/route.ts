import { NextResponse } from "next/server";
import { isAdminRequest } from "@/server/admin/auth";
import { getInternalProducts } from "@/server/catalog/repository";

/**
 * ADMIN product API – returns full internal records (supplier, cost, margin).
 * Protected by ADMIN_API_TOKEN (Bearer). Disabled when the token is unset.
 *
 * This is the integration point for a future admin dashboard / headless CMS:
 *   GET  → list internal products with computed margin
 *   POST → create or update a product (TODO: persist to the database)
 */
const noStore = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  const products = (await getInternalProducts()).map((p) => {
    const price = p.salePrice ?? p.retailPrice;
    const profit = p.supplierCost !== undefined ? Math.round((price - p.supplierCost) * 100) / 100 : null;
    return { ...p, computed: { sellingPrice: price, profit, marginPct: profit !== null && price > 0 ? Math.round((profit / price) * 1000) / 10 : null } };
  });
  return NextResponse.json({ products }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  // TODO(admin): validate the body against the Product schema (e.g. with zod),
  // write it to the database (DATABASE_URL) and revalidate affected paths with
  // `revalidatePath("/products/<slug>")` and `revalidatePath("/shop")`.
  return NextResponse.json({ error: "Product writes are not enabled until a database is connected." }, { status: 501, headers: noStore });
}
