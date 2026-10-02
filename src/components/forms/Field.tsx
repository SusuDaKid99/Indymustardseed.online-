import type { FormState } from "@/lib/forms";

type Base = {
  name: string;
  label: string;
  state: FormState;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  className?: string;
};

/** Accessible labelled form control with server-side error wiring. */
export function Field({
  name,
  label,
  state,
  required,
  hint,
  autoComplete,
  className = "",
  type = "text",
  as = "input",
  options,
  rows = 5,
  placeholder,
}: Base & {
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
}) {
  const id = `f-${name}`;
  const error = state.fieldErrors?.[name];
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    autoComplete,
    defaultValue: state.values?.[name],
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  } as const;

  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span className="text-red-800" aria-hidden="true">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {as === "textarea" ? (
        <textarea {...common} rows={rows} placeholder={placeholder} className="field py-3" />
      ) : as === "select" ? (
        <select {...common} key={state.values?.[name]} className="field">
          <option value="">Select…</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={type} placeholder={placeholder} className="field" />
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field blank <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={`rounded-2xl p-4 font-medium ${state.status === "error" ? "bg-red-50 text-red-900" : "bg-leaf-50 text-forest-900"}`}
    >
      {state.message}
    </p>
  );
}
