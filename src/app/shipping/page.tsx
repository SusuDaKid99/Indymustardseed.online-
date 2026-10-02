import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/marketing/ContentPage";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";
import { shippingRates } from "@/lib/checkout/shipping";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Shipping rates, delivery times and live-plant shipping from Indy Mustard Seed.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <ContentPage title="Shipping">
      <div className="prose-garden">
        <p>
          We ship to addresses in the United States. Many products ship directly from the supplier who makes or stocks them, so items in one order may arrive in
          separate packages.
        </p>
        <h2>Rates</h2>
        <ul>
          {Object.values(shippingRates).map((r) => (
            <li key={r.label}>
              <strong>{r.label}</strong>: {formatPrice(r.cents / 100)} — {r.description}.
            </li>
          ))}
          <li>
            <strong>Free standard shipping</strong> on orders of {formatPrice(siteConfig.freeShippingThreshold)} or more when every item is eligible.
          </li>
        </ul>
        <h2>Processing times</h2>
        <p>Each product page shows its own estimate (for example, &ldquo;Ships in 1–3 business days&rdquo;). Your delivery window appears at checkout.</p>
        <h2>Live plants</h2>
        <p>
          Plants ship when weather allows them to travel safely. Some plants can&apos;t be shipped to certain states because of agricultural regulations; we&apos;ll note
          any restrictions on the product page.
        </p>
        <h2>Partner products</h2>
        <p>
          Shipping for partner products is handled by the partner retailer. See <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
        </p>
      </div>
    </ContentPage>
  );
}
