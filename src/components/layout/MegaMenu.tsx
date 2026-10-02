"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { megaMenu, megaMenuExtras } from "@/config/navigation";
import { Icon } from "../ui/Icon";

/** Desktop "Shop" mega menu. Opens on click/Enter, closes on Esc, outside click or navigation. */
export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes (state derived during render – no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="static">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors ${open ? "bg-forest-800 text-white" : "text-forest-900 hover:bg-leaf-50"}`}
      >
        Shop
        <Icon name="chevronDown" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className="absolute inset-x-0 top-full z-40 border-t border-cream-200 bg-white shadow-[var(--shadow-lift)]"
      >
        <div className="container-page grid grid-cols-[repeat(5,minmax(0,1fr))_14rem] gap-8 py-8">
          {megaMenu.map((group) => (
            <div key={group.href}>
              <Link href={group.href} className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-forest-900 hover:text-leaf-700">
                <span aria-hidden="true">{group.emoji}</span>
                {group.label}
              </Link>
              <ul className="space-y-1.5">
                {group.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="text-sm text-muted hover:text-forest-800 hover:underline">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-2xl bg-cream-100 p-5">
            <p className="eyebrow mb-3">Get started</p>
            <ul className="space-y-2.5">
              {megaMenuExtras.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center justify-between gap-2 text-sm font-semibold text-forest-900 hover:text-leaf-700">
                    {l.label}
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-primary btn-sm mt-5 w-full">
              Shop everything
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
