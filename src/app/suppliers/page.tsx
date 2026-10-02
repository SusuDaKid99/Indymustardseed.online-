import type { Metadata } from "next";
import { SupplierForm } from "@/components/forms/SupplierForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Become a Supplier – Grow With Us",
  description: "Seed companies, nurseries, garden-product makers and local Indiana businesses: partner with Indy Mustard Seed via dropshipping, wholesale or affiliate programs.",
  alternates: { canonical: "/suppliers" },
};

const partners = [
  "Seed companies",
  "Nurseries",
  "Garden-product manufacturers",
  "Tool manufacturers",
  "Compost companies",
  "Sustainable-product companies",
  "Small growers",
  "Local Indiana businesses",
];

const models = [
  { title: "Dropshipping", text: "We sell, you ship. We send orders to you via API, feed or email and share tracking with customers." },
  { title: "Wholesale", text: "We buy inventory for our Indianapolis shelf and ship it ourselves." },
  { title: "Affiliate", text: "We feature your products and send customers to your store with tracked links." },
];

export default function SuppliersPage() {
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Suppliers" }]} />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow mb-2">Suppliers & partners</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Grow With Us</h1>
          <p className="mt-4 text-lg text-muted">
            Indy Mustard Seed is building a curated online garden center for home growers. We&apos;re looking for partners who make genuinely useful products and want to
            reach people who are just getting started—and those who never stopped.
          </p>
          <h2 className="mt-10 text-2xl font-semibold">We&apos;re interested in working with</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {partners.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-leaf-700" /> {p}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl font-semibold">Ways to partner</h2>
          <ul className="mt-4 space-y-3">
            {models.map((m) => (
              <li key={m.title} className="rounded-2xl bg-cream-100 p-4">
                <p className="font-semibold text-forest-900">{m.title}</p>
                <p className="text-sm text-muted">{m.text}</p>
              </li>
            ))}
          </ul>
          <a href="#apply" className="btn-mustard mt-8">
            BECOME A SUPPLIER
          </a>
        </div>

        <section id="apply" aria-labelledby="apply-title" className="card scroll-mt-28 p-6 sm:p-8">
          <h2 id="apply-title" className="text-2xl font-semibold">
            Supplier application
          </h2>
          <p className="mb-6 mt-1 text-sm text-muted">Tell us about your company. We review every application personally.</p>
          <SupplierForm />
        </section>
      </div>
    </div>
  );
}
