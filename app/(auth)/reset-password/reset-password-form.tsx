"use client";

import * as React from "react";

import { resetPassword } from "@/app/(auth)/actions";
import { AUTH_IDLE_STATE } from "@/lib/auth/form-state";
import { AuthFormError } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField } from "@/components/site/form-field";

export function ResetPasswordForm() {
  const [state, formAction] = React.useActionState(
    resetPassword,
    AUTH_IDLE_STATE
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <AuthFormError message={state.error} />
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        description="At least 8 characters."
        error={state.fieldErrors.password}
      />
      <TextField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors.confirmPassword}
      />
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
