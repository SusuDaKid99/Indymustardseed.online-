"use client";

import { useActionState, useId } from "react";
import { subscribeNewsletter } from "@/server/actions/forms";
import { initialFormState } from "@/lib/forms";
import { Icon } from "../ui/Icon";

/**
 * The Mustard Seed Newsletter signup. Inline, never a pop-up.
 * `band` is the full-width section; `compact` fits sidebars; `footer` is the dark footer variant.
 */
export function NewsletterForm({ source, variant = "band" }: { source: string; variant?: "band" | "compact" | "footer" }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialFormState);
  const id = useId();
  const dark = variant === "footer";

  const form =
    state.status === "success" ? (
      <p role="status" className={`flex items-center gap-2 font-medium ${dark ? "text-leaf-200" : "text-forest-800"}`}>
        <Icon name="check" className="h-5 w-5" /> {state.message}
      </p>
    ) : (
      <form action={action} className="relative w-full" noValidate>
        <input type="hidden" name="source" value={source} />
        {/* Honeypot – hidden from people, tempting for bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave blank <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="field flex-1"
            aria-invalid={state.status === "error" ? true : undefined}
            aria-describedby={state.status === "error" ? `${id}-err` : undefined}
          />
          <button type="submit" className={dark ? "btn-mustard" : "btn-primary"} disabled={pending}>
            {pending ? "Joining…" : "JOIN"}
          </button>
        </div>
        {state.status === "error" && (
          <p id={`${id}-err`} role="alert" className={dark ? "mt-2 text-sm font-medium text-mustard-100" : "field-error"}>
            {state.message}
          </p>
        )}
      </form>
    );

  if (variant === "band") {
    return (
      <section aria-labelledby={`${id}-title`} className="rounded-[2rem] bg-leaf-50 px-6 py-10 ring-1 ring-leaf-100 sm:px-10 md:py-12">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow mb-2">Newsletter</p>
            <h2 id={`${id}-title`} className="text-2xl font-semibold sm:text-3xl">
              The Mustard Seed Newsletter
            </h2>
            <p className="mt-2 text-muted">
              Growing tips, seasonal reminders, new products and deals—without filling your inbox with weeds.
            </p>
          </div>
          <div>
            {form}
            <p className="mt-2 text-xs text-muted">Unsubscribe anytime. We never sell your email.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <h2 className={`font-display text-xl font-semibold ${dark ? "text-white" : ""}`}>The Mustard Seed Newsletter</h2>
      <p className={`mb-4 mt-1 text-sm ${dark ? "text-cream-200" : "text-muted"}`}>
        Growing tips, seasonal reminders, new products and deals—without filling your inbox with weeds.
      </p>
      {form}
    </div>
  );
}
