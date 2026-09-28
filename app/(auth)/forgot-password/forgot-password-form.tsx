"use client";

import * as React from "react";

import { requestPasswordReset } from "@/app/(auth)/actions";
import { AUTH_IDLE_STATE } from "@/lib/auth/form-state";
import { AuthFormError, AuthFormSuccess } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField } from "@/components/site/form-field";

export function ForgotPasswordForm() {
  const [state, formAction] = React.useActionState(
    requestPasswordReset,
    AUTH_IDLE_STATE
  );

  if (state.ok && state.message) {
    return <AuthFormSuccess message={state.message} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <AuthFormError message={state.error} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors.email}
      />
      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}
