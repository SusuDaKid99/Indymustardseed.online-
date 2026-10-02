import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";
import { CartButton } from "../cart/CartButton";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

function SearchForm({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/search" method="get" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search products, guides and kits
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search products & guides"
        className="h-11 w-full rounded-full border border-earth-200 bg-cream-50 pl-11 pr-4 text-base placeholder:text-muted/80 focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-300"
        autoComplete="off"
        enterKeyHint="search"
      />
      <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}

/**
 * Site header: Logo | Shop | Plants | Seeds | Garden | Indoor Growing | Composting | Kits | Learn | About | Search | Account | Cart
 * Server component – only the menu, mobile drawer and cart badge hydrate.
 */
export function Header() {
  return (
    <header className="relative z-40 border-b border-cream-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 lg:sticky lg:top-0">
      <div className="bg-forest-900 text-cream-100">
        <p className="container-page flex min-h-9 items-center justify-center gap-2 py-1.5 text-center text-xs sm:text-sm">
          <Icon name="truck" className="hidden h-4 w-4 sm:block" />
          Free standard shipping on eligible orders over {formatPrice(siteConfig.freeShippingThreshold)}
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline">Rooted in Indianapolis</span>
        </p>
      </div>

      <div className="container-page relative">
        <div className="flex h-16 items-center gap-2 lg:h-[4.5rem] lg:gap-4">
          <MobileNav />
          <Logo />

          <nav aria-label="Main" className="ml-2 hidden items-center xl:flex 2xl:ml-4">
            <MegaMenu />
            <ul className="flex items-center">
              {mainNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-11 items-center whitespace-nowrap rounded-full px-2 text-sm font-semibold text-forest-900 hover:bg-leaf-50 2xl:px-3">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SearchForm id="header-search" className="mr-1 hidden w-60 md:block xl:w-44 2xl:w-72" />
            <Link href="/account" className="grid h-11 w-11 place-items-center rounded-full text-forest-900 hover:bg-leaf-50" aria-label="Account">
              <Icon name="user" className="h-6 w-6" />
            </Link>
            <CartButton />
          </div>
        </div>
        <SearchForm id="mobile-search" className="pb-3 md:hidden" />
      </div>
    </header>
  );
}
