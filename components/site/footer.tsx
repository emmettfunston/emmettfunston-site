import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { footerNav, siteConfig, disclaimer } from "@/lib/site-config";

type FooterProps = {
  pathwayBookingUrl: string;
};

export function Footer({ pathwayBookingUrl }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-lg bg-foreground font-heading text-sm font-semibold text-background"
              >
                EF
              </span>
              <span className="font-heading text-base font-semibold tracking-tight">
                {siteConfig.brand}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <FooterColumn title="Program" items={footerNav.program} />
          <FooterColumn title="Get Started" items={footerNav.getStarted}>
            <li>
              <a
                href={pathwayBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Book 1-on-1
                <ArrowUpRightIcon className="size-3" />
              </a>
            </li>
          </FooterColumn>
          <FooterColumn title="Personal" items={footerNav.personal} />
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-foreground/10 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl leading-relaxed">{disclaimer}</p>
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} {siteConfig.founder}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  children,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold tracking-widest uppercase text-foreground">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {children}
      </ul>
    </div>
  );
}
