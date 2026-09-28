/**
 * Shared Supabase environment resolution.
 *
 * This module is imported by BOTH server and browser clients, so it must not
 * import "server-only" and must never touch the service-role key.
 */

/**
 * Thrown when the public Supabase environment variables are missing.
 */
export class SupabasePublicEnvMissingError extends Error {
  public readonly missing: string[];

  constructor(missing: string[]) {
    super(
      `Supabase is not configured. Missing env vars: ${missing.join(", ")}. ` +
        `Set them in .env (see .env.example) and restart the dev server.`
    );
    this.name = "SupabasePublicEnvMissingError";
    this.missing = missing;
  }
}

/**
 * Returns the bare Supabase project URL (e.g. https://abc.supabase.co).
 *
 * Historically this project's NEXT_PUBLIC_SUPABASE_URL was stored with a
 * trailing `/rest/v1/` path. supabase-js expects the bare origin — it appends
 * `/rest/v1`, `/auth/v1`, etc. itself — so we normalize away any path here.
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    throw new SupabasePublicEnvMissingError(["NEXT_PUBLIC_SUPABASE_URL"]);
  }
  const url = new URL(raw);
  return url.origin;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new SupabasePublicEnvMissingError(["NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
  }
  return key;
}
