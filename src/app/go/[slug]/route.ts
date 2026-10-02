import { NextResponse } from "next/server";
import { getInternalProductBySlug } from "@/server/catalog/repository";

/**
 * Affiliate redirect: /go/<product-slug>
 *
 * Partner URLs are kept server-side so they can be changed, rotated or tagged
 * centrally without touching the UI.
 * TODO(analytics): record the outbound click (product, partner, referrer) before redirecting.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getInternalProductBySlug(slug);
  const url = product?.fulfillmentType === "affiliate" ? product.affiliateUrl : undefined;

  if (!url || !/^https:\/\//i.test(url)) {
    return new NextResponse("Partner link not found.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: url,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}
