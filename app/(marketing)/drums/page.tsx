import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import {
  Music2Icon,
  PlayCircleIcon,
  ClapperboardIcon,
  MicIcon,
} from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import {
  YoutubeBrandIcon,
  InstagramBrandIcon,
} from "@/components/site/brand-icons";
import { cn } from "@/lib/utils";

// Accepts both Lucide icons and our brand SVG components.
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const metadata: Metadata = {
  title: "Drums",
  description:
    "Drum covers, practice reels, and playing videos from Emmett Funston. New videos land here as they're recorded.",
  alternates: { canonical: "/drums" },
};

// TODO(emmett): Replace placeholder video entries with real cover / reel
// URLs (YouTube, Instagram, etc.). Any entry with href: "#" renders as a
// "Coming soon" tile.
type VideoTile = {
  title: string;
  artist?: string;
  category: "Cover" | "Reel" | "Live" | "Practice";
  duration: string;
  href: string;
};

const covers: VideoTile[] = [
  {
    title: "TODO: Cover title",
    artist: "TODO: original artist",
    category: "Cover",
    duration: "TODO: 3:42",
    href: "#",
  },
  {
    title: "TODO: Cover title",
    artist: "TODO: original artist",
    category: "Cover",
    duration: "TODO: 4:10",
    href: "#",
  },
  {
    title: "TODO: Cover title",
    artist: "TODO: original artist",
    category: "Cover",
    duration: "TODO: 3:15",
    href: "#",
  },
];

const reels: VideoTile[] = [
  {
    title: "TODO: Groove or fill breakdown",
    category: "Reel",
    duration: "TODO: 0:45",
    href: "#",
  },
  {
    title: "TODO: Practice loop / warm-up",
    category: "Practice",
    duration: "TODO: 1:12",
    href: "#",
  },
  {
    title: "TODO: Chops clip",
    category: "Reel",
    duration: "TODO: 0:30",
    href: "#",
  },
  {
    title: "TODO: Live-set clip",
    category: "Live",
    duration: "TODO: 1:30",
    href: "#",
  },
];

const socials: { label: string; handle: string; Icon: IconComponent; href: string }[] = [
  { label: "YouTube", handle: "@emmettfunston", Icon: YoutubeBrandIcon, href: "#" },
  { label: "Instagram", handle: "@emmettfunston", Icon: InstagramBrandIcon, href: "#" },
];

export default function DrumsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Drums"
        title="Playing keeps the mind sharp."
        description="Drumming is one of the ways I stay sharp outside of engineering and coaching. Covers, practice clips, and live playing will land here as they get recorded."
        actions={
          <CtaButton href="/content" variant="secondary" size="lg">
            More content
          </CtaButton>
        }
      />

      {/* Featured / covers */}
      <Section spacing="lg" container="xl">
        <SectionHeader
          eyebrow="Covers"
          title="Full plays"
          subtitle="Full-length drum covers. New ones added as they're finished."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {covers.map((v, i) => (
            <FeaturedTile key={`${v.title}-${i}`} tile={v} />
          ))}
        </div>
      </Section>

      {/* Reels + practice */}
      <Section spacing="lg" container="xl" muted>
        <SectionHeader
          eyebrow="Reels & practice"
          title="Short clips"
          subtitle="Grooves, fills, and quick chops."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reels.map((v, i) => (
            <ShortTile key={`${v.title}-${i}`} tile={v} />
          ))}
        </div>
      </Section>

      {/* Setup + follow */}
      <Section spacing="lg" container="lg">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 bg-background p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              <MicIcon className="size-3.5" aria-hidden />
              Gear
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Kit & setup
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              TODO: Short description of the kit, cymbals, mics, and any
              recording chain used for the covers.
            </p>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-background p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              <Music2Icon className="size-3.5" aria-hidden />
              Follow
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Watch new drops
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-muted/50 px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-foreground/25",
                      s.href === "#" && "cursor-default opacity-70"
                    )}
                  >
                    <s.Icon className="size-3.5" aria-hidden />
                    <span className="font-medium">{s.label}</span>
                    <span className="text-muted-foreground">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Full videos and reels will replace these placeholders as they&apos;re
          recorded.
        </p>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-1">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

function FeaturedTile({ tile }: { tile: VideoTile }) {
  const isPlaceholder = tile.href === "#";
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-4">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-foreground/[0.06] via-muted to-foreground/[0.02]">
        <PlayCircleIcon
          className="size-14 text-foreground/25 transition-transform group-hover:scale-110"
          aria-hidden
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-foreground/70">
          {tile.category}
        </span>
        <span className="absolute right-3 bottom-3 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground/70">
          {tile.duration}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          {tile.title}
        </h3>
        {tile.artist ? (
          <p className="text-xs text-muted-foreground">— {tile.artist}</p>
        ) : null}
      </div>
      <div className="mt-auto px-1">
        {isPlaceholder ? (
          <span className="text-xs text-muted-foreground">Coming soon</span>
        ) : (
          <CtaButton
            href={tile.href}
            variant="secondary"
            size="md"
            external
            className="w-fit"
          >
            Watch
          </CtaButton>
        )}
      </div>
    </article>
  );
}

function ShortTile({ tile }: { tile: VideoTile }) {
  const isPlaceholder = tile.href === "#";
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-foreground/10 bg-background p-3">
      <div className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-foreground/[0.06] to-muted">
        <ClapperboardIcon className="size-9 text-foreground/25" aria-hidden />
        <span className="absolute top-2 left-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase text-foreground/70">
          {tile.category}
        </span>
        <span className="absolute right-2 bottom-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
          {tile.duration}
        </span>
      </div>
      <h3 className="px-1 pt-1 text-xs leading-snug font-semibold text-foreground">
        {tile.title}
      </h3>
      <span className="px-1 pb-1 text-[10px] text-muted-foreground">
        {isPlaceholder ? "Coming soon" : "Watch"}
      </span>
    </article>
  );
}
