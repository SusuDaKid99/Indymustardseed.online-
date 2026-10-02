import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/checkout/TrackOrderForm";
import { ContentPage } from "@/components/marketing/ContentPage";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your Indy Mustard Seed order.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <ContentPage title="Track Order" intro="Enter your order number and the email you used at checkout. Partner-product orders are tracked on the retailer's website.">
      <TrackOrderForm />
    </ContentPage>
  );
}
