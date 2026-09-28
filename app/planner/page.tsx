import Link from "next/link";
import { redirect } from "next/navigation";

import { AssignmentCard } from "@/components/planner/assignment-card";
import { loadDashboardData } from "@/lib/planner/dashboard-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PlannerDashboardPage() {
  const data = await loadDashboardData();
  if (data.redirectToOnboarding) {
    redirect("/planner/onboarding");
  }

  const latest = data.latestPracticeTest;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Your dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay current on today&apos;s work, clear catch-up, and keep practice
            tests honest.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/planner/roadmap"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Full roadmap
          </Link>
          <Link
            href="/planner/mistakes"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Mistake journal
          </Link>
          <Link
            href="/planner/practice-tests"
            className={cn(buttonVariants())}
          >
            Log practice test
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 p-5">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            SAT countdown
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {data.daysToTest}
          </p>
          <p className="text-sm text-muted-foreground">
            days until {data.plan.test_date}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 p-5">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Completion
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {data.completion}%
          </p>
          <p className="text-sm text-muted-foreground">of scheduled work done</p>
        </div>
        <div className="rounded-xl border border-foreground/10 p-5">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Study streak
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {data.streak}
          </p>
          <p className="text-sm text-muted-foreground">days fully completed</p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">Today</h2>
        {data.today.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No assignments due today. Use the time for catch-up or rest.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.today.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">Catch-Up</h2>
        {data.catchUp.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You&apos;re caught up. Missed work never moves future due dates —
            it waits here instead.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.catchUp.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">Upcoming</h2>
        {data.upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.upcoming.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium">Selected books</h2>
          {data.bookProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground">No book progress yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.bookProgress.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3 text-sm"
                >
                  <span>{b.title}</span>
                  <span className="text-muted-foreground">
                    {b.done}/{b.total} chapters
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium">Practice tests</h2>
          {latest ? (
            <div className="rounded-xl border border-foreground/10 p-5">
              <p className="text-sm text-muted-foreground">
                Latest · {latest.test_name} · {latest.test_date}
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold">
                {latest.total_score}
              </p>
              <p className="text-sm text-muted-foreground">
                Math {latest.math_score} · R&W {latest.rw_score}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No practice tests logged yet.
            </p>
          )}
          {data.practiceTests.length > 1 ? (
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {data.practiceTests.slice(0, 6).map((t) => (
                <li key={t.id} className="flex justify-between gap-3">
                  <span>
                    {t.test_date} · {t.test_name}
                  </span>
                  <span className="font-medium text-foreground">
                    {t.total_score}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href="/planner/practice-tests"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            Open practice test tracker
          </Link>
        </div>
      </section>
    </div>
  );
}
