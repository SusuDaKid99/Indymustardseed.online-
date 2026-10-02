"use client";

import { useCart } from "@/lib/cart/cart-store";
import { useCartUI } from "@/lib/cart/cart-ui";
import { useHydrated } from "@/lib/client/local-store";
import { Icon } from "../ui/Icon";

export function CartButton() {
  const { count } = useCart();
  const { openCart } = useCartUI();
  const hydrated = useHydrated();
  const shown = hydrated ? count : 0;
  return (
    <button
      type="button"
      onClick={() => openCart()}
      className="relative grid h-11 w-11 place-items-center rounded-full text-forest-900 hover:bg-leaf-50"
      aria-label={`Open cart, ${shown} ${shown === 1 ? "item" : "items"}`}
    >
      <Icon name="bag" className="h-6 w-6" />
      {shown > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-mustard-400 px-1 text-xs font-bold text-forest-950">
          {shown > 99 ? "99+" : shown}
        </span>
      )}
    </button>
  );
}
