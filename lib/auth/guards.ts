import { redirect } from "next/navigation";
import { getAuthUser, type AuthUser } from "./session";
import type { UserRole } from "@/lib/generated/prisma/client";

/**
 * Asserts a valid session exists. Redirects to /login if not.
 * Use at the top of dashboard Server Components and Server Actions.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Asserts the current user has one of the allowed roles.
 * Redirects to /dashboard if authenticated but unauthorized.
 */
export async function requireRole(...roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}

// Convenience shorthands ──────────────────────────────────────────────────────

export async function requireOwner() {
  return requireRole("owner");
}

export async function requireAdmin() {
  return requireRole("owner", "admin");
}

// Inline helpers for Server Actions (throw instead of redirect) ───────────────

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function assertRole(user: AuthUser, ...roles: UserRole[]) {
  if (!roles.includes(user.role)) throw new UnauthorizedError();
}

export function assertBusiness(user: AuthUser, businessId: string) {
  if (user.businessId !== businessId) throw new UnauthorizedError();
}
