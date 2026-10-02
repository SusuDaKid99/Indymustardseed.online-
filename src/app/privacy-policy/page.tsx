import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, DraftNotice } from "@/components/marketing/ContentPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Indy Mustard Seed collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" updated="October 2026">
      <DraftNotice />
      <div className="prose-garden">
        <p>This policy explains what information {siteConfig.name} collects when you use {siteConfig.domain}, how we use it and the choices you have.</p>
        <h2>Information we collect</h2>
        <ul>
          <li>Order details: name, email, phone (optional), shipping address and the items you buy.</li>
          <li>Account details, once customer accounts are available.</li>
          <li>Newsletter signups: your email address.</li>
          <li>Messages you send through our contact or supplier forms.</li>
          <li>Basic technical data such as browser type and pages visited.</li>
        </ul>
        <h2>Payment information</h2>
        <p>
          We do not store credit or debit card numbers. Payments are processed by third-party payment providers (such as Stripe or PayPal) who handle card data
          under their own security standards.
        </p>
        <h2>Information stored on your device</h2>
        <p>
          Your cart, saved products, saved gardens and recently viewed items are stored in your browser&apos;s local storage so they persist between visits. You can
          clear them at any time by clearing your browser data.
        </p>
        <h2>How we use information</h2>
        <ul>
          <li>To process and deliver orders, including sharing shipping details with the supplier who ships your item.</li>
          <li>To send order updates and, if you subscribe, our newsletter.</li>
          <li>To answer questions and improve our store.</li>
        </ul>
        <h2>Partner retailers</h2>
        <p>
          When you click through to a partner retailer, their privacy policy applies on their site. See our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
        </p>
        <h2>Your choices</h2>
        <p>
          You can unsubscribe from emails at any time and may request access to or deletion of your personal information by contacting{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </p>
      </div>
    </ContentPage>
  );
}
