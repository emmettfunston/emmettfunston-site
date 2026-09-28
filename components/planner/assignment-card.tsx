"use client";

import { useTransition } from "react";

import { toggleAssignmentCompletion } from "@/app/planner/actions";
import type { AssignmentStatus } from "@/lib/planner/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AssignmentCardData = {
  id: string;
  assignmentDate: string;
  assignmentType: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
  sequenceOnDay: number;
  completedAt: string | null;
  bookTitle?: string | null;
  chapterNumber?: number | null;
  chapterTitle?: string | null;
  status: AssignmentStatus;
};

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  upcoming: "Upcoming",
  due_today: "Due today",
  overdue: "Overdue",
  completed: "Completed",
};

type AssignmentCardProps = {
  assignment: AssignmentCardData;
};

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const [pending, startTransition] = useTransition();
  const completed = assignment.completedAt !== null;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-foreground/10 p-4",
        assignment.status === "overdue" && "border-destructive/40",
        completed && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{STATUS_LABEL[assignment.status]}</Badge>
            <span className="text-xs text-muted-foreground">
              {assignment.assignmentDate}
              {assignment.assignmentType !== "practice_test"
                ? ` · #${assignment.sequenceOnDay}`
                : ""}
            </span>
          </div>
          <h3 className="font-heading text-sm font-medium leading-snug">
            {assignment.title}
          </h3>
          {assignment.bookTitle && assignment.chapterNumber ? (
            <p className="text-xs text-muted-foreground">
              {assignment.bookTitle} · Chapter {assignment.chapterNumber}
              {assignment.chapterTitle ? `: ${assignment.chapterTitle}` : ""}
            </p>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={completed}
            disabled={pending}
            onCheckedChange={(checked) => {
              startTransition(async () => {
                await toggleAssignmentCompletion({
                  assignmentId: assignment.id,
                  completed: checked === true,
                });
              });
            }}
            aria-label={`Mark ${assignment.title} complete`}
          />
          <span className="sr-only sm:not-sr-only sm:text-muted-foreground">
            Done
          </span>
        </label>
      </div>
      <p className="text-sm text-muted-foreground">{assignment.instructions}</p>
      <p className="text-xs text-muted-foreground">
        ~{assignment.estimatedMinutes} minutes
      </p>
    </article>
  );
}
