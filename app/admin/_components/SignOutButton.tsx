import { LogOutIcon } from "lucide-react";

import { signOutAdmin } from "@/app/admin/actions";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <LogOutIcon className="size-3.5" />
        Sign out
      </button>
    </form>
  );
}
