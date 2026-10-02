"use client";

import { useId } from "react";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
  emoji?: string;
}

/** Large, thumb-friendly radio/checkbox cards used by the Garden Finder and Build Your Garden tools. */
export function ChoiceGroup<T extends string>({
  legend,
  description,
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
}: {
  legend: string;
  description?: string;
  options: ChoiceOption<T>[];
  value: T[];
  onChange: (next: T[]) => void;
  multiple?: boolean;
  columns?: 2 | 3 | 5;
}) {
  const name = useId();
  const cols = columns === 5 ? "sm:grid-cols-3 lg:grid-cols-5" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <fieldset>
      <legend className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">{legend}</legend>
      {description && <p className="mt-1 text-muted">{description}</p>}
      <div className={`mt-5 grid grid-cols-1 gap-3 ${cols}`}>
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label
              key={o.value}
              className={`relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mustard-500 ${checked ? "border-forest-700 bg-leaf-50" : "border-cream-200 hover:border-leaf-300"}`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => {
                  if (!multiple) onChange([o.value]);
                  else onChange(checked ? value.filter((v) => v !== o.value) : [...value, o.value]);
                }}
                className="sr-only"
              />
              {o.emoji && (
                <span aria-hidden="true" className="text-2xl">
                  {o.emoji}
                </span>
              )}
              <span className="flex-1">
                <span className="block font-semibold text-forest-900">{o.label}</span>
                {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
              </span>
              <span
                aria-hidden="true"
                className={`grid h-6 w-6 shrink-0 place-items-center ${multiple ? "rounded-md" : "rounded-full"} border-2 ${checked ? "border-forest-700 bg-forest-700 text-white" : "border-earth-200"}`}
              >
                {checked && (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
