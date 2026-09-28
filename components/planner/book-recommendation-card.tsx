"use client";

import type { BookRecommendation, PlannerBook } from "@/lib/planner/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVEL_LABEL: Record<BookRecommendation["level"], string> = {
  highly_recommended: "Highly Recommended",
  recommended: "Recommended",
  optional: "Optional Reinforcement",
};

type BookRecommendationCardProps = {
  book: PlannerBook;
  recommendation: BookRecommendation;
  included: boolean;
  onIncludedChange: (included: boolean) => void;
};

export function BookRecommendationCard({
  book,
  recommendation,
  included,
  onIncludedChange,
}: BookRecommendationCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-foreground/10 p-5",
        included && "ring-1 ring-foreground/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-base font-medium">{book.title}</h3>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {book.category} · {book.chapters.length} chapters
          </p>
        </div>
        <Badge variant="outline">{LEVEL_LABEL[recommendation.level]}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
      <label className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Include in My Plan</span>
        <button
          type="button"
          role="switch"
          aria-checked={included}
          onClick={() => onIncludedChange(!included)}
          className={cn(
            "relative h-7 w-12 rounded-full transition-colors",
            included ? "bg-foreground" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-6 rounded-full bg-background transition-transform",
              included && "translate-x-5"
            )}
          />
        </button>
      </label>
    </article>
  );
}
