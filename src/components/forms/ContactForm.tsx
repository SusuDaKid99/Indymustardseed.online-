"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/forms";
import { submitContact } from "@/server/actions/forms";
import { Field, FormStatus, Honeypot } from "./Field";

const topics = ["Order question", "Product question", "Shipping", "Returns", "Garden services", "Partnerships", "Other"].map((v) => ({ value: v, label: v }));

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialFormState);
  if (state.status === "success") return <FormStatus state={state} />;
  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" state={state} required autoComplete="name" />
        <Field name="email" label="Email" type="email" state={state} required autoComplete="email" />
        <Field name="topic" label="Topic" as="select" options={topics} state={state} className="sm:col-span-2" />
        <Field name="message" label="Message" as="textarea" state={state} required className="sm:col-span-2" />
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
