import Link from "next/link";
import { redirect } from "next/navigation";

import { AssignmentCard } from "@/components/planner/assignment-card";
import { requirePlannerAccess } from "@/lib/auth/session";
import { assignmentStatusForTimezone } from "@/lib/planner/status";
import { WEEKDAY_LABELS } from "@/lib/planner/dates";
import { weekdayOfIsoDate } from "@/lib/planner/dates";
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

  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      "id, assignment_date, assignment_type, title, instructions, estimated_minutes, sequence_on_day, completed_at, books(title), book_chapters(chapter_number, title)"
    )
    .eq("user_id", user.id)
    .eq("study_plan_id", plan.id)
    .order("assignment_date")
    .order("sequence_on_day");

  const byDate = new Map<string, NonNullable<typeof assignments>>();
  for (const a of assignments ?? []) {
    const list = byDate.get(a.assignment_date) ?? [];
    list.push(a);
    byDate.set(a.assignment_date, list);
  }

  const dates = [...byDate.keys()].sort();

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
        <div className="flex flex-col gap-8">
          {dates.map((date) => {
            const day = byDate.get(date)!;
            const weekday = weekdayOfIsoDate(date);
            return (
              <section key={date} className="flex flex-col gap-3">
                <h2 className="font-heading text-base font-medium">
                  {WEEKDAY_LABELS[weekday]} · {date}
                </h2>
                {day.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Unavailable day</p>
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
