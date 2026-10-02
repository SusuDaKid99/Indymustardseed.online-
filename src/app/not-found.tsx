import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="container-page max-w-2xl py-16 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-100 text-leaf-700">
        <Icon name="sprout" className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-4xl font-semibold">This page hasn&apos;t sprouted yet</h1>
      <p className="mt-3 text-lg text-muted">We couldn&apos;t find what you were looking for. Try searching, or start from one of these.</p>
      <form role="search" action="/search" className="mx-auto mt-8 flex max-w-md gap-2">
        <label htmlFor="nf-q" className="sr-only">
          Search
        </label>
        <input id="nf-q" type="search" name="q" placeholder="Search products and guides" className="field flex-1" />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-secondary">
          Shop all
        </Link>
        <Link href="/kits" className="btn-ghost">
          Garden kits
        </Link>
        <Link href="/learn" className="btn-ghost">
          Learn
        </Link>
      </div>
    </div>
  );
}
