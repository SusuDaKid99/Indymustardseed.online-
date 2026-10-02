"use server";

import { isEmail, isUrl, str, type FormState } from "@/lib/forms";

/**
 * Form server actions. Each one validates on the server and has a clear
 * TODO where the real integration (email platform, CRM, ticketing) goes.
 * A hidden "company_website" honeypot field filters simple bots.
 */

function isBot(form: FormData) {
  return str(form, "company_website") !== "";
}

export async function subscribeNewsletter(_prev: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "Thanks for subscribing!" };
  const email = str(form, "email", 254).toLowerCase();
  if (!isEmail(email)) {
    return { status: "error", message: "Please enter a valid email address.", fieldErrors: { email: "Enter a valid email." } };
  }
  // TODO(newsletter): add subscriber via email platform API (Mailchimp, Klaviyo,
  // ConvertKit, Resend Audiences…) using NEWSLETTER_API_KEY from server env.
  // Use double opt-in to stay compliant.
  console.info("[newsletter] signup", { source: str(form, "source", 40) });
  return { status: "success", message: "You're in! Watch your inbox for growing tips." };
}

export async function submitSupplierApplication(_prev: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "Thanks! We'll be in touch." };
  const data = {
    company: str(form, "company", 120),
    contact: str(form, "contact", 120),
    email: str(form, "email", 254),
    website: str(form, "website", 300),
    category: str(form, "category", 80),
    dropshipping: str(form, "dropshipping", 10),
    wholesale: str(form, "wholesale", 10),
    affiliate: str(form, "affiliate", 10),
    minimumOrder: str(form, "minimumOrder", 120),
    message: str(form, "message", 3000),
  };
  const fieldErrors: Record<string, string> = {};
  if (!data.company) fieldErrors.company = "Company name is required.";
  if (!data.contact) fieldErrors.contact = "Contact name is required.";
  if (!isEmail(data.email)) fieldErrors.email = "Enter a valid email.";
  if (data.website && !isUrl(data.website)) fieldErrors.website = "Enter a valid website URL.";
  if (!data.category) fieldErrors.category = "Choose a product category.";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values: data };
  }
  // TODO(crm): store in suppliers_applications table and notify the team by email.
  console.info("[supplier-application]", { company: data.company, category: data.category });
  return { status: "success", message: `Thanks, ${data.contact}! We review every application and will reply within a few business days.` };
}

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "Thanks! We'll reply soon." };
  const name = str(form, "name", 120);
  const email = str(form, "email", 254);
  const topic = str(form, "topic", 60);
  const message = str(form, "message", 3000);
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!isEmail(email)) fieldErrors.email = "Enter a valid email.";
  if (message.length < 10) fieldErrors.message = "Please include a few more details.";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values: { name, email, topic, message } };
  }
  // TODO(support): forward to help desk (email, Help Scout, Zendesk…).
  console.info("[contact]", { topic });
  return { status: "success", message: "Thanks for reaching out! We usually reply within one business day." };
}
