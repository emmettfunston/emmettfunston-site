import Link from "next/link";

import { WorkshopTable } from "@/app/admin/_components/WorkshopTable";
import { ApplicationsTable } from "@/app/admin/_components/ApplicationsTable";
import { SignOutButton } from "@/app/admin/_components/SignOutButton";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/admin/application";

type WorkshopRow = React.ComponentProps<typeof WorkshopTable>["rows"][number];
type ApplicationRow = React.ComponentProps<
  typeof ApplicationsTable
>["rows"][number];

type Tab = "workshop" | "applications";

type DashboardProps = {
  tab: Tab;
  workshopRows: WorkshopRow[];
  applicationRows: ApplicationRow[];
  workshopCount: number;
  applicationCount: number;
  loadError: string | null;
  statusCounts: Partial<Record<ApplicationStatus, number>>;
};

export function Dashboard({
  tab,
  workshopRows,
  applicationRows,
  workshopCount,
  applicationCount,
  loadError,
  statusCounts,
}: DashboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Admin dashboard · MVP
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Submissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Password-gated MVP. Replace with real auth (Supabase Auth / NextAuth
            / Clerk) before multi-user use.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SignOutButton />
        </div>
      </header>

      {/* Stat strip */}
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Workshop registrations" value={workshopCount} />
        <StatCard label="Cohort applications" value={applicationCount} />
        <StatCard
          label="New (uncontacted)"
          value={statusCounts.new ?? 0}
          tone="emphasis"
        />
      </section>

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {loadError}
        </div>
      ) : null}

      {/* Tabs */}
      <nav className="flex items-center gap-1 border-b border-foreground/10">
        <TabLink
          href="/admin?tab=workshop"
          label="Workshop Registrations"
          count={workshopCount}
          active={tab === "workshop"}
        />
        <TabLink
          href="/admin?tab=applications"
          label="Cohort Applications"
          count={applicationCount}
          active={tab === "applications"}
        />
      </nav>

      {/* Panel */}
      {tab === "workshop" ? (
        <WorkshopTable rows={workshopRows} />
      ) : (
        <ApplicationsTable rows={applicationRows} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "emphasis";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border p-4",
        tone === "emphasis"
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/10 bg-background"
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-widest uppercase",
          tone === "emphasis" ? "text-background/70" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <span className="font-heading text-3xl font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

function TabLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
          active
            ? "bg-foreground/10 text-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </Link>
  );
}
