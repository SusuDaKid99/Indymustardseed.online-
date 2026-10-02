import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, DraftNotice } from "@/components/marketing/ContentPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "When and how Indy Mustard Seed issues refunds.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <ContentPage title="Refund Policy" updated="October 2026">
      <DraftNotice />
      <div className="prose-garden">
        <h2>Items sold by Indy Mustard Seed</h2>
        <p>
          Refunds are issued to the original payment method after a return is received and inspected, or after a damaged or incorrect item has been reported with
          photos. Refunds usually appear within 5–10 business days, depending on your bank.
        </p>
        <h2>Live plants</h2>
        <p>If a live plant arrives damaged or dead, contact us within 7 days of delivery with a photo and we&apos;ll replace it or issue a refund.</p>
        <h2>Shipping costs</h2>
        <p>Original shipping charges are refunded when the return is due to our error or a damaged item.</p>
        <h2>Partner products</h2>
        <p>Products bought from partner retailers are refunded under that retailer&apos;s policy. Please contact the retailer directly.</p>
        <p>
          Start a return on our <Link href="/returns">returns page</Link>.
        </p>
      </div>
    </ContentPage>
  );
}
