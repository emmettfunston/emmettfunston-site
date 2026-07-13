import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon, ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CtaVariant = "primary" | "secondary" | "ghost";
type CtaSize = "md" | "lg";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  size?: CtaSize;
  external?: boolean;
  className?: string;
  showArrow?: boolean;
};

const variantStyles: Record<CtaVariant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 shadow-sm shadow-foreground/10",
  secondary:
    "bg-background text-foreground border border-foreground/15 hover:bg-muted",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
};

const sizeStyles: Record<CtaSize, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
  showArrow = true,
}: CtaButtonProps) {
  const classes = cn(
    "group/cta inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        external ? (
          <ArrowUpRightIcon className="size-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
        ) : (
          <ArrowRightIcon className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
        )
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
