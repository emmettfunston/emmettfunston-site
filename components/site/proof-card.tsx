import * as React from "react";
import { ArrowRightIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ProofCardProps = {
  student: string;
  context?: string;
  before: number;
  after: number;
  outcome?: string;
  quote?: string;
  featured?: boolean;
};

export function ProofCard({
  student,
  context,
  before,
  after,
  outcome,
  quote,
  featured = false,
}: ProofCardProps) {
  const delta = after - before;
  const positive = delta >= 0;

  return (
    <Card
      className={cn(
        "flex flex-col gap-5 rounded-2xl p-6 ring-1 transition-shadow",
        featured
          ? "bg-foreground text-background ring-foreground shadow-xl shadow-foreground/10"
          : "ring-foreground/10 hover:ring-foreground/20 hover:shadow-md"
      )}
    >
      <CardContent className="flex flex-col gap-5 p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "font-heading text-base font-semibold tracking-tight",
                featured ? "text-background" : "text-foreground"
              )}
            >
              {student}
            </p>
            {context ? (
              <p
                className={cn(
                  "text-xs",
                  featured ? "text-background/70" : "text-muted-foreground"
                )}
              >
                {context}
              </p>
            ) : null}
          </div>
          <Badge
            variant={featured ? "secondary" : "outline"}
            className={cn(
              "font-mono text-[11px] tracking-tight",
              featured && "bg-background/15 text-background"
            )}
          >
            {positive ? "+" : ""}
            {delta} pts
          </Badge>
        </div>

        <div
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4",
            featured
              ? "border-background/20 bg-background/5"
              : "border-foreground/10 bg-muted/40"
          )}
        >
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[10px] tracking-widest uppercase",
                featured ? "text-background/60" : "text-muted-foreground"
              )}
            >
              Before
            </span>
            <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {before}
            </span>
          </div>
          <ArrowRightIcon
            className={cn(
              "size-4 shrink-0",
              featured ? "text-background/60" : "text-muted-foreground"
            )}
          />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[10px] tracking-widest uppercase",
                featured ? "text-background/60" : "text-muted-foreground"
              )}
            >
              After
            </span>
            <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {after}
            </span>
          </div>
        </div>

        {outcome ? (
          <p
            className={cn(
              "text-sm leading-relaxed",
              featured ? "text-background/90" : "text-foreground/85"
            )}
          >
            {outcome}
          </p>
        ) : null}

        {quote ? (
          <blockquote
            className={cn(
              "border-l-2 pl-4 text-sm italic",
              featured
                ? "border-background/40 text-background/90"
                : "border-foreground/20 text-muted-foreground"
            )}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        ) : null}
      </CardContent>
    </Card>
  );
}
