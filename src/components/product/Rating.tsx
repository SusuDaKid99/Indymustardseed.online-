import { siteConfig } from "@/config/site";
import type { ReviewSummary } from "@/lib/catalog/types";

const STAR_PATH = "m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3Z";

/** Five stars in a single SVG (keeps product grids light). */
function StarRow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden="true" focusable="false">
      {[0, 24, 48, 72, 96].map((x) => (
        <path key={x} d={STAR_PATH} transform={`translate(${x} 0)`} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * Star rating. Demo (seed) ratings only render when demo mode is on and are
 * always labelled "Demo" so they can't be mistaken for real customer reviews.
 */
export function Rating({ reviews, size = "sm" }: { reviews?: ReviewSummary; size?: "sm" | "md" }) {
  if (!reviews || reviews.count === 0) return null;
  if (reviews.source === "demo" && !siteConfig.demoMode) return null;

  const pct = Math.max(0, Math.min(100, (reviews.average / 5) * 100));
  const row = size === "md" ? "h-5 w-[6.25rem]" : "h-4 w-20";
  const label = `${reviews.source === "demo" ? "Demo rating: " : "Rated "}${reviews.average.toFixed(1)} out of 5 from ${reviews.count} ${reviews.source === "demo" ? "placeholder" : ""} reviews`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <span className="relative inline-flex" role="img" aria-label={label}>
        <StarRow className={`${row} text-earth-200`} />
        <span className="absolute inset-y-0 left-0 overflow-hidden text-mustard-500" style={{ width: `${pct}%` }}>
          <StarRow className={`${row} max-w-none`} />
        </span>
      </span>
      <span className="text-muted" aria-hidden="true">
        {reviews.average.toFixed(1)} ({reviews.count})
      </span>
      {reviews.source === "demo" && (
        <span className="rounded bg-mustard-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-earth-800" aria-hidden="true">
          Demo
        </span>
      )}
    </div>
  );
}
