"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { deleteMistake, saveMistake } from "@/app/planner/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField, TextAreaField, SelectField } from "@/components/site/form-field";
import { Button } from "@/components/ui/button";
import {
  MISTAKE_ERROR_CATEGORIES,
  MISTAKE_ERROR_CATEGORY_LABELS,
} from "@/lib/planner/types";

const SECTION_OPTIONS = [
  { value: "math", label: "Math" },
  { value: "reading_writing", label: "Reading and Writing" },
];

const SOURCE_OPTIONS = [
  { value: "practice_test", label: "Practice test" },
  { value: "book", label: "Book / chapter" },
];

const TOPIC_OPTIONS = [
  "Algebra",
  "Advanced math",
  "Problem solving & data",
  "Geometry & trigonometry",
  "Grammar / conventions",
  "Transitions",
  "Punctuation",
  "Reading comprehension",
  "Vocabulary in context",
  "Other",
].map((t) => ({ value: t, label: t }));

const BOOL_OPTIONS = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
];

export type MistakeFormValues = {
  id?: string;
  sourceType: "practice_test" | "book";
  section: "math" | "reading_writing";
  topic: string;
  questionReference: string;
  errorCategory: (typeof MISTAKE_ERROR_CATEGORIES)[number];
  whyError: string;
  correctReasoning: string;
  lessonToRemember: string;
  wasGuessed: boolean;
  wasRetried: boolean;
  retryCorrect: boolean | null;
};

type MistakeFormProps = {
  initial?: MistakeFormValues;
};

export function MistakeForm({ initial }: MistakeFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [sourceType, setSourceType] = React.useState(initial?.sourceType ?? "practice_test");
  const [section, setSection] = React.useState(initial?.section ?? "math");
  const [topic, setTopic] = React.useState(initial?.topic ?? "Algebra");
  const [errorCategory, setErrorCategory] = React.useState(
    initial?.errorCategory ?? "content_gap"
  );
  const [wasGuessed, setWasGuessed] = React.useState(initial?.wasGuessed ?? false);
  const [wasRetried, setWasRetried] = React.useState(initial?.wasRetried ?? false);
  const [retryCorrect, setRetryCorrect] = React.useState<boolean | null>(
    initial?.retryCorrect ?? null
  );

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await saveMistake(
      {
        sourceType,
        section,
        topic,
        questionReference: String(formData.get("questionReference") ?? ""),
        errorCategory,
        whyError: String(formData.get("whyError") ?? ""),
        correctReasoning: String(formData.get("correctReasoning") ?? ""),
        lessonToRemember: String(formData.get("lessonToRemember") ?? ""),
        wasGuessed,
        wasRetried,
        retryCorrect: wasRetried ? retryCorrect : null,
      },
      initial?.id ?? null
    );
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/planner/mistakes");
    router.refresh();
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm("Delete this mistake entry?")) return;
    const result = await deleteMistake(initial.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/planner/mistakes");
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
      <SelectField
        label="Source"
        value={sourceType}
        onChange={(e) =>
          setSourceType(e.target.value as "practice_test" | "book")
        }
        options={SOURCE_OPTIONS}
        required
      />
      <SelectField
        label="Section"
        value={section}
        onChange={(e) =>
          setSection(e.target.value as "math" | "reading_writing")
        }
        options={SECTION_OPTIONS}
        required
      />
      <SelectField
        label="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        options={TOPIC_OPTIONS}
        required
      />
      <TextField
        label="Question reference"
        name="questionReference"
        defaultValue={initial?.questionReference ?? ""}
        description="Optional — e.g. PT3 Math #14 or Book Ch. 2 #8"
      />
      <SelectField
        label="Error category"
        value={errorCategory}
        onChange={(e) =>
          setErrorCategory(
            e.target.value as (typeof MISTAKE_ERROR_CATEGORIES)[number]
          )
        }
        options={MISTAKE_ERROR_CATEGORIES.map((c) => ({
          value: c,
          label: MISTAKE_ERROR_CATEGORY_LABELS[c],
        }))}
        required
      />
      <TextAreaField
        label="Why the error happened"
        name="whyError"
        defaultValue={initial?.whyError ?? ""}
      />
      <TextAreaField
        label="Correct reasoning"
        name="correctReasoning"
        defaultValue={initial?.correctReasoning ?? ""}
      />
      <TextAreaField
        label="Rule or lesson to remember"
        name="lessonToRemember"
        defaultValue={initial?.lessonToRemember ?? ""}
      />
      <SelectField
        label="Guessed?"
        value={String(wasGuessed)}
        onChange={(e) => setWasGuessed(e.target.value === "true")}
        options={BOOL_OPTIONS}
      />
      <SelectField
        label="Retried later?"
        value={String(wasRetried)}
        onChange={(e) => {
          const next = e.target.value === "true";
          setWasRetried(next);
          if (!next) setRetryCorrect(null);
          else if (retryCorrect === null) setRetryCorrect(false);
        }}
        options={BOOL_OPTIONS}
      />
      {wasRetried ? (
        <SelectField
          label="Retry correct?"
          value={String(retryCorrect ?? false)}
          onChange={(e) => setRetryCorrect(e.target.value === "true")}
          options={BOOL_OPTIONS}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <SubmitButton>{initial?.id ? "Update entry" : "Save entry"}</SubmitButton>
        {initial?.id ? (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
