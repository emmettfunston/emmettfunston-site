"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  activatePlanAction,
  getBookRecommendations,
  previewPlanAction,
  saveOnboardingProgress,
} from "@/app/planner/actions";
import { AvailabilityGrid } from "@/components/planner/availability-grid";
import { BookRecommendationCard } from "@/components/planner/book-recommendation-card";
import { ScoreSelect } from "@/components/planner/score-select";
import { Button } from "@/components/ui/button";
import type {
  BookRecommendation,
  DayAvailability,
  GeneratedPlan,
  PlannerBook,
  Weekday,
} from "@/lib/planner/types";
import {
  DEFAULT_STUDY_HOURS,
  SATURDAY,
  WEEKDAYS,
} from "@/lib/planner/types";
import { localTodayIso } from "@/lib/planner/dates";
import { TextField } from "@/components/site/form-field";

const STEPS = [
  "Scores",
  "Target & date",
  "Books",
  "Availability",
  "Preview",
] as const;

type SelectedBookState = {
  bookId: string;
  includedInPlan: boolean;
  recommendationLevel: BookRecommendation["level"];
  recommendationReason: string;
};

type WizardState = {
  currentMathScore: number;
  currentRwScore: number;
  targetTotalScore: number;
  planStartDate: string;
  testDate: string;
  timezone: string;
  availability: DayAvailability[];
  selectedBooks: SelectedBookState[];
};

function defaultAvailability(): DayAvailability[] {
  return WEEKDAYS.map((weekday) => {
    if (weekday === SATURDAY) {
      return { weekday: SATURDAY, available: false, studyHours: 0 };
    }
    if (weekday === 0) {
      return { weekday: 0 as Weekday, available: false, studyHours: 0 };
    }
    return {
      weekday,
      available: true,
      studyHours: DEFAULT_STUDY_HOURS,
    };
  });
}

type OnboardingWizardProps = {
  catalog: PlannerBook[];
  initial: Partial<WizardState> & {
    recommendations?: BookRecommendation[];
  };
};

