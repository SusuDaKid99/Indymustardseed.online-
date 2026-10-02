"use client";

import { Icon } from "../ui/Icon";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-10" : "h-12";
  const w = size === "sm" ? "w-10" : "w-12";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-earth-200 bg-white`} role="group" aria-label={label}>
      <button
        type="button"
        className={`grid ${h} ${w} place-items-center rounded-full text-forest-800 hover:bg-cream-100 disabled:opacity-40`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="w-10 bg-transparent text-center text-base font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      <button
        type="button"
        className={`grid ${h} ${w} place-items-center rounded-full text-forest-800 hover:bg-cream-100 disabled:opacity-40`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
