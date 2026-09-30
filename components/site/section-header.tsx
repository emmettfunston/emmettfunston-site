import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  inverted?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  inverted = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 grid gap-6 border-t pt-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] md:items-end",
        inverted ? "border-background/20" : "border-foreground/12",
        className
      )}
    >
      <div>
        <p
          className={cn(
            "font-mono text-[11px] font-medium tracking-[0.18em] uppercase",
            inverted ? "text-background/55" : "text-brand"
          )}
        >
          {eyebrow}
        </p>
        <h2
          className={cn(
            "mt-3 max-w-3xl font-heading text-4xl leading-[0.98] tracking-[-0.025em] text-balance sm:text-5xl",
            inverted ? "text-background" : "text-foreground"
          )}
        >
          {title}
        </h2>
      </div>
      <div className="md:justify-self-end">
        {description ? (
          <p
            className={cn(
              "max-w-xl text-sm leading-relaxed sm:text-base",
              inverted ? "text-background/65" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
