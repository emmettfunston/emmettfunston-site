"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { savePracticeTest } from "@/app/planner/actions";
import { ScoreSelect } from "@/components/planner/score-select";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField, TextAreaField, SelectField } from "@/components/site/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { localTodayIso } from "@/lib/planner/dates";

type PracticeTestFormProps = {
  timezone: string;
  assignmentOptions: { value: string; label: string }[];
  defaultAssignmentId?: string | null;
};

export function PracticeTestForm({
  timezone,
  assignmentOptions,
  defaultAssignmentId = null,
}: PracticeTestFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [mathScore, setMathScore] = React.useState(600);
  const [rwScore, setRwScore] = React.useState(600);
  const [mistakesReviewed, setMistakesReviewed] = React.useState(false);
  const [assignmentId, setAssignmentId] = React.useState(
    defaultAssignmentId ?? ""
  );

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await savePracticeTest({
      testDate: String(formData.get("testDate") ?? ""),
      testName: String(formData.get("testName") ?? ""),
      mathScore,
      rwScore,
      mistakesReviewed,
      notes: String(formData.get("notes") ?? ""),
      assignmentId: assignmentId || null,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/planner/practice-tests");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="flex max-w-lg flex-col gap-4">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <TextField
        label="Test date"
        name="testDate"
        type="date"
        required
        defaultValue={localTodayIso(timezone)}
      />
      <TextField
        label="Practice-test name or number"
        name="testName"
        required
        placeholder="Practice Test 1"
      />
      <ScoreSelect
        label="Math score"
        value={mathScore}
        onChange={setMathScore}
        required
      />
      <ScoreSelect
        label="Reading and Writing score"
        value={rwScore}
        onChange={setRwScore}
        required
      />
      <p className="text-sm text-muted-foreground">
        Total (auto):{" "}
        <span className="font-medium text-foreground">{mathScore + rwScore}</span>
      </p>
      {assignmentOptions.length > 0 ? (
        <SelectField
          label="Link Saturday assignment (optional)"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          options={[
            { value: "", label: "No linked assignment" },
            ...assignmentOptions,
          ]}
        />
      ) : null}
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={mistakesReviewed}
          onCheckedChange={(v) => setMistakesReviewed(v === true)}
        />
        All mistakes were reviewed
      </label>
      <TextAreaField label="Notes" name="notes" />
      <SubmitButton>Save practice test</SubmitButton>
    </form>
  );
}
