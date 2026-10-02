import Image from "next/image";
import Link from "next/link";
import { KitCard } from "@/components/kits/KitCard";
import { ArticleCard } from "@/components/learn/ArticleCard";
import { IndyServicesCTA } from "@/components/marketing/IndyServicesCTA";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { ProductRail } from "@/components/product/ProductGrid";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles } from "@/data/content/articles";
import { getAllKits, getCollection } from "@/server/catalog/repository";

const shopByCategory = [
  { emoji: "🌱", label: "Seed Starting", href: "/shop/seeds", img: "/images/photos/seed-tray.jpg", alt: "Seedlings sprouting in a starter tray" },
  { emoji: "🪴", label: "Plants", href: "/shop/plants", img: "/images/photos/houseplants.jpg", alt: "Leafy houseplants in white pots" },
  { emoji: "🥕", label: "Vegetable Gardening", href: "/shop?plant=vegetable", img: "/images/photos/vegetable-garden.jpg", alt: "Harvesting leafy greens from a garden" },
  { emoji: "🌻", label: "Pollinator Gardens", href: "/shop?plant=pollinator", img: "/images/photos/flower-garden.jpg", alt: "A flower-lined garden path" },
  { emoji: "💡", label: "Indoor Growing", href: "/shop/indoor-growing", img: "/images/photos/seedling-pots.jpg", alt: "Seedlings in small round pots" },
  { emoji: "♻️", label: "Composting", href: "/shop/composting", img: "/images/photos/soil-trowel.jpg", alt: "A trowel in dark compost" },
];

const valueProps = [
  { icon: "leaf" as const, title: "Curated, not crowded", text: "We pick useful products for home growers instead of listing everything." },
  { icon: "sprout" as const, title: "Beginner-friendly", text: "Guides, kits and honest advice to help you start right." },
  { icon: "truck" as const, title: "Ships nationwide", text: "Rooted in Indianapolis, delivering wherever you grow." },
  { icon: "shield" as const, title: "Clear about partners", text: "Some products are sold by partner retailers. We always label them." },
];

