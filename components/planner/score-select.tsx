"use client";

import {
  SECTION_SCORE_OPTIONS,
  TOTAL_SCORE_OPTIONS,
} from "@/lib/planner/types";
import { SelectField } from "@/components/site/form-field";

type ScoreSelectProps = {
  label: string;
  name?: string;
  value: number;
  onChange: (value: number) => void;
  kind?: "section" | "total";
  description?: string;
  error?: string;
  required?: boolean;
};

export function ScoreSelect({
  label,
  name,
  value,
  onChange,
  kind = "section",
  description,
  error,
  required,
}: ScoreSelectProps) {
  const options = (kind === "total" ? TOTAL_SCORE_OPTIONS : SECTION_SCORE_OPTIONS).map(
    (n) => ({ value: String(n), label: String(n) })
  );

  return (
    <SelectField
      label={label}
      name={name}
      required={required}
      description={description}
      error={error}
      value={String(value)}
      options={options}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
