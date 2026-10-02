import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/catalog/format";
import { Icon } from "../ui/Icon";

/** Progress toward free standard shipping (estimate – server checkout is authoritative). */
export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const goal = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, goal - subtotal);
  const pct = Math.min(100, Math.round((subtotal / goal) * 100));
  return (
    <div className="rounded-2xl bg-leaf-50 p-4 ring-1 ring-leaf-100">
      <p className="flex items-center gap-2 text-sm font-medium text-forest-900">
        <Icon name="truck" className="h-5 w-5 text-leaf-700" />
        {remaining > 0 ? (
          <span>
            You&apos;re <strong>{formatPrice(remaining)}</strong> away from free standard shipping.
          </span>
        ) : (
          <span>Your order qualifies for free standard shipping on eligible items.</span>
        )}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progress to free shipping">
        <div className="h-full rounded-full bg-leaf-600 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
