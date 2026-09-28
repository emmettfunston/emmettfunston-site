import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cookie-based Supabase client for Server Components, Server Actions, and
 * Route Handlers.
 *
 * Uses the public anon key: every query runs as the signed-in user and is
 * subject to Row Level Security. Auth token *refresh* happens in proxy.ts
 * (Server Components cannot write cookies), so the `setAll` here swallows
 * the error thrown when called from a Server Component.
 *
 * Never cache or hoist the returned client — always create it per request.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: proxy.ts refreshes sessions before we get here.
        }
      },
    },
  });
}
