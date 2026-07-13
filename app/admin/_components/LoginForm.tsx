import { LockIcon, AlertCircleIcon } from "lucide-react";

import { signInAdmin } from "@/app/admin/actions";

type LoginFormProps = {
  error?: string;
  redirectTo?: string;
};

function errorMessage(error: string | undefined): string | null {
  if (!error) return null;
  switch (error) {
    case "missing":
      return "Please enter the admin password.";
    case "invalid":
      return "Incorrect password.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/**
 * Server-rendered login form. Submits directly to the signInAdmin server
 * action; no client JS required.
 */
export function LoginForm({ error, redirectTo }: LoginFormProps) {
  const message = errorMessage(error);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-xl bg-foreground text-background"
          >
            <LockIcon className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Admin
            </p>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Sign in to continue
            </h1>
          </div>
        </div>

        <form action={signInAdmin} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="redirect_to"
            value={redirectTo ?? "/admin"}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              autoFocus
              className="h-11 rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm"
            />
          </label>

          {message ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              <span>{message}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          MVP password gate. Proper multi-user auth (Supabase Auth, NextAuth, or
          Clerk) should replace this before this dashboard is used by more than
          one person.
        </p>
      </div>
    </div>
  );
}
