import { redirect } from "next/navigation";
import { getCurrentUser } from "./shop";

/**
 * Admin email whitelist.
 * Set ADMIN_EMAILS env var as comma-separated list: "admin@example.com,boss@example.com"
 * Falls back to empty list (no one has access) if not configured.
 */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = getAdminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
}

/**
 * Server-side admin guard for use in layouts/pages.
 * Redirects to homepage if user is not an admin.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/prihlaseni?redirectTo=/admin");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  return user;
}

/**
 * Server-side admin guard for use in server actions.
 * Throws an error instead of redirecting.
 */
export async function requireAdminAction() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Přístup odmítnut — nemáte administrátorská oprávnění.");
  }

  return user;
}
