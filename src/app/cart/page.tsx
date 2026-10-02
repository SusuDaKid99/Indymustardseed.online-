import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mb-8 text-4xl font-semibold">Your Cart</h1>
      <CartView />
    </div>
  );
}
