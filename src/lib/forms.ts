export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back on errors so React 19's automatic form reset doesn't wipe user input. */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle", message: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return EMAIL_RE.test(value) && value.length <= 254;
}

export function isUrl(value: string) {
  try {
    const u = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(u.hostname.includes("."));
  } catch {
    return false;
  }
}

export function str(form: FormData, key: string, max = 500) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
