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
        "border-b border-foreground/10 bg-background",
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
          <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-brand uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-heading max-w-5xl text-5xl leading-[0.95] tracking-[-0.035em] text-balance text-foreground sm:text-6xl md:text-7xl">
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
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
