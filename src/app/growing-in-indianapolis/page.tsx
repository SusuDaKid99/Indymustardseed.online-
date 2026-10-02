import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IndyServicesCTA } from "@/components/marketing/IndyServicesCTA";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Growing in Indianapolis – Local Planting Calendar & Guides",
  description: "Planting dates, seasonal guides and community gardening resources for Indianapolis and Central Indiana gardeners.",
  alternates: { canonical: "/growing-in-indianapolis" },
};

/**
 * Planting calendar content. General guidance for Central Indiana (USDA zone 6);
 * dates shift every year. TODO(content): move to CMS and review each season.
 */
const calendar = [
  { month: "Feb–Mar", indoor: "Start onions, leeks, peppers and eggplant indoors under lights.", outdoor: "Plan beds, order seeds, test soil." },
  { month: "Mar–Apr", indoor: "Start tomatoes, broccoli, cabbage and herbs 6–8 weeks before last frost.", outdoor: "Direct-sow peas, spinach, lettuce and radishes when soil can be worked." },
  { month: "Late Apr–May", indoor: "Harden off transplants for 7–10 days.", outdoor: "After the average last frost (typically mid-to-late April), plant cool crops; wait for warm soil in mid-May for tomatoes and peppers." },
  { month: "Jun–Jul", indoor: "Start fall brassicas indoors in July.", outdoor: "Direct-sow beans, cucumbers and squash. Mulch and water deeply." },
  { month: "Aug–Sep", indoor: "—", outdoor: "Sow fall lettuce, spinach and radishes, prep garlic beds and sow cover crops." },
  { month: "Oct–Nov", indoor: "Bring herbs indoors; start microgreens.", outdoor: "First fall frost is typically mid-to-late October. Plant garlic; add compost and leaves to beds." },
];

const seasons = [
  { title: "Spring", icon: "sprout" as const, text: "Seed starting, soil prep and cool-season crops. Our busiest planting season.", href: "/learn/how-to-start-seeds-indoors" },
  { title: "Summer", icon: "sun" as const, text: "Watering, mulching, trellising and harvest. Watch for heat stress in July.", href: "/learn/how-much-sun-does-a-vegetable-garden-need" },
  { title: "Fall", icon: "leaf" as const, text: "Fall crops, garlic, cover crops and putting beds to rest.", href: "/learn/fall-garden-checklist" },
  { title: "Winter", icon: "calendar" as const, text: "Indoor growing, microgreens, planning and composting.", href: "/learn/growing-microgreens-indoors" },
];

export default function IndianapolisPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-forest-950">
        <Image src="/images/photos/flower-garden.jpg" alt="A garden path lined with flowers" fill priority sizes="100vw" className="-z-10 object-cover opacity-50" />
        <div className="container-page py-6">
          <div className="[&_a]:text-cream-100 [&_li]:text-cream-200 [&_span]:text-cream-100">
            <Breadcrumbs items={[{ label: "Growing in Indianapolis" }]} />
          </div>
          <div className="max-w-2xl py-12 sm:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mustard-400">Local roots · Nationwide shipping</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">Growing in Indianapolis</h1>
            <p className="mt-4 text-lg text-cream-100">
              Indy Mustard Seed started here. Whether you&apos;re in Fountain Square, Broad Ripple or the suburbs, here&apos;s how to make the most of a Central Indiana
              growing season.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-14">
        <section aria-labelledby="calendar">
          <p className="eyebrow mb-2">Local planting calendar</p>
          <h2 id="calendar" className="text-3xl font-semibold">
            When to plant in Central Indiana
          </h2>
          <p className="mt-2 max-w-3xl text-muted">
            General guidance for USDA zone 6. Frost dates vary year to year and across the metro—check the forecast and your local Purdue Extension office before
            planting tender crops.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-200">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">Indianapolis planting calendar</caption>
              <thead className="bg-cream-100 text-forest-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    When
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Indoors
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Outdoors
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {calendar.map((r) => (
                  <tr key={r.month}>
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-forest-900">
                      {r.month}
                    </th>
                    <td className="px-4 py-3">{r.indoor}</td>
                    <td className="px-4 py-3">{r.outdoor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="seasonal">
          <p className="eyebrow mb-2">Seasonal guides</p>
          <h2 id="seasonal" className="text-3xl font-semibold">
            What to do this season
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seasons.map((s) => (
              <li key={s.title}>
                <Link href={s.href} className="card flex h-full flex-col gap-3 p-5 hover:shadow-[var(--shadow-lift)]">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf-100 text-forest-800">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xl font-semibold text-forest-900">{s.title}</span>
                  <span className="text-sm text-muted">{s.text}</span>
                  <span className="mt-auto text-sm font-semibold text-forest-700">Read the guide →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section aria-labelledby="projects" className="rounded-2xl bg-cream-100 p-6">
            <Icon name="pin" className="h-6 w-6 text-earth-700" />
            <h2 id="projects" className="mt-3 text-2xl font-semibold">
              Local garden projects
            </h2>
            <p className="mt-2 text-muted">
              Project stories from around Indianapolis—backyard food gardens, school beds and pollinator plantings—are coming soon.
            </p>
            {/* TODO(content): pull featured projects from indymustardseed.com once a shared CMS/feed exists. */}
          </section>
          <section aria-labelledby="services" className="rounded-2xl bg-leaf-50 p-6">
            <Icon name="sprout" className="h-6 w-6 text-leaf-700" />
            <h2 id="services" className="mt-3 text-2xl font-semibold">
              Indy Mustard Seed services
            </h2>
            <p className="mt-2 text-muted">Garden design, raised-bed builds and installation in the Indianapolis area.</p>
            <a href={siteConfig.ecosystem.services.url} className="mt-4 inline-flex items-center gap-1 font-semibold text-forest-700 underline">
              {siteConfig.ecosystem.services.label} <Icon name="external" className="h-4 w-4" />
            </a>
          </section>
          <section aria-labelledby="community" className="rounded-2xl bg-cream-100 p-6">
            <Icon name="recycle" className="h-6 w-6 text-earth-700" />
            <h2 id="community" className="mt-3 text-2xl font-semibold">
              Community gardening
            </h2>
            <p className="mt-2 text-muted">Find community garden spaces, sponsor a bed or volunteer with neighbors.</p>
            <a href={siteConfig.ecosystem.community.url} className="mt-4 inline-flex items-center gap-1 font-semibold text-forest-700 underline">
              {siteConfig.ecosystem.community.label} <Icon name="external" className="h-4 w-4" />
            </a>
          </section>
        </div>

        <IndyServicesCTA />
        <NewsletterForm source="indianapolis" />
      </div>
    </div>
  );
}
