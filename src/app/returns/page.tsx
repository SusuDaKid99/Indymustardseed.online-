import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, DraftNotice } from "@/components/marketing/ContentPage";

export const metadata: Metadata = {
  title: "Returns",
  description: "How to return an item purchased from Indy Mustard Seed.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <ContentPage title="Returns">
      <DraftNotice />
      <div className="prose-garden">
        <p>We want you to love what you grow with. If something isn&apos;t right, here&apos;s how returns work.</p>
        <h2>Tools, supplies and equipment</h2>
        <p>Unused items in original packaging can be returned within 30 days of delivery.</p>
        <h2>Seeds, soil and consumables</h2>
        <p>For safety and quality reasons, opened seeds, soil, fertilizers and other consumables can&apos;t be returned unless they arrived damaged or incorrect.</p>
        <h2>Live plants</h2>
        <p>Report damaged plants within 7 days of delivery with a photo and we&apos;ll make it right.</p>
        <h2>How to start a return</h2>
        <ol>
          <li>
            <Link href="/contact">Contact us</Link> with your order number and the item you&apos;d like to return.
          </li>
          <li>We&apos;ll send return instructions. Some items ship back to the supplier rather than to us.</li>
          <li>
            Once the return is received, we&apos;ll issue your refund per our <Link href="/refund-policy">refund policy</Link>.
          </li>
        </ol>
        <h2>Partner products</h2>
        <p>Returns for items purchased from partner retailers are handled by that retailer.</p>
      </div>
    </ContentPage>
  );
}
