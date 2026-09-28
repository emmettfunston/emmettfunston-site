import Link from "next/link";
import { redirect } from "next/navigation";

import { PracticeTestForm } from "@/components/planner/practice-test-form";
import { requirePlannerAccess } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PracticeTestsPage() {
  const { user, profile } = await requirePlannerAccess("/planner/practice-tests");
  if (!profile.onboarding_completed) redirect("/planner/onboarding");

  const supabase = await getSupabaseServerClient();
  const timezone = profile.timezone || "America/Los_Angeles";

  const [{ data: tests }, { data: openPracticeAssignments }] = await Promise.all([
    supabase
      .from("practice_tests")
      .select("*")
      .eq("user_id", user.id)
      .order("test_date", { ascending: false }),
    supabase
      .from("assignments")
      .select("id, assignment_date, title, completed_at")
      .eq("user_id", user.id)
      .eq("assignment_type", "practice_test")
      .is("completed_at", null)
      .order("assignment_date"),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Practice test tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Record scores with controlled selectors. Totals always equal Math +
            Reading &amp; Writing.
          </p>
        </div>
        <Link href="/planner" className={cn(buttonVariants({ variant: "outline" }))}>
          Dashboard
        </Link>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-medium">Log a practice test</h2>
        <PracticeTestForm
          timezone={timezone}
          assignmentOptions={(openPracticeAssignments ?? []).map((a) => ({
            value: a.id,
            label: `${a.assignment_date} · ${a.title}`,
          }))}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">History</h2>
        {(tests ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No practice tests yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {(tests ?? []).map((t) => (
              <li
                key={t.id}
                className="flex flex-col gap-1 rounded-xl border border-foreground/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {t.test_name} · {t.test_date}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Math {t.math_score} · R&W {t.rw_score}
                    {t.mistakes_reviewed ? " · Mistakes reviewed" : ""}
                  </p>
                </div>
                <p className="font-heading text-2xl font-semibold">
                  {t.total_score}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
