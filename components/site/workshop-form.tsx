"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, Loader2Icon, AlertCircleIcon } from "lucide-react";

import { TextField, SelectField } from "@/components/site/form-field";
import { registerForWorkshop } from "@/app/(marketing)/sat-admissions/workshop/actions";
import {
  workshopRegistrationSchema,
  type WorkshopRegistrationInput,
} from "@/lib/schemas/workshop";

// ---------------------------------------------------------------------------
// Local form state
// ---------------------------------------------------------------------------

type WorkshopErrors = Partial<Record<keyof WorkshopRegistrationInput, string>>;

const emptyForm: WorkshopRegistrationInput = {
  student_first_name: "",
  student_last_name: "",
  student_email: "",
  parent_name: "",
  parent_email: "",
  grade: "",
  high_school: "",
  current_score: "",
  target_score: "",
  target_colleges: "",
  main_interest: "",
  source: "",
};

const gradeOptions = [
  { value: "9", label: "9th grade" },
  { value: "10", label: "10th grade" },
  { value: "11", label: "11th grade" },
  { value: "12", label: "12th grade" },
  { value: "gap", label: "Gap year" },
  { value: "other", label: "Other" },
];

const interestOptions = [
  { value: "sat", label: "SAT Score Jump" },
  { value: "applications", label: "College Applications" },
  { value: "both", label: "Both" },
  { value: "unsure", label: "Not sure" },
];

const REDIRECT_TO = "/sat-admissions/thanks-workshop";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Status = "idle" | "submitting" | "success" | "error";

export function WorkshopForm() {
  const router = useRouter();
  const [values, setValues] = React.useState<WorkshopRegistrationInput>(emptyForm);
  const [errors, setErrors] = React.useState<WorkshopErrors>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const setField = <K extends keyof WorkshopRegistrationInput>(
    key: K,
    value: WorkshopRegistrationInput[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    // Client-side pre-validation using the shared schema. The server action
    // re-validates authoritatively before touching the database.
    const parsed = workshopRegistrationSchema.safeParse(values);
    if (!parsed.success) {
      const flat: WorkshopErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof WorkshopRegistrationInput | undefined;
        if (key && !flat[key]) {
          flat[key] = issue.message;
        }
      }
      setErrors(flat);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setErrors({});

    startTransition(async () => {
      try {
        const result = await registerForWorkshop(values);

        if (!result.ok) {
          setStatus("error");
          setFormError(result.error);
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
          return;
        }

        setStatus("success");
        router.push(REDIRECT_TO);
      } catch (err) {
        console.error("[WorkshopForm] submission threw:", err);
        setStatus("error");
        setFormError(
          "Something went wrong on our end. Please try again in a moment."
        );
      }
    });
  };

  const isSubmitting = status === "submitting" || isPending;
  const isSuccess = status === "success";
  const disabled = isSubmitting || isSuccess;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Student first name"
          name="student_first_name"
          required
          autoComplete="given-name"
          value={values.student_first_name}
          onChange={(e) => setField("student_first_name", e.target.value)}
          error={errors.student_first_name}
          disabled={disabled}
        />
        <TextField
          label="Student last name"
          name="student_last_name"
          required
          autoComplete="family-name"
          value={values.student_last_name}
          onChange={(e) => setField("student_last_name", e.target.value)}
          error={errors.student_last_name}
          disabled={disabled}
        />
        <TextField
          label="Student email"
          name="student_email"
          type="email"
          required
          autoComplete="email"
          value={values.student_email}
          onChange={(e) => setField("student_email", e.target.value)}
          error={errors.student_email}
          disabled={disabled}
        />
        <TextField
          label="Parent name"
          name="parent_name"
          required
          value={values.parent_name}
          onChange={(e) => setField("parent_name", e.target.value)}
          error={errors.parent_name}
          disabled={disabled}
        />
        <TextField
          label="Parent email"
          name="parent_email"
          type="email"
          required
          value={values.parent_email}
          onChange={(e) => setField("parent_email", e.target.value)}
          error={errors.parent_email}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />

        <SelectField
          label="Student grade"
          name="grade"
          required
          placeholder="Select grade"
          options={gradeOptions}
          value={values.grade}
          onChange={(e) => setField("grade", e.target.value)}
          error={errors.grade}
          disabled={disabled}
        />
        <TextField
          label="High school"
          name="high_school"
          required
          value={values.high_school}
          onChange={(e) => setField("high_school", e.target.value)}
          error={errors.high_school}
          disabled={disabled}
        />

        <TextField
          label="Current SAT / PSAT / ACT score"
          name="current_score"
          description="Optional"
          placeholder="e.g. 1390 (SAT) or 30 (ACT)"
          value={values.current_score ?? ""}
          onChange={(e) => setField("current_score", e.target.value)}
          error={errors.current_score}
          disabled={disabled}
        />
        <TextField
          label="Target SAT score"
          name="target_score"
          description="Optional"
          placeholder="e.g. 1520"
          value={values.target_score ?? ""}
          onChange={(e) => setField("target_score", e.target.value)}
          error={errors.target_score}
          disabled={disabled}
        />

        <TextField
          label="Target colleges"
          name="target_colleges"
          description="Optional — a few of the schools you're most seriously considering"
          placeholder="Northwestern, Michigan, UCLA, ..."
          value={values.target_colleges ?? ""}
          onChange={(e) => setField("target_colleges", e.target.value)}
          error={errors.target_colleges}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />

        <SelectField
          label="Main interest"
          name="main_interest"
          required
          placeholder="Select main interest"
          options={interestOptions}
          value={values.main_interest}
          onChange={(e) => setField("main_interest", e.target.value)}
          error={errors.main_interest}
          disabled={disabled}
        />
        <TextField
          label="How did you hear about this?"
          name="source"
          description="Optional"
          placeholder="Referral / Instagram / Google / Other"
          value={values.source ?? ""}
          onChange={(e) => setField("source", e.target.value)}
          error={errors.source}
          disabled={disabled}
        />
      </div>

      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Reserving your seat...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2Icon className="size-4" />
            Registered — redirecting...
          </>
        ) : (
          <>Register for the free workshop</>
        )}
      </button>

      <p className="text-xs text-muted-foreground">
        By registering, you agree to receive workshop info by email. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
