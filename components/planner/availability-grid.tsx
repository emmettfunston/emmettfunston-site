"use client";

import { WEEKDAY_LABELS } from "@/lib/planner/dates";
import type { DayAvailability, Weekday } from "@/lib/planner/types";
import {
  DEFAULT_STUDY_HOURS,
  SATURDAY,
  WEEKDAYS,
} from "@/lib/planner/types";
import { HoursStepper } from "@/components/planner/hours-stepper";
import { cn } from "@/lib/utils";

type AvailabilityGridProps = {
  value: readonly DayAvailability[];
  onChange: (next: DayAvailability[]) => void;
};

function dayFor(
  value: readonly DayAvailability[],
  weekday: Weekday
): DayAvailability {
  return (
    value.find((d) => d.weekday === weekday) ?? {
      weekday,
      available: weekday !== SATURDAY && weekday !== 0,
      studyHours:
        weekday === SATURDAY || weekday === 0 ? 0 : DEFAULT_STUDY_HOURS,
    }
  );
}

export function AvailabilityGrid({ value, onChange }: AvailabilityGridProps) {
  function update(weekday: Weekday, patch: Partial<DayAvailability>) {
    const next = WEEKDAYS.map((wd) => {
      const current = dayFor(value, wd);
      if (wd !== weekday) return current;
      if (wd === SATURDAY) {
        return { weekday: SATURDAY, available: false, studyHours: 0 };
      }
      const available = patch.available ?? current.available;
      let studyHours = patch.studyHours ?? current.studyHours;
      if (!available) studyHours = 0;
      if (available && studyHours < 1) studyHours = DEFAULT_STUDY_HOURS;
      return { weekday: wd, available, studyHours };
    });
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Each hour represents approximately one full prep-book chapter, including
        reading the lesson and completing every practice problem.
      </p>
      <ul className="flex flex-col gap-3">
        {WEEKDAYS.map((weekday) => {
          const day = dayFor(value, weekday);
          const isSaturday = weekday === SATURDAY;
          return (
            <li
              key={weekday}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-foreground/10 p-4 sm:flex-row sm:items-center sm:justify-between",
                isSaturday && "bg-muted/40"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {WEEKDAY_LABELS[weekday]}
                </span>
                {isSaturday ? (
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Practice Test Day — locked
                  </span>
                ) : null}
              </div>

              {isSaturday ? (
                <p className="text-sm text-muted-foreground">
                  Full SAT practice exam every Saturday
                </p>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={day.available}
                      aria-label={`${WEEKDAY_LABELS[weekday]} available`}
                      onClick={() =>
                        update(weekday, { available: !day.available })
                      }
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors",
                        day.available ? "bg-foreground" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-6 rounded-full bg-background transition-transform",
                          day.available && "translate-x-5"
                        )}
                      />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {day.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  {day.available ? (
                    <HoursStepper
                      value={day.studyHours}
                      onChange={(studyHours) => update(weekday, { studyHours })}
                    />
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
