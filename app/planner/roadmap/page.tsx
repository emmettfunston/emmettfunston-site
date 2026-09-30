import Link from "next/link";
import { redirect } from "next/navigation";
import { format, startOfWeek } from "date-fns";

import { AssignmentCard } from "@/components/planner/assignment-card";
import { requirePlannerAccess } from "@/lib/auth/session";
import { assignmentStatusForTimezone } from "@/lib/planner/status";
import {
  eachIsoDateInclusive,
  parseIsoDate,
  WEEKDAY_LABELS,
  weekdayOfIsoDate,
} from "@/lib/planner/dates";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function RoadmapPage() {
  const { user, profile } = await requirePlannerAccess("/planner/roadmap");
  if (!profile.onboarding_completed) redirect("/planner/onboarding");

  const supabase = await getSupabaseServerClient();
  const timezone = profile.timezone || "America/Los_Angeles";

  const { data: plan } = await supabase
    .from("study_plans")
    .select("id, starts_on, test_date")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!plan) redirect("/planner/onboarding");

  const [{ data: assignments }, { data: availability }] = await Promise.all([
    supabase
      .from("assignments")
      .select(
        "id, assignment_date, assignment_type, title, instructions, estimated_minutes, sequence_on_day, completed_at, books(title), book_chapters(chapter_number, title)"
      )
      .eq("user_id", user.id)
      .eq("study_plan_id", plan.id)
      .order("assignment_date")
      .order("sequence_on_day"),
    supabase
      .from("weekly_availability")
      .select("weekday, available")
      .eq("user_id", user.id),
  ]);

  const byDate = new Map<string, NonNullable<typeof assignments>>();
  for (const a of assignments ?? []) {
    const list = byDate.get(a.assignment_date) ?? [];
    list.push(a);
    byDate.set(a.assignment_date, list);
  }

  const dates = eachIsoDateInclusive(plan.starts_on, plan.test_date);
  const availabilityByDay = new Map(
    (availability ?? []).map((day) => [day.weekday, day.available])
  );
  const weeks = new Map<string, string[]>();
  for (const date of dates) {
    const week = format(
      startOfWeek(parseIsoDate(date), { weekStartsOn: 0 }),
      "yyyy-MM-dd"
    );
    const list = weeks.get(week) ?? [];
    list.push(date);
    weeks.set(week, list);
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Roadmap
          </h1>
          <p className="text-sm text-muted-foreground">
            {plan.starts_on} → {plan.test_date}. Completing or missing work never
            moves other due dates.
          </p>
        </div>
        <Link href="/planner" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to dashboard
        </Link>
      </header>

      {dates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assignments in this plan.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {[...weeks.entries()].map(([weekStart, weekDates]) => (
            <section key={weekStart} className="flex flex-col gap-4">
              <h2 className="font-heading text-lg font-medium">
                Week of {weekStart}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {weekDates.map((date) => {
                  const day = byDate.get(date) ?? [];
                  const weekday = weekdayOfIsoDate(date);
                  const emptyLabel =
                    date === plan.test_date
                      ? "SAT Test Day — no planner work"
                      : weekday === 6
                        ? "Practice Test Day"
                        : availabilityByDay.get(weekday)
                          ? "No work scheduled"
                          : "Unavailable day";
                  return (
                    <article
                      key={date}
                      className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-4"
                    >
                      <h3 className="font-heading text-base font-medium">
                        {WEEKDAY_LABELS[weekday]} · {date}
                      </h3>
                      {day.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {emptyLabel}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {day.map((a) => {
                      const chapter = a.book_chapters as {
                        chapter_number?: number;
                        title?: string;
                      } | null;
                      const book = a.books as { title?: string } | null;
                      return (
                        <AssignmentCard
                          key={a.id}
                          assignment={{
                            id: a.id,
                            assignmentDate: a.assignment_date,
                            assignmentType: a.assignment_type,
                            title: a.title,
                            instructions: a.instructions,
                            estimatedMinutes: a.estimated_minutes,
                            sequenceOnDay: a.sequence_on_day,
                            completedAt: a.completed_at,
                            bookTitle: book?.title ?? null,
                            chapterNumber: chapter?.chapter_number ?? null,
                            chapterTitle: chapter?.title ?? null,
                            status: assignmentStatusForTimezone(
                              {
                                assignmentDate: a.assignment_date,
                                completedAt: a.completed_at,
                              },
                              timezone
                            ),
                          }}
                        />
                      );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
