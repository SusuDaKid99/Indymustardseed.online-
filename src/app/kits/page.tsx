import type { Metadata } from "next";
import Link from "next/link";
import { KitCard } from "@/components/kits/KitCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllKits } from "@/server/catalog/repository";

export const metadata: Metadata = {
  title: "Garden Kits & Shopping Guides",
  description: "Curated garden kits for beginners, tomatoes, pollinators, apartments, indoor herbs, microgreens, seed starting and kids.",
  alternates: { canonical: "/kits" },
};

export default async function KitsPage() {
  const kits = await getAllKits();
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Garden Kits" }]} />
      <header className="mb-10 max-w-3xl">
        <p className="eyebrow mb-2">Shopping guides</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Garden Kits</h1>
        <p className="mt-4 text-lg text-muted">
          Each kit is a curated shopping list for a specific goal. Add everything with one click, or remove what you already have. Kits can include items from several
          suppliers—we&apos;ll always tell you who sells what.
        </p>
      </header>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kits.map((k) => (
          <li key={k.id}>
            <KitCard kit={k} />
          </li>
        ))}
      </ul>
      <div className="mt-14 rounded-[2rem] bg-cream-100 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Want a list built just for your space?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">Tell us where you&apos;re growing, what you want to grow and your budget—we&apos;ll build the list.</p>
        <Link href="/build-your-garden" className="btn-primary mt-6">
          Build Your Garden
        </Link>
      </div>
    </div>
  );
}
