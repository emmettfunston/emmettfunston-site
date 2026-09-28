"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import {
  DEFAULT_STUDY_HOURS,
  MAX_STUDY_HOURS,
  MIN_STUDY_HOURS,
  RECOMMENDED_STUDY_HOURS,
} from "@/lib/planner/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HoursStepperProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  id?: string;
};

export function HoursStepper({
  value,
  onChange,
  disabled,
  id,
}: HoursStepperProps) {
  const hours = value || DEFAULT_STUDY_HOURS;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled || hours <= MIN_STUDY_HOURS}
          aria-label="Decrease study hours"
          onClick={() => onChange(Math.max(MIN_STUDY_HOURS, hours - 1))}
        >
          <MinusIcon />
        </Button>
        <output
          id={id}
          aria-live="polite"
          className={cn(
            "min-w-16 text-center text-base font-medium tabular-nums",
            hours === RECOMMENDED_STUDY_HOURS && "text-foreground"
          )}
        >
          {hours}h
        </output>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled || hours >= MAX_STUDY_HOURS}
          aria-label="Increase study hours"
          onClick={() => onChange(Math.min(MAX_STUDY_HOURS, hours + 1))}
        >
          <PlusIcon />
        </Button>
      </div>
      {hours === RECOMMENDED_STUDY_HOURS ? (
        <p className="text-xs font-medium text-foreground">Recommended</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {RECOMMENDED_STUDY_HOURS}h is recommended
        </p>
      )}
    </div>
  );
}
