"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Submit button that shows a pending spinner while the enclosing form's
 * server action runs. Must be rendered inside a <form>.
 */
export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-11 w-full text-base sm:text-sm"
    >
      {pending ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  );
}
