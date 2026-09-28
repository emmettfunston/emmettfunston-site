import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  SupabasePublicEnvMissingError,
} from "@/lib/supabase/config";

/**
 * Route prefixes that require a signed-in user. Fine-grained authorization
 * (purchase, onboarding state) is enforced server-side in the /planner layout
 * and server actions — the proxy only handles session refresh plus the
 * cheap "not signed in at all" redirect.
 */
const PROTECTED_PREFIXES = ["/planner"];

/** Signed-in users visiting these pages get bounced to the planner. */
const AUTH_PAGES = ["/signin", "/signup"];

/**
 * Refreshes the Supabase auth session on every matched request and keeps the
 * request/response cookies in sync, per the official @supabase/ssr pattern.
 *
 * IMPORTANT: do not add logic between createServerClient and
 * supabase.auth.getUser(), and always return the supabaseResponse object
 * (or copy its cookies) so refreshed tokens reach the browser.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  let url: string;
  let anonKey: string;
  try {
    url = getSupabaseUrl();
    anonKey = getSupabaseAnonKey();
  } catch (err) {
    if (err instanceof SupabasePublicEnvMissingError) {
      // Auth is not configured (e.g. fresh checkout without .env). Let the
      // request through — server components will surface a clear error.
      console.warn(`[proxy] ${err.message}`);
      return supabaseResponse;
    }
    throw err;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(redirectUrl);
    // Preserve any refreshed auth cookies on the redirect response.
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  }

  if (user && AUTH_PAGES.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/planner";
    redirectUrl.search = "";
    const redirect = NextResponse.redirect(redirectUrl);
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  }

  return supabaseResponse;
}
