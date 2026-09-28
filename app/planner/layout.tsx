import Link from "next/link";
import type { Metadata } from "next";

import { requirePlannerAccess } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SAT Planner",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/planner", label: "Dashboard" },
  { href: "/planner/roadmap", label: "Roadmap" },
  { href: "/planner/practice-tests", label: "Practice tests" },
  { href: "/planner/mistakes", label: "Mistakes" },
] as const;

export default async function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requirePlannerAccess("/planner");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/planner" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-lg bg-foreground font-heading text-xs font-semibold text-background"
              >
                EF
              </span>
              <span className="text-sm font-medium tracking-tight">
                SAT Planner
              </span>
            </Link>
            {profile.onboarding_completed ? (
              <nav
                className="hidden items-center gap-1 md:flex"
                aria-label="Planner"
              >
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.display_name || profile.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
