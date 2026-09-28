import Link from "next/link";
import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign in",
};

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/planner";
  return raw;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your SAT Planner account."
      footer={
        <>
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm
        nextPath={safeNextPath(params.next)}
        initialError={params.error ?? null}
      />
    </AuthCard>
  );
}
