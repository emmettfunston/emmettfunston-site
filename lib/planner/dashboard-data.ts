import "server-only";

import { requirePlannerAccess } from "@/lib/auth/session";
import {
  completionPercentage,
  selectCatchUpAssignments,
  selectTodayAssignments,
  selectUpcomingAssignments,
  studyStreakDays,
  assignmentStatusForTimezone,
} from "@/lib/planner/status";
import { localTodayIso } from "@/lib/planner/dates";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { AssignmentCardData } from "@/components/planner/assignment-card";

export async function loadDashboardData() {
  const { user, profile } = await requirePlannerAccess("/planner");
  if (!profile.onboarding_completed) {
    return { redirectToOnboarding: true as const };
  }

  const supabase = await getSupabaseServerClient();
  const timezone = profile.timezone || "America/Los_Angeles";

  const { data: plan } = await supabase
    .from("study_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!plan) {
    return { redirectToOnboarding: true as const };
  }

  const [
    { data: assignments },
    { data: settings },
    { data: practiceTests },
  ] = await Promise.all([
    supabase
      .from("assignments")
      .select(
        "id, assignment_date, assignment_type, title, instructions, estimated_minutes, sequence_on_day, completed_at, book_id, chapter_id, books(title), book_chapters(chapter_number, title)"
      )
      .eq("user_id", user.id)
      .eq("study_plan_id", plan.id)
      .order("assignment_date")
      .order("sequence_on_day"),
    supabase.from("student_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("practice_tests")
      .select("*")
      .eq("user_id", user.id)
      .order("test_date", { ascending: false })
      .limit(12),
  ]);

  const rows = assignments ?? [];

  // Chapter progress per book
  const bookProgress = new Map<
    string,
    { title: string; total: number; done: number }
  >();
  for (const a of rows) {
    if (a.assignment_type !== "chapter" || !a.book_id) continue;
    const title =
      (a.books as { title?: string } | null)?.title ?? "Book";
    const current = bookProgress.get(a.book_id) ?? {
      title,
      total: 0,
      done: 0,
    };
    current.total += 1;
    if (a.completed_at) current.done += 1;
    bookProgress.set(a.book_id, current);
  }

  function toCard(a: (typeof rows)[number]): AssignmentCardData {
    const chapter = a.book_chapters as {
      chapter_number?: number;
      title?: string;
    } | null;
    const book = a.books as { title?: string } | null;
    return {
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
        { assignmentDate: a.assignment_date, completedAt: a.completed_at },
        timezone
      ),
    };
  }

  const statusables = rows.map((a) => ({
    id: a.id,
    assignmentDate: a.assignment_date,
    completedAt: a.completed_at,
  }));

  const todayCards = selectTodayAssignments(statusables, timezone).map((s) =>
    toCard(rows.find((r) => r.id === s.id)!)
  );
  const catchUpCards = selectCatchUpAssignments(statusables, timezone).map((s) =>
    toCard(rows.find((r) => r.id === s.id)!)
  );
  const upcomingCards = selectUpcomingAssignments(statusables, timezone, undefined, 8).map(
    (s) => toCard(rows.find((r) => r.id === s.id)!)
  );

  const today = localTodayIso(timezone);
  const daysToTest = Math.max(
    0,
    Math.ceil(
      (new Date(`${plan.test_date}T12:00:00Z`).getTime() -
        new Date(`${today}T12:00:00Z`).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return {
    redirectToOnboarding: false as const,
    plan,
    settings,
    timezone,
    today: todayCards,
    catchUp: catchUpCards,
    upcoming: upcomingCards,
    completion: completionPercentage(statusables),
    streak: studyStreakDays(statusables, timezone),
    daysToTest,
    bookProgress: [...bookProgress.entries()].map(([id, v]) => ({
      id,
      ...v,
    })),
    practiceTests: practiceTests ?? [],
    latestPracticeTest: practiceTests?.[0] ?? null,
  };
}
