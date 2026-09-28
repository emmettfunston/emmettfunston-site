import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/planner/onboarding-wizard";
import { requirePlannerAccess } from "@/lib/auth/session";
import { loadPlannerCatalog } from "@/lib/planner/load-catalog";
import { recommendBooks } from "@/lib/planner/recommend-books";
import type { DayAvailability, Weekday } from "@/lib/planner/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function PlannerOnboardingPage() {
  const { user, profile } = await requirePlannerAccess("/planner/onboarding");

  if (profile.onboarding_completed) {
    redirect("/planner");
  }

  const catalog = await loadPlannerCatalog();
  const supabase = await getSupabaseServerClient();

  const [{ data: settings }, { data: availability }, { data: studentBooks }] =
    await Promise.all([
      supabase.from("student_settings").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("weekly_availability")
        .select("*")
        .eq("user_id", user.id)
        .order("weekday"),
      supabase.from("student_books").select("*").eq("user_id", user.id),
    ]);

  const recommendations =
    settings != null
      ? recommendBooks({
          currentMathScore: settings.current_math_score,
          currentRwScore: settings.current_rw_score,
          targetTotalScore: settings.target_total_score,
          books: catalog,
        })
      : undefined;

  const initialAvailability: DayAvailability[] | undefined = availability?.length
    ? availability.map((d) => ({
        weekday: d.weekday as Weekday,
        available: d.available,
        studyHours: d.study_hours,
      }))
    : undefined;

  return (
    <OnboardingWizard
      catalog={catalog}
      initial={{
        currentMathScore: settings?.current_math_score,
        currentRwScore: settings?.current_rw_score,
        targetTotalScore: settings?.target_total_score,
        planStartDate: settings?.plan_start_date,
        testDate: settings?.test_date,
        timezone: settings?.timezone ?? profile.timezone,
        availability: initialAvailability,
        selectedBooks: studentBooks?.map((b) => ({
          bookId: b.book_id,
          includedInPlan: b.included_in_plan,
          recommendationLevel: b.recommendation_level,
          recommendationReason: b.recommendation_reason,
        })),
        recommendations,
      }}
    />
  );
}
