"use client";

import * as React from "react";
import {
  CheckIcon,
  Loader2Icon,
  AlertCircleIcon,
  PencilIcon,
} from "lucide-react";

import { updateApplicationNotes } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type NotesEditorProps = {
  id: string;
  initialValue: string | null;
};

type State =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function NotesEditor({ id, initialValue }: NotesEditorProps) {
  const [value, setValue] = React.useState(initialValue ?? "");
  const [savedValue, setSavedValue] = React.useState(initialValue ?? "");
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<State>({ kind: "idle" });
  const [isPending, startTransition] = React.useTransition();

  const dirty = value !== savedValue;
  const busy = state.kind === "saving" || isPending;

  const handleSave = () => {
    if (!dirty || busy) return;
    setState({ kind: "saving" });
    const attempted = value;
    startTransition(async () => {
      try {
        const result = await updateApplicationNotes(id, attempted);
        if (!result.ok) {
          setState({ kind: "error", message: result.error });
          return;
        }
        setSavedValue(attempted);
        setState({ kind: "saved" });
        setTimeout(() => setState({ kind: "idle" }), 1400);
      } catch (err) {
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Save failed. Try again.",
        });
      }
    });
  };

  const handleCancel = () => {
    setValue(savedValue);
    setState({ kind: "idle" });
    setOpen(false);
  };

  if (!open) {
    const preview = (savedValue || "").trim();
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-start gap-1.5 rounded-md border border-transparent px-2 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/10 hover:bg-muted hover:text-foreground"
      >
        <PencilIcon className="mt-0.5 size-3 shrink-0" />
        {preview ? (
          <span className="line-clamp-2 max-w-[220px] whitespace-pre-wrap">
            {preview}
          </span>
        ) : (
          <span>Add notes</span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={busy}
        rows={3}
        className="w-64 min-w-[16rem] rounded-md border border-input bg-background p-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-70"
        placeholder="Private admin notes for this application..."
        autoFocus
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || busy}
          className={cn(
            "inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {busy ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : state.kind === "saved" ? (
            <CheckIcon className="size-3" />
          ) : null}
          {state.kind === "saved" ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={busy}
          className="rounded-md border border-foreground/10 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          {dirty ? "Cancel" : "Close"}
        </button>
      </div>
      {state.kind === "error" ? (
        <span
          role="alert"
          className="flex items-center gap-1 text-[11px] text-destructive"
        >
          <AlertCircleIcon className="size-3" />
          {state.message}
        </span>
      ) : null}
    </div>
  );
}
