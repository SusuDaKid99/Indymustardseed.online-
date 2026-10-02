import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  if (siteConfig.demoMode) {
    // Demo catalog: keep search engines out until real products are loaded.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/cart", "/account", "/go/", "/search"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
