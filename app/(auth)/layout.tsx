import Link from "next/link";
import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Minimal centered shell for auth pages (signin/signup/forgot/reset).
 * Deliberately skips the marketing Navbar/Footer to keep the flow focused.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="group mb-8 flex items-center gap-2.5"
        aria-label={siteConfig.brand}
      >
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-lg bg-foreground font-heading text-sm font-semibold text-background transition-transform group-hover:-rotate-3"
        >
          EF
        </span>
        <span className="text-sm font-medium tracking-tight text-foreground">
          Emmett Funston
          <span className="text-muted-foreground"> · SAT Planner</span>
        </span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
