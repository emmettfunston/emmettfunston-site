import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 proxy (the renamed middleware convention).
 *
 * Its only jobs: refresh Supabase auth tokens so Server Components never hold
 * stale sessions, redirect signed-out visitors away from /planner, and bounce
 * signed-in users off the signin/signup pages. Real authorization (purchase
 * verification, onboarding state) is enforced server-side in layouts, pages,
 * and server actions — never trust proxy checks alone.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and images. Auth cookies must be
     * refreshable on any page that might read the session (navbar, planner,
     * auth pages, marketing pages with personalized CTAs).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
