"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { buildPlanFromInput } from "@/lib/planner/build-from-input";
import { sendSatPlannerPlanReadyEmail } from "@/lib/email/send";
import { loadPlannerCatalog } from "@/lib/planner/load-catalog";
import { recommendBooks } from "@/lib/planner/recommend-books";
import { requirePlannerAccess } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  activatePlanSchema,
  mistakeEntrySchema,
  practiceTestEntrySchema,
  studentScoresSchema,
  toggleAssignmentSchema,
} from "@/lib/schemas/planner";
import type { Json, TablesInsert } from "@/lib/supabase/database.types";

export type ActionResult =
  | { ok: true; message?: string; data?: unknown }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[]
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

// ---------------------------------------------------------------------------
// Catalog + recommendations (for onboarding)
// ---------------------------------------------------------------------------

export async function getOnboardingBootstrap(): Promise<ActionResult> {
  const { user, profile } = await requirePlannerAccess("/planner/onboarding");
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

  return {
    ok: true,
    data: {
      catalog,
      settings,
      availability: availability ?? [],
      studentBooks: studentBooks ?? [],
      profileTimezone: profile.timezone,
      onboardingCompleted: profile.onboarding_completed,
    },
  };
}

export async function getBookRecommendations(raw: unknown): Promise<ActionResult> {
  await requirePlannerAccess("/planner/onboarding");
  const parsed = studentScoresSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Enter valid scores first.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const catalog = await loadPlannerCatalog();
  const recommendations = recommendBooks({
    ...parsed.data,
    books: catalog,
  });
  return { ok: true, data: { recommendations, catalog } };
}

export async function previewPlanAction(raw: unknown): Promise<ActionResult> {
  await requirePlannerAccess("/planner/onboarding");
  try {
    const built = await buildPlanFromInput(raw);
    return {
      ok: true,
      data: {
        plan: built.plan,
        selectedBooks: built.selectedBooks.map((b) => ({
          id: b.id,
          title: b.title,
          category: b.category,
          chapterCount: b.chapters.length,
        })),
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not preview the plan.",
    };
  }
}

/**
 * Persist onboarding inputs without activating a plan (save progress).
 */
export async function saveOnboardingProgress(raw: unknown): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner/onboarding");
  const parsed = activatePlanSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const input = parsed.data;
  const supabase = await getSupabaseServerClient();

  const { error: settingsError } = await supabase.from("student_settings").upsert(
    {
      user_id: user.id,
      current_math_score: input.currentMathScore,
      current_rw_score: input.currentRwScore,
      target_total_score: input.targetTotalScore,
      test_date: input.testDate,
      plan_start_date: input.planStartDate,
      timezone: input.timezone,
    },
    { onConflict: "user_id" }
  );
  if (settingsError) {
    console.error("[planner] save settings failed:", settingsError);
    return { ok: false, error: "Could not save your settings." };
  }

  await supabase.from("weekly_availability").delete().eq("user_id", user.id);
  const { error: availError } = await supabase.from("weekly_availability").insert(
    input.availability.map((d) => ({
      user_id: user.id,
      weekday: d.weekday,
      available: d.available,
      study_hours: d.studyHours,
    }))
  );
  if (availError) {
    console.error("[planner] save availability failed:", availError);
    return { ok: false, error: "Could not save your availability." };
  }

  await supabase.from("student_books").delete().eq("user_id", user.id);
  const { error: booksError } = await supabase.from("student_books").insert(
    input.selectedBooks.map((b) => ({
      user_id: user.id,
      book_id: b.bookId,
      recommendation_level: b.recommendationLevel,
      recommendation_reason: b.recommendationReason,
      included_in_plan: b.includedInPlan,
    }))
  );
  if (booksError) {
    console.error("[planner] save books failed:", booksError);
    return { ok: false, error: "Could not save your book selections." };
  }

  await supabase
    .from("profiles")
    .update({ timezone: input.timezone })
    .eq("id", user.id);

  return { ok: true, message: "Progress saved." };
}

/**
 * Activate a generated plan. Regenerates server-side (never trusts a client
 * assignment list). Archives any prior active plan, then inserts the new one
 * and its assignments. Marks onboarding complete.
 */
