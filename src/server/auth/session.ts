import "server-only";

/**
 * ============================================================================
 *  CUSTOMER AUTHENTICATION (integration point)
 * ============================================================================
 *  Accounts are not connected yet. Guest checkout works without an account,
 *  and saved products / gardens / recently viewed live in the browser
 *  (localStorage) until a customer signs in.
 *
 *  TODO(auth): connect an auth provider – e.g. Auth.js (NextAuth), Clerk,
 *  Supabase Auth or Shopify customer accounts – and implement `getSession()`.
 *  On first sign-in, merge the browser's saved data into the customer record.
 * ============================================================================
 */

export interface CustomerSession {
  customerId: string;
  email: string;
  name?: string;
}

export const authConfigured = Boolean(process.env.AUTH_PROVIDER);

export async function getSession(): Promise<CustomerSession | null> {
  // TODO(auth): read and verify the session cookie via the chosen provider.
  return null;
}
