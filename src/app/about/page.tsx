import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentPage } from "@/components/marketing/ContentPage";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Indy Mustard Seed",
  description: "Indy Mustard Seed is an Indianapolis-rooted garden store helping ordinary people grow food, start gardens and become more self-sufficient.",
  alternates: { canonical: "/about" },
};

const stages = [
  { n: 1, title: "Partner products", text: "We recommend great products from trusted retailers and clearly label them." },
  { n: 2, title: "Shipped from suppliers", text: "Curated products you buy from us, shipped directly by the supplier." },
  { n: 3, title: "Our own inventory", text: "Popular items stocked and shipped by our Indianapolis team." },
  { n: 4, title: "Indy Mustard Seed products", text: "Our own seeds, kits and tools—designed from what we learn." },
  { n: 5, title: "A grower marketplace", text: "A home for small growers and sustainable makers to reach gardeners." },
];

export default function AboutPage() {
  return (
    <ContentPage title="About Indy Mustard Seed" intro={`${siteConfig.tagline} We help ordinary people grow food, start gardens and make the most of whatever space they have.`} wide>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="prose-garden">
          <p>
            The mustard seed is one of the smallest seeds there is—and it grows into something remarkable. That&apos;s the idea behind Indy Mustard Seed: you don&apos;t
            need acres, expensive equipment or a lifetime of experience. You need a place to start.
          </p>
          <p>
            Indy Mustard Seed also designs and installs gardens around Indianapolis. This online store brings that same practical approach nationwide: a curated
            selection of seeds, plants, tools and supplies, plus guides that help you actually use them.
          </p>
          <p>
            We don&apos;t try to stock everything. We look for products that work for home growers—balcony container gardeners, first-time raised-bed builders and
            seasoned seed-starters alike.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src="/images/photos/vegetable-garden.jpg" alt="Harvesting leafy greens in a home garden" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>

      <section aria-labelledby="how-we-sell" className="mt-16">
        <h2 id="how-we-sell" className="text-3xl font-semibold">
          How we sell
        </h2>
        <p className="mt-2 max-w-3xl text-muted">
          Indy Mustard Seed is a curated garden marketplace. Some products are shipped to you directly by our suppliers; others are sold by partner retailers, and
          we label those clearly with a &ldquo;Partner product&rdquo; badge. Over time we&apos;ll replace the best of them with our own.
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {stages.map((s) => (
            <li key={s.n} className="card p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-800 font-bold text-white">{s.n}</span>
              <p className="mt-3 font-semibold text-forest-900">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="family" className="mt-16 grid gap-4 md:grid-cols-3">
        <h2 id="family" className="sr-only">
          The Indy Mustard Seed family of websites
        </h2>
        {Object.values(siteConfig.ecosystem).map((site) => (
          <a key={site.url} href={site.url} className="rounded-2xl bg-cream-100 p-6 hover:bg-cream-200">
            <p className="font-display text-xl font-semibold text-forest-900">{site.label}</p>
            <p className="mt-1 text-muted">{site.description}</p>
          </a>
        ))}
      </section>

      {siteConfig.demoMode && (
        <section id="demo-data" aria-labelledby="demo-title" className="mt-16 rounded-2xl border-2 border-dashed border-earth-200 p-6">
          <h2 id="demo-title" className="flex items-center gap-2 text-2xl font-semibold">
            <Icon name="info" className="h-6 w-6" /> About the demo data
          </h2>
          <p className="mt-2 text-muted">
            This development version is populated with fictional products, brands, prices and &ldquo;Demo&rdquo; ratings so the store can be designed and tested. They are
            not real listings, reviews, suppliers or partnerships, and they will be replaced with verified supplier data before launch.
          </p>
        </section>
      )}

      <div className="mt-16 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn-primary">
          Start shopping
        </Link>
        <Link href="/suppliers" className="btn-secondary">
          Become a supplier
        </Link>
      </div>
    </ContentPage>
  );
}
