import { NextResponse, type NextRequest } from "next/server";
import { getAllCards, getAllProducts, getCollection } from "@/server/catalog/repository";

/**
 * Complementary products for the cart ("You may also need") and account recommendations.
 *   GET /api/recommendations?ids=a,b&limit=4
 *
 * Simple rule-based logic: frequently-bought-with, then related products of the
 * given items, excluding those items; store-purchasable products first; falls
 * back to popular beginner essentials.
 * TODO(recommendations): replace with co-purchase data once real orders exist.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const ids = new Set((sp.get("ids") ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30));
  const limit = Math.min(Math.max(Number(sp.get("limit")) || 4, 1), 12);

  const [products, cards] = await Promise.all([getAllProducts(), getAllCards()]);
  const scores = new Map<string, number>();
  for (const p of products) {
    if (!ids.has(p.id)) continue;
    p.frequentlyBoughtWithIds.forEach((id, i) => scores.set(id, (scores.get(id) ?? 0) + 10 - i));
    p.relatedProductIds.forEach((id, i) => scores.set(id, (scores.get(id) ?? 0) + 5 - i * 0.5));
  }

  const ranked = cards
    .filter((c) => scores.has(c.id) && !ids.has(c.id))
    .sort((a, b) => Number(b.purchasable) - Number(a.purchasable) || scores.get(b.id)! - scores.get(a.id)! || b.popularity - a.popularity);

  if (ranked.length < limit) {
    const fallback = await getCollection("beginner", 24);
    for (const c of fallback) {
      if (ranked.length >= limit) break;
      if (!ids.has(c.id) && c.purchasable && !ranked.some((r) => r.id === c.id)) ranked.push(c);
    }
  }

  return NextResponse.json({ products: ranked.slice(0, limit) }, { headers: { "Cache-Control": "public, max-age=60" } });
}
