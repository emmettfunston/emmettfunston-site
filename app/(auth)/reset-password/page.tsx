import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/session";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
};

/**
 * Users land here from the recovery-link email (which establishes a session
 * via /auth/confirm). Without a session, there is nothing to reset — send
 * them to sign in.
 */
export default async function ResetPasswordPage() {
  await requireUser("/reset-password");

  return (
    <AuthCard
      title="Choose a new password"
      description="You're signed in via your reset link. Set a new password to finish."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
