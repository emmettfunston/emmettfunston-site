import * as React from "react";

import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Vertical spacing preset. */
  spacing?: "sm" | "md" | "lg" | "xl";
  /** Constrain inner content width. */
  container?: "sm" | "md" | "lg" | "xl" | "full";
  /** Soft muted background. */
  muted?: boolean;
  /** Editorial surface treatment. */
  tone?: "default" | "band" | "contrast";
  /** Optional inner wrapper class. */
  innerClassName?: string;
};

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-10 sm:py-14",
  md: "py-14 sm:py-20",
  lg: "py-20 sm:py-28",
  xl: "py-24 sm:py-36",
};

const containerMap: Record<NonNullable<SectionProps["container"]>, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-none",
};

export function Section({
  className,
  innerClassName,
  spacing = "md",
  container = "lg",
  muted = false,
  tone = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative w-full",
        (muted || tone === "band") && "border-y border-foreground/8 bg-muted/55",
        tone === "contrast" && "bg-foreground text-background",
        spacingMap[spacing],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full px-6 sm:px-8",
          containerMap[container],
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
