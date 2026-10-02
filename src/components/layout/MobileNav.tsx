"use client";

import Link from "next/link";
import { useRef } from "react";
import { mainNav, megaMenu, megaMenuExtras } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Icon } from "../ui/Icon";

/** Mobile navigation drawer (native <dialog> for focus management). */
export function MobileNav() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="grid h-11 w-11 place-items-center rounded-full text-forest-900 hover:bg-leaf-50 xl:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <Icon name="menu" className="h-6 w-6" />
      </button>
      <dialog
        ref={ref}
        aria-label="Site menu"
        className="drawer-left m-0 h-dvh max-h-dvh w-[min(24rem,88vw)] max-w-none bg-white p-0 backdrop:bg-forest-950/50"
        onClick={(e) => {
          // Close on backdrop click or when any link inside is followed.
          if (e.target === ref.current || (e.target as HTMLElement).closest("a")) ref.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
            <span className="font-display text-lg font-semibold text-forest-900">Menu</span>
            <button type="button" onClick={() => ref.current?.close()} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream-100" aria-label="Close menu">
              <Icon name="x" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
            <p className="eyebrow px-3 pb-2 pt-1">Shop by category</p>
            <ul>
              {megaMenu.map((g) => (
                <li key={g.href}>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-3 font-semibold text-forest-900 hover:bg-leaf-50">
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{g.emoji}</span> {g.label}
                      </span>
                      <Icon name="chevronDown" className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mb-2 ml-9 border-l border-cream-200 pl-3">
                      <li>
                        <Link href={g.href} className="flex min-h-11 items-center text-sm font-semibold text-forest-800">
                          All {g.label}
                        </Link>
                      </li>
                      {g.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex min-h-11 items-center text-sm text-muted">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
            <hr className="my-3 border-cream-200" />
            <ul>
              {[...mainNav.filter((l) => !l.href.startsWith("/shop/")), ...megaMenuExtras.slice(1, 3), { label: "Growing in Indianapolis", href: "/growing-in-indianapolis" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-12 items-center rounded-xl px-3 font-semibold text-forest-900 hover:bg-leaf-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-cream-200 p-4 text-sm text-muted">
            <a href={siteConfig.ecosystem.services.url} className="font-semibold text-forest-800 underline">
              Need a garden installed? Visit {siteConfig.ecosystem.services.label}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
