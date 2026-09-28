import Link from "next/link";
import { redirect } from "next/navigation";

import { MistakeForm } from "@/components/planner/mistake-form";
import { requirePlannerAccess } from "@/lib/auth/session";
import {
  MISTAKE_ERROR_CATEGORY_LABELS,
  type MistakeErrorCategory,
} from "@/lib/planner/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function MistakesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; source?: string; edit?: string }>;
}) {
  const { user, profile } = await requirePlannerAccess("/planner/mistakes");
  if (!profile.onboarding_completed) redirect("/planner/onboarding");

  const params = await searchParams;
  const supabase = await getSupabaseServerClient();

  let query = supabase
    .from("mistakes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (params.section === "math" || params.section === "reading_writing") {
    query = query.eq("section", params.section);
  }
  if (params.source === "practice_test" || params.source === "book") {
    query = query.eq("source_type", params.source);
  }

  const { data: mistakes } = await query;

  const editing = params.edit
    ? (mistakes ?? []).find((m) => m.id === params.edit)
    : null;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Mistake journal
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn errors into points. Filter, add, edit, and delete entries.
          </p>
        </div>
        <Link href="/planner" className={cn(buttonVariants({ variant: "outline" }))}>
          Dashboard
        </Link>
      </header>

      <section className="flex flex-wrap gap-2 text-sm">
        <FilterChip href="/planner/mistakes" active={!params.section && !params.source}>
          All
        </FilterChip>
        <FilterChip
          href="/planner/mistakes?section=math"
          active={params.section === "math"}
        >
          Math
        </FilterChip>
        <FilterChip
          href="/planner/mistakes?section=reading_writing"
          active={params.section === "reading_writing"}
        >
          Reading &amp; Writing
        </FilterChip>
        <FilterChip
          href="/planner/mistakes?source=practice_test"
          active={params.source === "practice_test"}
        >
          Practice tests
        </FilterChip>
        <FilterChip
          href="/planner/mistakes?source=book"
          active={params.source === "book"}
        >
          Books
        </FilterChip>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-medium">
          {editing ? "Edit entry" : "New entry"}
        </h2>
        <MistakeForm
          key={editing?.id ?? "new"}
          initial={
            editing
              ? {
                  id: editing.id,
                  sourceType: editing.source_type,
                  section: editing.section,
                  topic: editing.topic,
                  questionReference: editing.question_reference ?? "",
                  errorCategory: editing.error_category as MistakeErrorCategory,
                  whyError: editing.why_error,
                  correctReasoning: editing.correct_reasoning,
                  lessonToRemember: editing.lesson_to_remember,
                  wasGuessed: editing.was_guessed,
                  wasRetried: editing.was_retried,
                  retryCorrect: editing.retry_correct,
                }
              : undefined
          }
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">Entries</h2>
        {(mistakes ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No mistakes logged yet. Capture the next miss while it&apos;s fresh.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {(mistakes ?? []).map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-foreground/10 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {m.section === "math" ? "Math" : "Reading & Writing"} ·{" "}
                      {m.topic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.source_type === "practice_test"
                        ? "Practice test"
                        : "Book"}{" "}
                      ·{" "}
                      {MISTAKE_ERROR_CATEGORY_LABELS[
                        m.error_category as MistakeErrorCategory
                      ] ?? m.error_category}
                      {m.question_reference ? ` · ${m.question_reference}` : ""}
                    </p>
                  </div>
                  <Link
                    href={`/planner/mistakes?edit=${m.id}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                {m.lesson_to_remember ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {m.lesson_to_remember}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1 text-sm",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
