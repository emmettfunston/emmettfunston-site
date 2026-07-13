"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, Loader2Icon, AlertCircleIcon } from "lucide-react";

import {
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/site/form-field";
import { submitCohortApplication } from "@/app/(marketing)/sat-admissions/apply/actions";
import {
  cohortApplicationSchema,
  type CohortApplicationInput,
} from "@/lib/schemas/apply";

// ---------------------------------------------------------------------------
// Local form state
// ---------------------------------------------------------------------------

type ApplyErrors = Partial<Record<keyof CohortApplicationInput, string>>;

const emptyForm: CohortApplicationInput = {
  student_first_name: "",
  student_last_name: "",
  student_email: "",
  student_phone: "",
  parent_name: "",
  parent_email: "",
  grade: "",
  high_school: "",
  current_score: "",
  target_score: "",
  next_test_date: "",
  gpa: "",
  course_rigor: "",
  target_colleges: "",
  intended_major: "",
  ed_ea_plans: "",
  extracurriculars: "",
  strongest_activity: "",
  weakest_part: "",
  package_interest: "",
  why_join: "",
  hours_per_week: "",
  biggest_goal: "",
  community_commitment: "" as CohortApplicationInput["community_commitment"],
  anything_else: "",
};

// ---------------------------------------------------------------------------
// Select option data
// ---------------------------------------------------------------------------

const gradeOptions = [
  { value: "9", label: "9th grade" },
  { value: "10", label: "10th grade" },
  { value: "11", label: "11th grade" },
  { value: "12", label: "12th grade" },
  { value: "gap", label: "Gap year" },
  { value: "other", label: "Other" },
];

const packageOptions = [
  { value: "sat_score_jump_lab", label: "SAT Score Jump Lab — $2,000" },
  { value: "elite_application_lab", label: "Elite Application Lab — $3,000" },
  {
    value: "elite_sat_admissions_cohort",
    label: "Elite SAT + Admissions Cohort — $4,500",
  },
  { value: "not_sure", label: "Not sure" },
];

const hoursOptions = [
  { value: "under_3", label: "Under 3 hours" },
  { value: "3_5", label: "3–5 hours" },
  { value: "5_8", label: "5–8 hours" },
  { value: "8_plus", label: "8+ hours" },
];

const commitmentOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-foreground/10 pt-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs tracking-widest text-muted-foreground">
          {step}
        </span>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Status = "idle" | "submitting" | "success" | "error";
const REDIRECT_TO = "/sat-admissions/thanks-apply";

export function ApplyForm() {
  const router = useRouter();
  const [values, setValues] = React.useState<CohortApplicationInput>(emptyForm);
  const [errors, setErrors] = React.useState<ApplyErrors>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const errorSummaryRef = React.useRef<HTMLDivElement | null>(null);

  const setField = <K extends keyof CohortApplicationInput>(
    key: K,
    value: CohortApplicationInput[K]
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
    const parsed = cohortApplicationSchema.safeParse(values);
    if (!parsed.success) {
      const flat: ApplyErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CohortApplicationInput | undefined;
        if (key && !flat[key]) {
          flat[key] = issue.message;
        }
      }
      setErrors(flat);
      setStatus("idle");
      requestAnimationFrame(() => {
        errorSummaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }

    setStatus("submitting");
    setErrors({});

    startTransition(async () => {
      try {
        const result = await submitCohortApplication(values);

        if (!result.ok) {
          setStatus("error");
          setFormError(result.error);
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
            requestAnimationFrame(() => {
              errorSummaryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          }
          return;
        }

        setStatus("success");
        router.push(REDIRECT_TO);
      } catch (err) {
        console.error("[ApplyForm] submission threw:", err);
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

  const errorCount = Object.keys(errors).length;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="flex flex-col gap-10"
    >
      {/* 1. Student info */}
      <FormSection step="01 · Student info" title="Who's applying?">
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
          label="Student phone"
          name="student_phone"
          type="tel"
          description="Optional"
          value={values.student_phone ?? ""}
          onChange={(e) => setField("student_phone", e.target.value)}
          error={errors.student_phone}
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
        />
        <SelectField
          label="Grade"
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
      </FormSection>

      {/* 2. Academic info */}
      <FormSection step="02 · Academic info" title="Where you stand today.">
        <TextField
          label="Current SAT / PSAT / ACT score"
          name="current_score"
          required
          placeholder="e.g. 1390 (SAT) or 30 (ACT)"
          value={values.current_score}
          onChange={(e) => setField("current_score", e.target.value)}
          error={errors.current_score}
          disabled={disabled}
        />
        <TextField
          label="Target SAT score"
          name="target_score"
          required
          placeholder="e.g. 1520"
          value={values.target_score}
          onChange={(e) => setField("target_score", e.target.value)}
          error={errors.target_score}
          disabled={disabled}
        />
        <TextField
          label="Next test date"
          name="next_test_date"
          type="date"
          description="Optional"
          value={values.next_test_date ?? ""}
          onChange={(e) => setField("next_test_date", e.target.value)}
          error={errors.next_test_date}
          disabled={disabled}
        />
        <TextField
          label="GPA"
          name="gpa"
          description="Optional (unweighted or weighted — just note which)"
          placeholder="e.g. 3.92 UW / 4.5 W"
          value={values.gpa ?? ""}
          onChange={(e) => setField("gpa", e.target.value)}
          error={errors.gpa}
          disabled={disabled}
        />
        <TextAreaField
          label="Course rigor / AP / IB / Honors"
          name="course_rigor"
          description="Optional — list your APs, IB courses, and Honors classes"
          placeholder="AP Calc BC, AP Physics C, AP Lang, Honors Chem..."
          value={values.course_rigor ?? ""}
          onChange={(e) => setField("course_rigor", e.target.value)}
          error={errors.course_rigor}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
      </FormSection>

      {/* 3. College goals */}
      <FormSection step="03 · College goals" title="Where you're headed.">
        <TextAreaField
          label="Target colleges"
          name="target_colleges"
          required
          description="List 3–8 schools the student is seriously considering."
          placeholder="Northwestern, Michigan, UCLA, Duke, ..."
          value={values.target_colleges}
          onChange={(e) => setField("target_colleges", e.target.value)}
          error={errors.target_colleges}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextAreaField
          label="Intended major or academic interests"
          name="intended_major"
          required
          placeholder="Electrical Engineering, CS, Bio + pre-med, ..."
          value={values.intended_major}
          onChange={(e) => setField("intended_major", e.target.value)}
          error={errors.intended_major}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextField
          label="Early Decision / Early Action plans"
          name="ed_ea_plans"
          description="Optional — any ED or EA schools already on the radar"
          placeholder="e.g. ED Northwestern, EA UMich"
          value={values.ed_ea_plans ?? ""}
          onChange={(e) => setField("ed_ea_plans", e.target.value)}
          error={errors.ed_ea_plans}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
      </FormSection>

      {/* 4. Activities */}
      <FormSection
        step="04 · Activities"
        title="What you're doing outside the classroom."
      >
        <TextAreaField
          label="Current extracurriculars"
          name="extracurriculars"
          required
          description="List the activities the student is currently involved in."
          placeholder="Robotics captain, JV soccer, tutoring nonprofit, drums..."
          value={values.extracurriculars}
          onChange={(e) => setField("extracurriculars", e.target.value)}
          error={errors.extracurriculars}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextAreaField
          label="Strongest activity"
          name="strongest_activity"
          description="The one you'd defend hardest in an interview."
          placeholder="Robotics team captain — led our regional-winning team..."
          value={values.strongest_activity ?? ""}
          onChange={(e) => setField("strongest_activity", e.target.value)}
          error={errors.strongest_activity}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextAreaField
          label="Weakest part of current application"
          name="weakest_part"
          description="Honest self-assessment — where do you feel the application is weakest right now?"
          placeholder="Essays haven't been started, activities feel scattered, ..."
          value={values.weakest_part ?? ""}
          onChange={(e) => setField("weakest_part", e.target.value)}
          error={errors.weakest_part}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
      </FormSection>

      {/* 5. Program fit */}
      <FormSection
        step="05 · Program fit"
        title="Why this program, and how you'll show up."
      >
        <SelectField
          label="Which package are you most interested in?"
          name="package_interest"
          required
          placeholder="Select a package"
          options={packageOptions}
          value={values.package_interest}
          onChange={(e) => setField("package_interest", e.target.value)}
          error={errors.package_interest}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextAreaField
          label="Why do you want to join?"
          name="why_join"
          required
          placeholder="Tell us what's happening in the next 12 months and what you want out of coaching."
          value={values.why_join}
          onChange={(e) => setField("why_join", e.target.value)}
          error={errors.why_join}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <SelectField
          label="How many hours per week can you commit?"
          name="hours_per_week"
          required
          placeholder="Select hours"
          options={hoursOptions}
          value={values.hours_per_week}
          onChange={(e) => setField("hours_per_week", e.target.value)}
          error={errors.hours_per_week}
          disabled={disabled}
        />
        <SelectField
          label="Willing to participate in a serious private Discord / community?"
          name="community_commitment"
          required
          placeholder="Select an answer"
          options={commitmentOptions}
          value={values.community_commitment}
          onChange={(e) =>
            setField(
              "community_commitment",
              e.target.value as CohortApplicationInput["community_commitment"]
            )
          }
          error={errors.community_commitment}
          disabled={disabled}
        />
        <TextAreaField
          label="What is your biggest goal for the next 3–6 months?"
          name="biggest_goal"
          required
          placeholder="Concrete goal — e.g. hit 1500+ by March SAT, finalize Common App essay by August."
          value={values.biggest_goal}
          onChange={(e) => setField("biggest_goal", e.target.value)}
          error={errors.biggest_goal}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
        <TextAreaField
          label="Anything else we should know?"
          name="anything_else"
          description="Optional"
          value={values.anything_else ?? ""}
          onChange={(e) => setField("anything_else", e.target.value)}
          error={errors.anything_else}
          disabled={disabled}
          wrapperClassName="sm:col-span-2"
        />
      </FormSection>

      {/* Error summary + submit */}
      <div ref={errorSummaryRef} className="flex flex-col gap-4">
        {errorCount > 0 ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>
              {errorCount === 1
                ? "1 field needs your attention above."
                : `${errorCount} fields need your attention above.`}
            </span>
          </div>
        ) : null}

        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground sm:max-w-md">
            Submitting does not enroll you. Applications are reviewed personally; strong-fit applicants may be invited to a short interview.
          </p>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Submitting application...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2Icon className="size-4" />
                Submitted — redirecting...
              </>
            ) : (
              <>Submit application</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
