"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site-config";

export function Navbar() {
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
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/92 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={siteConfig.brand}
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-md bg-foreground font-mono text-xs font-semibold tracking-wider text-background transition-colors group-hover:bg-brand"
          >
            EF
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
            Emmett Funston
            <span className="ml-2 font-mono text-[10px] font-normal tracking-wider text-muted-foreground uppercase">
              EE · Northwestern
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-2 text-sm font-medium tracking-tight transition-colors",
                item.emphasis && "ml-2 border-l border-foreground/15 pl-4",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
          </nav>
        </div>
      ) : null}
    </header>
  );
}
