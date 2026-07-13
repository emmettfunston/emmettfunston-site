"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site-config";
import { CtaButton } from "@/components/site/cta-button";

type NavbarProps = {
  pathwayBookingUrl: string;
};

export function Navbar({ pathwayBookingUrl }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const closeMenu = React.useCallback(() => setOpen(false), []);

  const isActive = React.useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={siteConfig.brand}
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-foreground font-heading text-sm font-semibold text-background transition-transform group-hover:-rotate-3"
          >
            EF
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-foreground sm:inline">
            Emmett Funston
            <span className="text-muted-foreground">
              {" "}
              · SAT &amp; Admissions
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium tracking-tight transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CtaButton
            href={pathwayBookingUrl}
            external
            variant="secondary"
            size="md"
            showArrow={false}
            className="h-9 px-4"
          >
            Book 1-on-1
            <ArrowUpRightIcon className="size-3.5" />
          </CtaButton>
          <CtaButton
            href="/sat-admissions/apply"
            variant="primary"
            size="md"
            showArrow={false}
            className="h-9 px-4"
          >
            Apply
          </CtaButton>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {open ? (
        <div className="border-t border-foreground/10 bg-background lg:hidden">
          <nav
            aria-label="Mobile primary"
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4 sm:px-8"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={pathwayBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-between rounded-md border border-foreground/15 px-3 py-2.5 text-base font-medium text-foreground"
            >
              Book 1-on-1
              <ArrowUpRightIcon className="size-4" />
            </a>
            <Link
              href="/sat-admissions/apply"
              onClick={closeMenu}
              className="mt-1 flex items-center justify-center rounded-md bg-foreground px-3 py-2.5 text-base font-medium text-background"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
