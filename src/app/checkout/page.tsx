import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPaymentProviders } from "@/server/checkout/payments";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
// Payment availability depends on runtime environment variables.
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const isDev = process.env.NODE_ENV !== "production";
  // Only pass non-sensitive status to the client; setup hints are shown in development only.
  const payments = getPaymentProviders().map((p) => ({ id: p.id, label: p.label, enabled: p.enabled, setupHint: isDev ? p.setupHint : undefined }));
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mb-8 text-4xl font-semibold">Checkout</h1>
      <CheckoutForm payments={payments} showSetupHints={isDev} />
    </div>
  );
}
