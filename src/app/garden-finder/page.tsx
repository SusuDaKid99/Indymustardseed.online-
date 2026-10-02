import type { Metadata } from "next";
import { GardenFinder } from "@/components/tools/GardenFinder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllKits } from "@/server/catalog/repository";

export const metadata: Metadata = {
  title: "What Should I Grow? – Garden Finder",
  description: "Answer seven quick questions about your space, sunlight, goals and budget to get personalized garden recommendations.",
  alternates: { canonical: "/garden-finder" },
};

export default async function GardenFinderPage() {
  const kits = await getAllKits();
  return (
    <div className="container-page max-w-4xl">
      <Breadcrumbs items={[{ label: "Garden Finder" }]} />
      <header className="mb-8">
        <p className="eyebrow mb-2">Garden Finder</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">What Should I Grow?</h1>
        <p className="mt-3 text-lg text-muted">Seven quick questions. No sign-up needed. We&apos;ll point you to the right supplies and kits.</p>
      </header>
      <GardenFinder kits={kits} />
    </div>
  );
}
