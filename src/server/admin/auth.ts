import "server-only";
import { timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/config/server-env";

/**
 * Admin API authentication (temporary).
 *
 * Until a real admin dashboard with user accounts and roles exists, the admin
 * API is protected by a long random bearer token in ADMIN_API_TOKEN. If the
 * variable is unset, the admin API is disabled entirely.
 *
 * TODO(auth): replace with role-based access from the auth provider
 * (e.g. `session.user.role === "admin"`).
 */
export function isAdminRequest(request: Request) {
  const expected = serverEnv.adminApiToken;
  if (!expected || expected.length < 24) return false;
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
