import Link from "next/link";

/** Logo: a mustard seed sending up its first two leaves. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="20" fill="#1b3f29" />
      <path d="M20 29V18" stroke="#e7f2dd" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 19c0-5-3.5-8.5-9-8.5 0 5 3.8 8.5 9 8.5Z" fill="#67a843" />
      <path d="M20 21.5c0-4.2 3-7.5 8-7.5 0 4.4-3.2 7.5-8 7.5Z" fill="#a9d18c" />
      <ellipse cx="20" cy="30.5" rx="4.6" ry="3.4" fill="#e7bb3e" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 shrink items-center gap-2 rounded-lg sm:gap-2.5" aria-label="Indy Mustard Seed – home">
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`whitespace-nowrap font-display text-[1.05rem] font-semibold tracking-tight sm:text-xl ${inverted ? "text-white" : "text-forest-900"}`}>
          Indy Mustard Seed
        </span>
        <span className={`mt-0.5 hidden whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:block ${inverted ? "text-leaf-200" : "text-leaf-700"}`}>
          Start small. Grow something.
        </span>
      </span>
    </Link>
  );
}
