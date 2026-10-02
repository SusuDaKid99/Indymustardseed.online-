"use client";

import { useEffect } from "react";
import { cartActions } from "@/lib/cart/cart-store";

/** Empties the local cart once an order has been created. */
export function ClearCartOnMount() {
  useEffect(() => {
    cartActions.clear();
  }, []);
  return null;
}
