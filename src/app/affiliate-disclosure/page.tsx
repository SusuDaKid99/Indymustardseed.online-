import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/marketing/ContentPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How Indy Mustard Seed works with partner retailers and affiliate programs.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <ContentPage title="Affiliate Disclosure" updated="October 2026">
      <div className="prose-garden">
        <p>
          {siteConfig.name} is a curated garden store. Some products we feature are <strong>sold and shipped by other retailers</strong> (&ldquo;partner
          retailers&rdquo;). When you click a link to buy one of these products and make a purchase, we may earn a commission from that retailer through an affiliate
          program. This never costs you extra.
        </p>
        <h2>How to tell which products are partner products</h2>
        <ul>
          <li>
            Partner products show a <strong>&ldquo;Partner product&rdquo;</strong> badge and a <strong>&ldquo;Buy from partner&rdquo;</strong> button instead of
            &ldquo;Add to Cart.&rdquo;
          </li>
          <li>The product page names the retailer you&apos;ll be sent to.</li>
          <li>Partner products never go through our cart or checkout. You complete the purchase on the retailer&apos;s website.</li>
        </ul>
        <h2>What that means for your purchase</h2>
        <p>
          When you buy from a partner retailer, that retailer is the seller. Their prices, availability, shipping, returns, warranty and privacy policies apply. Prices
          shown on our site are for reference and can change on the retailer&apos;s site. For questions about a partner order, contact that retailer directly.
        </p>
        <h2>Our recommendations</h2>
        <p>
          Commissions don&apos;t determine what we recommend. We include products we believe are useful for home growers, and we feature both products we sell directly and
          partner products. We don&apos;t accept payment for positive reviews.
        </p>
        <p>
          Questions? <Link href="/contact">Contact us</Link>.
        </p>
      </div>
    </ContentPage>
  );
}
