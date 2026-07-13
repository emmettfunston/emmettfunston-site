"use client";

import * as React from "react";
import { CheckIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";

import { updateApplicationStatus } from "@/app/admin/actions";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/admin/application";
import { cn } from "@/lib/utils";

type StatusSelectProps = {
  id: string;
  value: ApplicationStatus;
};

const STATUS_TONES: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-900 border-blue-200",
  contacted: "bg-amber-100 text-amber-900 border-amber-200",
  interview: "bg-violet-100 text-violet-900 border-violet-200",
  accepted: "bg-emerald-100 text-emerald-900 border-emerald-200",
  rejected: "bg-rose-100 text-rose-900 border-rose-200",
  enrolled: "bg-foreground text-background border-foreground",
};

type Feedback =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

/**
 * Inline status dropdown for a single application row. Uses `useOptimistic`
 * so the select reflects the pending value during the server round-trip and
 * automatically reverts on error (React unwinds when the transition ends
 * without the base `value` prop advancing).
 */
export function StatusSelect({ id, value }: StatusSelectProps) {
  const [feedback, setFeedback] = React.useState<Feedback>({ kind: "idle" });
  const [isPending, startTransition] = React.useTransition();
  const [optimistic, setOptimistic] = React.useOptimistic<
    ApplicationStatus,
    ApplicationStatus
  >(value, (_prev, next) => next);

  const handleChange = (next: ApplicationStatus) => {
    if (next === optimistic) return;

    startTransition(async () => {
      setOptimistic(next);
      setFeedback({ kind: "idle" });
      try {
        const result = await updateApplicationStatus(id, next);
        if (!result.ok) {
          setFeedback({ kind: "error", message: result.error });
          return;
        }
        setFeedback({ kind: "saved" });
        setTimeout(() => setFeedback({ kind: "idle" }), 1200);
      } catch (err) {
        setFeedback({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Update failed. Try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <select
          value={optimistic}
          disabled={isPending}
          onChange={(e) => handleChange(e.target.value as ApplicationStatus)}
          className={cn(
            "appearance-none rounded-full border px-3 py-1 pr-7 text-xs font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70",
            STATUS_TONES[optimistic]
          )}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s} className="text-foreground">
              {s}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
          {isPending ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : feedback.kind === "saved" ? (
            <CheckIcon className="size-3" />
          ) : (
            <svg aria-hidden viewBox="0 0 20 20" className="size-3 opacity-70">
              <path
                d="M5.5 8l4.5 4.5L14.5 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
      {feedback.kind === "error" ? (
        <span
          role="alert"
          className="flex items-center gap-1 text-[11px] text-destructive"
        >
          <AlertCircleIcon className="size-3" />
          {feedback.message}
        </span>
      ) : null}
    </div>
  );
}
