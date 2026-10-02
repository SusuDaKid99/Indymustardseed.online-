import { NextResponse, type NextRequest } from "next/server";
import { getAllCards, getCardsByIds } from "@/server/catalog/repository";

/**
 * Public product feed (customer-safe card data only – no supplier/cost fields).
 *   GET /api/products            → all products
 *   GET /api/products?ids=a,b,c  → specific products, in the given order
 */
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const products = idsParam
    ? await getCardsByIds(idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50))
    : await getAllCards();
  return NextResponse.json({ products }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
