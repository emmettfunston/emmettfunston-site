import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// TODO(auth): This is an intentional MVP-grade password gate. Before this
// dashboard sees real staff usage or multi-user access, replace it with proper
// auth (Supabase Auth, NextAuth, or Clerk) — including per-user identity,
// audit logging, and revocable sessions.

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const HMAC_INPUT = "admin-session-v1";

export class AdminNotConfiguredError extends Error {
  constructor() {
    super(
      "Admin is not configured. Set ADMIN_PASSWORD in .env and restart the server."
    );
    this.name = "AdminNotConfiguredError";
  }
}

function getPassword(): string {
  const raw = process.env.ADMIN_PASSWORD?.trim();
  if (!raw) {
    throw new AdminNotConfiguredError();
  }
  return raw;
}

/**
 * Derive the session token from the current ADMIN_PASSWORD. Because the
 * password is the HMAC key, rotating ADMIN_PASSWORD automatically invalidates
 * every issued session token — no separate secret to manage.
 */
function currentSessionToken(): string {
  const password = getPassword();
  return createHmac("sha256", password).update(HMAC_INPUT).digest("hex");
}

/**
 * Constant-time string comparison. Falls back to a plain string check only
 * when the byte lengths differ (which itself is safe to reveal because it
 * simply indicates a wrong-format token).
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Returns true when the current request carries a valid admin session cookie.
 * Never throws — a missing ADMIN_PASSWORD is treated as "no valid session"
 * and logged, so the login form still renders cleanly.
 */
export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  let expected: string;
  try {
    expected = currentSessionToken();
  } catch (err) {
    if (err instanceof AdminNotConfiguredError) {
      console.warn(
        "[admin] isAdminAuthed: ADMIN_PASSWORD is not set — treating as unauthenticated."
      );
      return false;
    }
    throw err;
  }

  return safeEqual(raw, expected);
}

/**
 * Verify an attempted password against ADMIN_PASSWORD. Uses constant-time
 * comparison to prevent timing side-channels.
 */
export function verifyAdminPassword(attempt: string): boolean {
  let expected: string;
  try {
    expected = getPassword();
  } catch (err) {
    if (err instanceof AdminNotConfiguredError) {
      console.warn("[admin] verifyAdminPassword: ADMIN_PASSWORD is not set.");
      return false;
    }
    throw err;
  }
  return safeEqual(attempt, expected);
}

/**
 * Set the admin session cookie. Must be called from a server action or
 * route handler (contexts where the cookies() store is mutable).
 */
export async function setAdminSessionCookie(): Promise<void> {
  const token = currentSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/**
 * Clear the admin session cookie by writing an expired value.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Guard for admin server actions. Throws if the caller is not authenticated,
 * which surfaces as a rejected Promise on the client — good enough for MVP
 * defense-in-depth against session-expired form submissions.
 */
export async function requireAdmin(): Promise<void> {
  const ok = await isAdminAuthed();
  if (!ok) {
    throw new Error("Not authorized. Please sign in again.");
  }
}
