import "server-only";

/**
 * Server-only environment access. Secrets are read from environment variables
 * (see .env.example) and must never be imported into client components.
 */
export const serverEnv = {
  adminApiToken: process.env.ADMIN_API_TOKEN ?? "",

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID ?? "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
  },

  /** Email service for newsletter / transactional mail (e.g. Resend, Postmark, Mailchimp). */
  newsletterApiKey: process.env.NEWSLETTER_API_KEY ?? "",
  newsletterListId: process.env.NEWSLETTER_LIST_ID ?? "",

  /** Database connection for the production product/order store. */
  databaseUrl: process.env.DATABASE_URL ?? "",
};
