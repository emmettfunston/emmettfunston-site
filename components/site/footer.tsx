import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { footerNav, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-foreground text-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-md bg-background font-mono text-xs font-semibold text-foreground"
              >
                EF
              </span>
              <span className="text-base font-semibold tracking-tight">
                {siteConfig.brand}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-background/60">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-2 w-fit border-b border-background/30 pb-1 text-sm text-background transition-colors hover:border-background"
            >
              {siteConfig.email}
            </a>
          </div>

          <FooterColumn title="Engineering" items={footerNav.engineering} />
          <FooterColumn title="Profile" items={footerNav.profile}>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-background/60 transition-colors hover:text-background"
              >
                GitHub
                <ArrowUpRightIcon className="size-3" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-background/60 transition-colors hover:text-background"
              >
                LinkedIn
                <ArrowUpRightIcon className="size-3" />
              </a>
            </li>
          </FooterColumn>
          <FooterColumn title="SAT Coaching" items={footerNav.coaching} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-background/15 pt-8 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Digital hardware · FPGA · ASIC/VLSI · Embedded systems</p>
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
      <h3 className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-background/45">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-background/60 transition-colors hover:text-background"
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
