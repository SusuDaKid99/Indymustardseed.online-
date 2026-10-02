"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** UI state for the slide-out cart drawer + a polite live-region announcement. */
interface CartUI {
  open: boolean;
  openCart: (announcement?: string) => void;
  closeCart: () => void;
  announcement: string;
}

const CartUIContext = createContext<CartUI | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const openCart = useCallback((msg?: string) => {
    setAnnouncement(msg ?? "");
    setOpen(true);
  }, []);
  const closeCart = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openCart, closeCart, announcement }), [open, openCart, closeCart, announcement]);
  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used inside CartUIProvider");
  return ctx;
}
