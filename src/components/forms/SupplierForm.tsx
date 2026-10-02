"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/forms";
import { submitSupplierApplication } from "@/server/actions/forms";
import { Field, FormStatus, Honeypot } from "./Field";

const categoryOptions = [
  "Seeds",
  "Live plants / nursery",
  "Garden tools",
  "Containers & raised beds",
  "Indoor growing / hydroponics",
  "Compost & soil",
  "Fertilizers & amendments",
  "Sustainable home products",
  "Other",
].map((v) => ({ value: v, label: v }));

const yesNo = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Open to discussing" },
];

export function SupplierForm() {
  const [state, action, pending] = useActionState(submitSupplierApplication, initialFormState);

  if (state.status === "success") return <FormStatus state={state} />;

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="company" label="Company" state={state} required autoComplete="organization" />
        <Field name="contact" label="Contact" state={state} required autoComplete="name" />
        <Field name="email" label="Email" type="email" state={state} required autoComplete="email" />
        <Field name="website" label="Website" type="url" state={state} autoComplete="url" placeholder="https://" />
        <Field name="category" label="Product category" as="select" options={categoryOptions} state={state} required className="sm:col-span-2" />
        <Field name="dropshipping" label="Dropshipping available?" as="select" options={yesNo} state={state} />
        <Field name="wholesale" label="Wholesale available?" as="select" options={yesNo} state={state} />
        <Field name="affiliate" label="Affiliate program available?" as="select" options={yesNo} state={state} />
        <Field name="minimumOrder" label="Minimum order" state={state} placeholder="e.g. $250 or 12 units" />
        <Field
          name="message"
          label="Message"
          as="textarea"
          state={state}
          className="sm:col-span-2"
          placeholder="Tell us about your products, where you ship from and what makes them great for home growers."
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "BECOME A SUPPLIER"}
      </button>
    </form>
  );
}
