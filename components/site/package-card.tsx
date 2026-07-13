import * as React from "react";
import { CheckIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaButton } from "@/components/site/cta-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PackageCardProps = {
  name: string;
  positioning: string;
  price?: string;
  cadence?: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  featured?: boolean;
  badge?: string;
};

export function PackageCard({
  name,
  positioning,
  price,
  cadence,
  bullets,
  ctaLabel,
  ctaHref,
  ctaExternal,
  featured = false,
  badge,
}: PackageCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-6 rounded-2xl p-2 ring-1 transition-shadow",
        featured
          ? "bg-foreground text-background ring-foreground shadow-xl shadow-foreground/10"
          : "ring-foreground/10 hover:ring-foreground/20 hover:shadow-md"
      )}
    >
      <CardHeader className="gap-3 px-6 pt-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            className={cn(
              "font-heading text-xl font-semibold",
              featured ? "text-background" : "text-foreground"
            )}
          >
            {name}
          </CardTitle>
          {badge ? (
            <Badge
              variant={featured ? "secondary" : "outline"}
              className={cn(
                "uppercase tracking-wide",
                featured && "bg-background/15 text-background"
              )}
            >
              {badge}
            </Badge>
          ) : null}
        </div>
        <p
          className={cn(
            "text-sm",
            featured ? "text-background/80" : "text-muted-foreground"
          )}
        >
          {positioning}
        </p>
        {price ? (
          <div className="flex items-baseline gap-2 pt-1">
            <span
              className={cn(
                "font-heading text-3xl font-semibold tracking-tight",
                featured ? "text-background" : "text-foreground"
              )}
            >
              {price}
            </span>
            {cadence ? (
              <span
                className={cn(
                  "text-xs",
                  featured ? "text-background/70" : "text-muted-foreground"
                )}
              >
                {cadence}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6 px-6 pb-6">
        <ul className="flex flex-col gap-3 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <CheckIcon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  featured ? "text-background" : "text-foreground"
                )}
              />
              <span
                className={cn(
                  featured ? "text-background/90" : "text-foreground/85"
                )}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">
          <CtaButton
            href={ctaHref}
            external={ctaExternal}
            variant={featured ? "secondary" : "primary"}
            size="md"
            className={cn(
              "w-full",
              featured &&
                "bg-background text-foreground hover:bg-background/90 border-transparent"
            )}
          >
            {ctaLabel}
          </CtaButton>
        </div>
      </CardContent>
    </Card>
  );
}
