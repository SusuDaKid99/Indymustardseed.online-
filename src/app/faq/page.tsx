import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/ContentPage";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering, shipping, partner products and growing.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "Do I need an account to order?",
    a: "No. Guest checkout is always available. Accounts (coming soon) will let you track orders, save products and save garden plans.",
  },
  {
    q: "What is a “Partner product”?",
    a: "Partner products are sold and shipped by another retailer. You'll buy them on the retailer's website, and their policies apply. We may earn a commission, at no extra cost to you.",
  },
  {
    q: "Why did my order arrive in multiple boxes?",
    a: "Many products ship directly from the supplier who makes or stocks them, so a single order can arrive in separate packages.",
  },
  {
    q: "Do you offer free shipping?",
    a: `Yes—free standard shipping on orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more when every item is eligible.`,
  },
  {
    q: "Can you ship live plants to my state?",
    a: "Most states, yes. Some plants have agricultural restrictions; any limits are listed on the product page.",
  },
  {
    q: "I'm a complete beginner. Where should I start?",
    a: "Try our Garden Finder or Build Your Garden tool, or read “How to Start Your First Vegetable Garden.” A beginner kit is also an easy way to get everything at once.",
  },
  {
    q: "Do you install gardens?",
    a: "Yes, in the Indianapolis area. Visit indymustardseed.com for garden design and installation.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Frequently Asked Questions">
      <div className="divide-y divide-cream-200 rounded-2xl border border-cream-200">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-forest-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <Icon name="plus" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" />
            </summary>
            <p className="pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </ContentPage>
  );
}
