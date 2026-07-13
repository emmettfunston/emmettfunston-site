import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Thrown when the Supabase environment variables are not present at runtime.
 * Server actions catch this and translate it into a user-friendly error so
 * we never silently pretend a submission was saved.
 */
export class SupabaseNotConfiguredError extends Error {
  public readonly missing: string[];

  constructor(missing: string[]) {
    super(
      `Supabase is not configured. Missing env vars: ${missing.join(", ")}. ` +
        `Set them in .env (see .env.example) and restart the dev server.`
    );
    this.name = "SupabaseNotConfiguredError";
    this.missing = missing;
  }
}

let cached: SupabaseClient | null = null;

/**
 * Returns a Supabase client authenticated with the service role key.
 *
 * The service role key BYPASSES row level security, so this client must
 * only ever be used on the server. The `import "server-only"` at the top
 * of this file will cause a build error if it is ever imported into a
 * Client Component.
 *
 * Throws `SupabaseNotConfiguredError` when either the URL or the service
 * role key is missing, rather than returning a mock that pretends to work.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length > 0) {
    throw new SupabaseNotConfiguredError(missing);
  }

  cached = createClient(url!, serviceRoleKey!, {
    auth: {
      // Service-role clients are stateless: no session cookies, no auto-refresh.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-application-name": "emmettfunston-site",
      },
    },
  });

  return cached;
}
