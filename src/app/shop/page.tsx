import type { Metadata } from "next";
import { ShopListing } from "@/components/shop/ShopListing";

export const metadata: Metadata = {
  title: "Shop Garden Supplies, Seeds & Plants",
  description: "Shop seeds, plants, raised-bed supplies, indoor growing gear and composting equipment—curated for home growers.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ShopListing searchParams={await searchParams} />;
}