export default async function HomePage() {
  const [popular, under25, beginner, indoor, food, kits] = await Promise.all([
    getCollection("popular", 4),
    getCollection("under-25", 4),
    getCollection("beginner", 4),
    getCollection("indoor", 4),
    getCollection("food", 4),
    getAllKits(),
  ]);
  const featuredArticles = articles.slice(0, 3);

  const rails = [
    { id: "popular", eyebrow: "Trending", title: "Popular Right Now", products: popular, href: "/shop?sort=popular" },
    { id: "under-25", eyebrow: "Small budget, big harvest", title: "Start Growing for Under $25", products: under25, href: "/shop?price=under-25" },
    { id: "beginner", eyebrow: "Easy wins", title: "Beginner Favorites", products: beginner, href: "/shop?level=beginner" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-forest-950">
        <Image
          src="/images/photos/hero-raised-beds.jpg"
          alt="Raised garden beds full of leafy vegetables"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/60 to-forest-950/10" />
        <div className="container-page flex min-h-[32rem] flex-col justify-center py-16 sm:min-h-[36rem] lg:min-h-[40rem]">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-mustard-400">Start Small. Grow Something.</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">Grow Something. Anywhere.</h1>
          <p className="mt-5 max-w-xl text-lg text-cream-100 sm:text-xl">
            Plants, seeds, tools and growing supplies selected to help you turn balconies, backyards and empty spaces into something productive.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop/garden" className="btn-mustard px-8">
              SHOP GARDEN
            </Link>
            <Link href="/build-your-garden" className="btn border-2 border-white/80 px-8 text-white hover:bg-white/10">
              START YOUR FIRST GARDEN
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section aria-labelledby="shop-by-category" className="container-page py-12 sm:py-16">
        <SectionHeading id="shop-by-category" eyebrow="Find your starting point" title="Shop by Category" action={{ label: "Shop all", href: "/shop" }} />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {shopByCategory.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-cream-100 sm:aspect-[16/10]">
                <Image src={c.img} alt={c.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 sm:p-5">
                  <span className="font-display text-lg font-semibold text-white sm:text-2xl">
                    <span aria-hidden="true" className="mr-2">
                      {c.emoji}
                    </span>
                    {c.label}
                  </span>
                  <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-forest-900 sm:grid">
                    <Icon name="arrowRight" className="h-5 w-5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* VALUE PROPS */}
      <section aria-label="Why shop with us" className="border-y border-cream-200 bg-cream-50">
        <ul className="container-page grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <li key={v.title} className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf-100 text-forest-800">
                <Icon name={v.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-forest-900">{v.title}</span>
                <span className="block text-sm text-muted">{v.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* PRODUCT RAILS */}
      <div className="container-page space-y-14 py-14 sm:space-y-20">
        {rails.map((r) => (
          <section key={r.id} aria-labelledby={`rail-${r.id}`}>
            <SectionHeading id={`rail-${r.id}`} eyebrow={r.eyebrow} title={r.title} action={{ label: "See all", href: r.href }} />
            <ProductRail products={r.products} label={r.title} />
          </section>
        ))}

        {/* GARDEN FINDER TEASER */}
        <section aria-labelledby="finder-teaser" className="grid overflow-hidden rounded-[2rem] bg-cream-100 md:grid-cols-2">
          <div className="relative min-h-60">
            <Image src="/images/photos/sprout.jpg" alt="A small green sprout emerging from soil" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
            <p className="eyebrow">Garden Finder</p>
            <h2 id="finder-teaser" className="text-3xl font-semibold sm:text-4xl">
              What should I grow?
            </h2>
            <p className="text-muted">
              Answer seven quick questions about your space, sunlight and budget. We&apos;ll suggest what to grow, which supplies you need and a kit to get started.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/garden-finder" className="btn-primary">
                Take the Garden Finder
              </Link>
              <Link href="/build-your-garden" className="btn-secondary">
                Build Your Garden
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="rail-indoor">
          <SectionHeading id="rail-indoor" eyebrow="No yard needed" title="Indoor Growing" action={{ label: "Shop indoor", href: "/shop/indoor-growing" }} />
          <ProductRail products={indoor} label="Indoor Growing" />
        </section>

        {/* KITS */}
        <section aria-labelledby="kits-title">
          <SectionHeading
            id="kits-title"
            eyebrow="Shopping guides"
            title="Garden Kits"
            description="Curated bundles that take the guesswork out of getting started. Add everything at once, or pick and choose."
            action={{ label: "All kits", href: "/kits" }}
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kits.slice(0, 4).map((k) => (
              <li key={k.id}>
                <KitCard kit={k} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rail-food">
          <SectionHeading id="rail-food" eyebrow="From soil to supper" title="Grow Your Own Food" action={{ label: "Shop food growing", href: "/shop?plant=vegetable,herb,fruit" }} />
          <ProductRail products={food} label="Grow Your Own Food" />
        </section>

        {/* LEARN */}
        <section aria-labelledby="learn-title">
          <SectionHeading
            id="learn-title"
            eyebrow="Learn"
            title="Grow with confidence"
            description="Straightforward guides written for real yards, balconies and kitchen windowsills."
            action={{ label: "All guides", href: "/learn" }}
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {featuredArticles.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>

        {/* INDIANAPOLIS */}
        <section aria-labelledby="indy-title" className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Local roots</p>
            <h2 id="indy-title" className="text-3xl font-semibold sm:text-4xl">
              Growing in Indianapolis
            </h2>
            <p className="mt-3 text-muted">
              We ship nationwide, but we grow in Central Indiana. Find planting dates, seasonal guides and community garden projects for Zone 6 gardeners.
            </p>
            <Link href="/growing-in-indianapolis" className="btn-secondary mt-6">
              Explore local growing <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {[
              { icon: "calendar" as const, label: "Planting calendar" },
              { icon: "sun" as const, label: "Seasonal guides" },
              { icon: "pin" as const, label: "Local projects" },
              { icon: "recycle" as const, label: "Community gardening" },
            ].map((x) => (
              <li key={x.label} className="flex items-center gap-3 rounded-2xl bg-leaf-50 p-4 font-semibold text-forest-900 ring-1 ring-leaf-100">
                <Icon name={x.icon} className="h-5 w-5 text-leaf-700" /> {x.label}
              </li>
            ))}
          </ul>
        </section>

        <IndyServicesCTA />
        <NewsletterForm source="home" />
      </div>
    </>
  );
}