export function OnboardingWizard({ catalog, initial }: OnboardingWizardProps) {
  const router = useRouter();
  const today = localTodayIso(
    initial.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<
    BookRecommendation[]
  >(initial.recommendations ?? []);
  const [preview, setPreview] = React.useState<{
    plan: GeneratedPlan;
    selectedBooks: {
      id: string;
      title: string;
      category: string;
      chapterCount: number;
    }[];
  } | null>(null);

  const [state, setState] = React.useState<WizardState>(() => ({
    currentMathScore: initial.currentMathScore ?? 600,
    currentRwScore: initial.currentRwScore ?? 600,
    targetTotalScore: initial.targetTotalScore ?? 1400,
    planStartDate: initial.planStartDate ?? today,
    testDate: initial.testDate ?? "",
    timezone:
      initial.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "America/Los_Angeles",
    availability: initial.availability ?? defaultAvailability(),
    selectedBooks: initial.selectedBooks ?? [],
  }));

  function payload() {
    return {
      ...state,
      selectedBooks: state.selectedBooks,
    };
  }

  async function ensureRecommendations() {
    const result = await getBookRecommendations({
      currentMathScore: state.currentMathScore,
      currentRwScore: state.currentRwScore,
      targetTotalScore: state.targetTotalScore,
    });
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    const data = result.data as {
      recommendations: BookRecommendation[];
    };
    setRecommendations(data.recommendations);
    setState((prev) => {
      const byId = new Map(prev.selectedBooks.map((b) => [b.bookId, b]));
      return {
        ...prev,
        selectedBooks: data.recommendations.map((r) => {
          const existing = byId.get(r.bookId);
          return {
            bookId: r.bookId,
            includedInPlan: existing?.includedInPlan ?? r.includedInPlan,
            recommendationLevel: r.level,
            recommendationReason: r.reason,
          };
        }),
      };
    });
    return true;
  }

  async function goNext() {
    setError(null);
    setPending(true);
    try {
      if (step === 0) {
        if (state.targetTotalScore < state.currentMathScore + state.currentRwScore) {
          // soft warning only — still allow continue on next step
        }
        setStep(1);
        return;
      }
      if (step === 1) {
        if (!state.testDate || state.testDate < state.planStartDate) {
          setError("Choose a test date on or after your plan start date.");
          return;
        }
        const ok = await ensureRecommendations();
        if (!ok) return;
        setStep(2);
        return;
      }
      if (step === 2) {
        if (!state.selectedBooks.some((b) => b.includedInPlan)) {
          setError("Include at least one book in your plan.");
          return;
        }
        setStep(3);
        return;
      }
      if (step === 3) {
        if (!state.availability.some((d) => d.weekday !== SATURDAY && d.available)) {
          setError("Select at least one available study day.");
          return;
        }
        const result = await previewPlanAction(payload());
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setPreview(result.data as typeof preview);
        setStep(4);
        return;
      }
    } finally {
      setPending(false);
    }
  }

  async function handleSave() {
    setError(null);
    setPending(true);
    try {
      const result = await saveOnboardingProgress(payload());
      if (!result.ok) {
        setError(result.error);
        return;
      }
    } finally {
      setPending(false);
    }
  }

  async function handleActivate() {
    setError(null);
    setPending(true);
    const result = await activatePlanAction(payload());
    // Successful activation redirects server-side. If we get a result, it failed.
    if (result && !result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Set up your study plan
        </h1>
        <ol className="flex flex-wrap gap-2" aria-label="Onboarding progress">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={
                i === step
                  ? "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
                  : i < step
                    ? "rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    : "rounded-full px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      {step === 0 ? (
        <section className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Enter your current section scores. Use the selectors — scores move
            in steps of 10.
          </p>
          <ScoreSelect
            label="Current SAT Math score"
            value={state.currentMathScore}
            onChange={(currentMathScore) =>
              setState((s) => ({ ...s, currentMathScore }))
            }
            required
          />
          <ScoreSelect
            label="Current SAT Reading and Writing score"
            value={state.currentRwScore}
            onChange={(currentRwScore) =>
              setState((s) => ({ ...s, currentRwScore }))
            }
            required
          />
        </section>
      ) : null}

      {step === 1 ? (
        <section className="flex flex-col gap-4">
          <ScoreSelect
            label="Target total SAT score"
            kind="total"
            value={state.targetTotalScore}
            onChange={(targetTotalScore) =>
              setState((s) => ({ ...s, targetTotalScore }))
            }
            required
          />
          <TextField
            label="Plan start date"
            type="date"
            value={state.planStartDate}
            onChange={(e) =>
              setState((s) => ({ ...s, planStartDate: e.target.value }))
            }
            required
          />
          <TextField
            label="SAT test date"
            type="date"
            value={state.testDate}
            onChange={(e) =>
              setState((s) => ({ ...s, testDate: e.target.value }))
            }
            required
          />
          <TextField
            label="Timezone"
            value={state.timezone}
            onChange={(e) =>
              setState((s) => ({ ...s, timezone: e.target.value }))
            }
            description="Used for today / overdue calculations."
            required
          />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            We suggest books based on your scores. Toggle Include in My Plan for
            each one — you are not asked about purchasing.
          </p>
          {recommendations.map((rec) => {
            const book = catalog.find((b) => b.id === rec.bookId);
            if (!book) return null;
            const selected = state.selectedBooks.find((b) => b.bookId === rec.bookId);
            return (
              <BookRecommendationCard
                key={rec.bookId}
                book={book}
                recommendation={rec}
                included={selected?.includedInPlan ?? rec.includedInPlan}
                onIncludedChange={(includedInPlan) =>
                  setState((s) => ({
                    ...s,
                    selectedBooks: s.selectedBooks.map((b) =>
                      b.bookId === rec.bookId ? { ...b, includedInPlan } : b
                    ),
                  }))
                }
              />
            );
          })}
        </section>
      ) : null}

      {step === 3 ? (
        <section>
          <AvailabilityGrid
            value={state.availability}
            onChange={(availability) =>
              setState((s) => ({ ...s, availability }))
            }
          />
        </section>
      ) : null}

      {step === 4 && preview ? (
        <section className="flex flex-col gap-4">
          <div className="rounded-xl border border-foreground/10 p-5">
            <h2 className="font-heading text-lg font-medium">Plan preview</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Chapter assignments</dt>
                <dd className="font-medium">
                  {preview.plan.chaptersScheduled} / {preview.plan.chaptersSelected}{" "}
                  chapters
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Practice tests</dt>
                <dd className="font-medium">
                  {preview.plan.practiceTestsScheduled}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Review sessions</dt>
                <dd className="font-medium">
                  {preview.plan.reviewSessionsScheduled}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total assignments</dt>
                <dd className="font-medium">{preview.plan.assignments.length}</dd>
              </div>
            </dl>
            {preview.plan.cannotFinishAllChapters ? (
              <p
                role="status"
                className="mt-4 rounded-lg border border-foreground/15 bg-muted px-3 py-2 text-sm"
              >
                Your timeline does not have enough chapter slots to finish every
                selected book before test day. You can still activate — the plan
                will schedule what fits and continue with review sessions after
                chapters run out.
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Your schedule fits every selected chapter before test day.
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
              {preview.selectedBooks.map((b) => (
                <li key={b.id}>
                  {b.title} · {b.chapterCount} chapters
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
        <Button
          type="button"
          variant="ghost"
          disabled={pending || step === 0}
          onClick={() => {
            setError(null);
            setStep((s) => Math.max(0, s - 1));
          }}
        >
          Back
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleSave}
          >
            Save progress
          </Button>
          {step < 4 ? (
            <Button type="button" disabled={pending} onClick={goNext}>
              {pending ? "Working…" : "Continue"}
            </Button>
          ) : (
            <Button type="button" disabled={pending} onClick={handleActivate}>
              {pending ? "Activating…" : "Confirm and activate"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