export async function activatePlanAction(raw: unknown): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner/onboarding");

  let built;
  try {
    built = await buildPlanFromInput(raw);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not build your plan.",
    };
  }

  const { input, plan } = built;
  const supabase = await getSupabaseServerClient();

  // Persist settings / availability / books first (same as save progress).
  const save = await saveOnboardingProgress(input);
  if (!save.ok) return save;

  // Archive any currently active plan (assignments cascade on delete only —
  // we archive rather than delete so history remains).
  const { error: archiveError } = await supabase
    .from("study_plans")
    .update({ status: "archived" })
    .eq("user_id", user.id)
    .eq("status", "active");
  if (archiveError) {
    console.error("[planner] archive failed:", archiveError);
    return { ok: false, error: "Could not replace your previous plan." };
  }

  const { data: studyPlan, error: planError } = await supabase
    .from("study_plans")
    .insert({
      user_id: user.id,
      status: "active",
      starts_on: plan.startsOn,
      test_date: plan.testDate,
      generation_version: plan.generationVersion,
      configuration_snapshot: plan.configurationSnapshot as Json,
      activated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (planError || !studyPlan) {
    console.error("[planner] insert study_plan failed:", planError);
    return { ok: false, error: "Could not create your study plan." };
  }

  const rows: TablesInsert<"assignments">[] = plan.assignments.map((a) => ({
    study_plan_id: studyPlan.id,
    user_id: user.id,
    assignment_date: a.assignmentDate,
    assignment_type: a.assignmentType,
    book_id: a.bookId,
    chapter_id: a.chapterId,
    sequence_on_day: a.sequenceOnDay,
    title: a.title,
    instructions: a.instructions,
    estimated_minutes: a.estimatedMinutes,
  }));

  // Insert in chunks to stay under payload limits.
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from("assignments").insert(chunk);
    if (error) {
      console.error("[planner] insert assignments failed:", error);
      // Compensating delete — cascade removes any partial assignments.
      await supabase.from("study_plans").delete().eq("id", studyPlan.id);
      return {
        ok: false,
        error: "Could not save your assignments. Please try activating again.",
      };
    }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true, timezone: input.timezone })
    .eq("id", user.id);
  if (profileError) {
    console.error("[planner] mark onboarding complete failed:", profileError);
    // Plan exists — still send them to the dashboard.
  }

  if (user.email) {
    await sendSatPlannerPlanReadyEmail({
      planId: studyPlan.id,
      email: user.email,
      testDate: plan.testDate,
      assignmentCount: rows.length,
    });
  }

  revalidatePath("/planner");
  redirect("/planner");
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export async function toggleAssignmentCompletion(
  raw: unknown
): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner");
  const parsed = toggleAssignmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid assignment update." };
  }
  const supabase = await getSupabaseServerClient();

  // Ownership enforced by user_id filter + RLS.
  const { data: existing, error: fetchError } = await supabase
    .from("assignments")
    .select("id, user_id, completed_at")
    .eq("id", parsed.data.assignmentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return { ok: false, error: "Assignment not found." };
  }

  const { error } = await supabase
    .from("assignments")
    .update({
      completed_at: parsed.data.completed ? new Date().toISOString() : null,
    })
    .eq("id", existing.id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[planner] toggle assignment failed:", error);
    return { ok: false, error: "Could not update the assignment." };
  }

  revalidatePath("/planner");
  revalidatePath("/planner/roadmap");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Practice tests
// ---------------------------------------------------------------------------

export async function savePracticeTest(raw: unknown): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner");
  const parsed = practiceTestEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const data = parsed.data;
  const supabase = await getSupabaseServerClient();

  if (data.assignmentId) {
    const { data: assignment } = await supabase
      .from("assignments")
      .select("id, user_id, assignment_type")
      .eq("id", data.assignmentId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!assignment) {
      return { ok: false, error: "Linked assignment not found." };
    }
  }

  const { data: row, error } = await supabase
    .from("practice_tests")
    .insert({
      user_id: user.id,
      assignment_id: data.assignmentId,
      test_date: data.testDate,
      test_name: data.testName,
      total_score: data.totalScore,
      math_score: data.mathScore,
      rw_score: data.rwScore,
      mistakes_reviewed: data.mistakesReviewed,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[planner] save practice test failed:", error);
    return { ok: false, error: "Could not save the practice test." };
  }

  if (data.assignmentId) {
    await supabase
      .from("assignments")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", data.assignmentId)
      .eq("user_id", user.id);
  }

  revalidatePath("/planner");
  revalidatePath("/planner/practice-tests");
  revalidatePath("/planner/roadmap");
  return { ok: true, data: { id: row.id } };
}

// ---------------------------------------------------------------------------
// Mistakes
// ---------------------------------------------------------------------------

export async function saveMistake(
  raw: unknown,
  existingId?: string | null
): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner");
  const parsed = mistakeEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }
  const data = parsed.data;
  const supabase = await getSupabaseServerClient();

  const payload = {
    user_id: user.id,
    practice_test_id: data.practiceTestId,
    assignment_id: data.assignmentId,
    source_type: data.sourceType,
    section: data.section,
    topic: data.topic,
    question_reference: data.questionReference || null,
    error_category: data.errorCategory,
    why_error: data.whyError,
    correct_reasoning: data.correctReasoning,
    lesson_to_remember: data.lessonToRemember,
    was_guessed: data.wasGuessed,
    was_retried: data.wasRetried,
    retry_correct: data.wasRetried ? data.retryCorrect : null,
  };

  if (existingId) {
    const { error } = await supabase
      .from("mistakes")
      .update(payload)
      .eq("id", existingId)
      .eq("user_id", user.id);
    if (error) {
      console.error("[planner] update mistake failed:", error);
      return { ok: false, error: "Could not update the mistake entry." };
    }
  } else {
    const { error } = await supabase.from("mistakes").insert(payload);
    if (error) {
      console.error("[planner] insert mistake failed:", error);
      return { ok: false, error: "Could not save the mistake entry." };
    }
  }

  revalidatePath("/planner/mistakes");
  revalidatePath("/planner");
  return { ok: true };
}

export async function deleteMistake(mistakeId: string): Promise<ActionResult> {
  const { user } = await requirePlannerAccess("/planner");
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("mistakes")
    .delete()
    .eq("id", mistakeId)
    .eq("user_id", user.id);
  if (error) {
    console.error("[planner] delete mistake failed:", error);
    return { ok: false, error: "Could not delete the mistake entry." };
  }
  revalidatePath("/planner/mistakes");
  return { ok: true };
}
