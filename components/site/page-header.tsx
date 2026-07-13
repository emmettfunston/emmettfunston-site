import * as React from "react";

import { Section } from "@/components/site/section";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <Section
      spacing="lg"
      container="xl"
      className={cn(
        "border-b bg-gradient-to-b from-muted/40 to-background",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          align === "center" && "items-center text-center"
        )}
      >
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-heading max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-base text-muted-foreground sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        ) : null}
        {actions ? (
          <div
            className={cn(
              "mt-2 flex flex-col gap-3 sm:flex-row sm:items-center",
              align === "center" && "sm:justify-center"
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
