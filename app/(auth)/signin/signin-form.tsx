"use client";

import * as React from "react";
import Link from "next/link";

import { signIn } from "@/app/(auth)/actions";
import { AUTH_IDLE_STATE } from "@/lib/auth/form-state";
import { AuthFormError } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextField } from "@/components/site/form-field";

type SignInFormProps = {
  nextPath: string;
  /** Error passed via query string (e.g. from the auth confirm route). */
  initialError: string | null;
};

export function SignInForm({ nextPath, initialError }: SignInFormProps) {
  const [state, formAction] = React.useActionState(signIn, AUTH_IDLE_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <AuthFormError message={state.error ?? initialError} />
      <input type="hidden" name="next" value={nextPath} />
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
        autoComplete="current-password"
        required
        error={state.fieldErrors.password}
      />
      <SubmitButton>Sign in</SubmitButton>
      <p className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
