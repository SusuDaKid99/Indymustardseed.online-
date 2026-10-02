import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContentPage } from "@/components/marketing/ContentPage";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about an order, a product or your garden? Get in touch with Indy Mustard Seed.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ContentPage title="Contact" intro="Questions about an order, a product or your garden? We're happy to help." wide>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-cream-100 p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="mail" className="h-5 w-5" /> Email
            </p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-1 block text-forest-700 underline">
              {siteConfig.contactEmail}
            </a>
          </div>
          <div className="rounded-2xl bg-cream-100 p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="package" className="h-5 w-5" /> Order help
            </p>
            <p className="mt-1 text-sm text-muted">
              <Link href="/track-order" className="underline">
                Track an order
              </Link>
              ,{" "}
              <Link href="/shipping" className="underline">
                shipping info
              </Link>{" "}
              and{" "}
              <Link href="/returns" className="underline">
                returns
              </Link>
              .
            </p>
          </div>
          <div className="rounded-2xl bg-leaf-50 p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="sprout" className="h-5 w-5" /> Garden installation
            </p>
            <p className="mt-1 text-sm text-muted">
              For garden design and installation in Indianapolis, visit{" "}
              <a href={siteConfig.ecosystem.services.url} className="underline">
                {siteConfig.ecosystem.services.label}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </ContentPage>
  );
}
