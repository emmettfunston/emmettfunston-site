"use client";

import * as React from "react";

import { signUp } from "@/app/(auth)/actions";
import { AUTH_IDLE_STATE } from "@/lib/auth/form-state";
import { AuthFormError, AuthFormSuccess } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField } from "@/components/site/form-field";

export function SignUpForm() {
  const [state, formAction] = React.useActionState(signUp, AUTH_IDLE_STATE);

  if (state.ok && state.message) {
    return <AuthFormSuccess message={state.message} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <AuthFormError message={state.error} />
      <TextField
        label="Name"
        name="displayName"
        autoComplete="name"
        description="Optional — how we should greet you."
        error={state.fieldErrors.displayName}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        description="At least 8 characters."
        error={state.fieldErrors.password}
      />
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
