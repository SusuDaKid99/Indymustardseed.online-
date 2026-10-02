import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Shown only in demo mode so nobody mistakes seed data for real listings. */
export function DemoBanner() {
  if (!siteConfig.demoMode) return null;
  return (
    <div className="bg-earth-900 px-4 py-2 text-center text-xs text-cream-100 sm:text-sm">
      <strong className="font-semibold text-mustard-400">Development preview:</strong> products, prices, brands and ratings shown are demo data, not real listings.{" "}
      <Link href="/about#demo-data" className="underline underline-offset-2 hover:text-white">
        Learn more
      </Link>
    </div>
  );
}
