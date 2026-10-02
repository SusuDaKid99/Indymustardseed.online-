import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, DraftNotice } from "@/components/marketing/ContentPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Indy Mustard Seed online store.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms" updated="October 2026">
      <DraftNotice />
      <div className="prose-garden">
        <p>By using {siteConfig.domain} you agree to these terms.</p>
        <h2>Products and pricing</h2>
        <p>
          We work to describe products and prices accurately. Products may be shipped by {siteConfig.name} or directly by our suppliers. If an item is unavailable or
          a price is listed in error, we&apos;ll contact you before charging or cancel the affected item.
        </p>
        <h2>Partner products</h2>
        <p>
          Products marked &ldquo;Partner product&rdquo; are sold by other retailers. Purchases of those items are agreements between you and that retailer. See our{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
        </p>
        <h2>Live plants and seeds</h2>
        <p>
          Live plants are shipped during appropriate seasons and may be restricted in some states. Growing results depend on conditions outside our control, such as
          weather, soil and care.
        </p>
        <h2>Returns and refunds</h2>
        <p>
          See our <Link href="/returns">returns</Link> and <Link href="/refund-policy">refund policy</Link>.
        </p>
        <h2>Content</h2>
        <p>Growing guides are general information. Always follow product labels and local regulations.</p>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        </p>
      </div>
    </ContentPage>
  );
}
