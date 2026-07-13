import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import {
  PlayCircleIcon,
  FileTextIcon,
  RssIcon,
  ClapperboardIcon,
} from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { CtaButton } from "@/components/site/cta-button";
import {
  YoutubeBrandIcon,
  InstagramBrandIcon,
} from "@/components/site/brand-icons";
import { cn } from "@/lib/utils";

// Accepts both Lucide icon components and our brand SVG components.
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const metadata: Metadata = {
  title: "Content",
  description:
    "Videos, shorts, and essays from Emmett Funston on SAT prep, admissions strategy, engineering, and building a serious system.",
  alternates: { canonical: "/content" },
};

// TODO(emmett): Replace placeholder hrefs with real YouTube / channel /
// blog links once they're live. `href: "#"` intentionally shows a "Coming
// soon" state instead of a broken link.
const channels: {
  title: string;
  handle: string;
  description: string;
  Icon: IconComponent;
  href: string;
  live?: boolean;
}[] = [
  {
    title: "YouTube — Emmett Funston",
    handle: "@emmettfunston",
    description:
      "Long-form breakdowns on SAT strategy, selective admissions, and how ambitious students should think about the next 12 months.",
    Icon: YoutubeBrandIcon,
    // TODO: Set to real channel URL, e.g. https://www.youtube.com/@emmettfunston
    href: "#",
  },
  {
    title: "SAT & Admissions Shorts",
    handle: "shorts + reels",
    description:
      "60-second tactics: score-leak diagnosis, mistake review, activity list positioning, essay angles.",
    Icon: ClapperboardIcon,
    href: "#",
  },
];

const upcomingVideos = [
  {
    category: "SAT · Strategy",
    title: "The score-leak framework: why smart students plateau at 1400",
    length: "12 min",
  },
  {
    category: "SAT · Review",
    title: "Practice test review, done correctly",
    length: "9 min",
  },
  {
    category: "Admissions",
    title: "How to build an applicant narrative that actually holds up",
    length: "14 min",
  },
  {
    category: "Admissions",
    title: "School list strategy for reach-target-safety",
    length: "10 min",
  },
];

const blogPosts = [
  {
    tag: "Essay",
    title: "The 1400 wall — why it isn't about IQ",
    excerpt:
      "Most 1400-scoring students don't need more practice tests. They need a diagnostic that finds the same mistakes repeating in different disguises.",
  },
  {
    tag: "Essay",
    title: "The mistake journal — the single tool that shifted my scores",
    excerpt:
      "How to turn every wrong answer into a permanent upgrade instead of a forgotten frustration.",
  },
  {
    tag: "Playbook",
    title: "Application narrative in three sentences",
    excerpt:
      "A compressed framework for figuring out what an admissions officer is actually going to say about your file in 90 seconds.",
  },
];

const socials: {
  label: string;
  handle: string;
  Icon: IconComponent;
  href: string;
}[] = [
  {
    label: "YouTube",
    handle: "@emmettfunston",
    Icon: YoutubeBrandIcon,
    href: "#",
  },
  {
    label: "Instagram",
    handle: "@emmettfunston",
    Icon: InstagramBrandIcon,
    href: "#",
  },
  {
    label: "RSS",
    handle: "coming soon",
    Icon: RssIcon,
    href: "#",
  },
];

export default function ContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Videos, shorts, and essays."
        description="Long-form breakdowns and short tactics on SAT prep, selective admissions, and building a serious system. New drops land here as they ship."
        actions={
          <>
            <CtaButton href="/sat-admissions/workshop" variant="primary" size="lg">
              Start with the free workshop
            </CtaButton>
            <CtaButton href="/sat-admissions" variant="secondary" size="lg">
              See the program
            </CtaButton>
          </>
        }
      />

      {/* Watch band */}
      <Section spacing="lg" container="xl">
        <SectionHeader
          eyebrow="Watch"
          title="Channels"
          subtitle="Where the videos live."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {channels.map((c) => (
            <ChannelCard key={c.title} channel={c} />
          ))}
        </div>
      </Section>

      {/* Upcoming videos */}
      <Section spacing="lg" container="xl" muted>
        <SectionHeader
          eyebrow="Upcoming"
          title="On the release schedule"
          subtitle="The next round of videos being cut."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingVideos.map((v) => (
            <VideoPlaceholderCard key={v.title} video={v} />
          ))}
        </div>
      </Section>

      {/* Read band */}
      <Section spacing="lg" container="xl">
        <SectionHeader
          eyebrow="Read"
          title="Essays & breakdowns"
          subtitle="Long-form pieces on prep strategy and admissions."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((p) => (
            <PostCard key={p.title} post={p} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Full essays land here as they&apos;re finished.
        </p>
      </Section>

      {/* Follow band */}
      <Section spacing="md" container="lg" muted>
        <SectionHeader
          eyebrow="Follow"
          title="Where to keep up"
          subtitle="Real links replace these placeholders as each channel goes live."
        />

        <ul className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-foreground/25",
                  s.href === "#" && "cursor-default opacity-70"
                )}
              >
                <s.Icon className="size-4" aria-hidden />
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (co-located because they're only used on this page)
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

function ChannelCard({
  channel,
}: {
  channel: {
    title: string;
    handle: string;
    description: string;
    Icon: IconComponent;
    href: string;
    live?: boolean;
  };
}) {
  const isPlaceholder = channel.href === "#";
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-foreground/10 bg-background p-6">
      {/* Video-thumbnail-shaped placeholder */}
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/60">
        <channel.Icon
          className="size-12 text-foreground/25"
          aria-hidden
        />
        <span className="absolute right-3 bottom-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-foreground/70">
          {isPlaceholder ? "Coming soon" : "Live"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {channel.title}
        </h3>
        <span className="text-xs text-muted-foreground">{channel.handle}</span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {channel.description}
      </p>

      <div className="mt-auto">
        {isPlaceholder ? (
          <span className="text-xs text-muted-foreground">
            Channel launching soon.
          </span>
        ) : (
          <CtaButton
            href={channel.href}
            variant="secondary"
            size="md"
            external
            className="w-fit"
          >
            Visit channel
          </CtaButton>
        )}
      </div>
    </article>
  );
}

function VideoPlaceholderCard({
  video,
}: {
  video: { category: string; title: string; length: string };
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-4">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/60">
        <PlayCircleIcon className="size-8 text-foreground/25" aria-hidden />
        <span className="absolute right-2 bottom-2 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
          {video.length}
        </span>
      </div>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
        {video.category}
      </span>
      <h3 className="text-sm leading-snug font-semibold text-foreground">
        {video.title}
      </h3>
      <span className="mt-auto text-[11px] text-muted-foreground">
        Coming soon
      </span>
    </article>
  );
}

function PostCard({
  post,
}: {
  post: { tag: string; title: string; excerpt: string };
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background p-6">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        <FileTextIcon className="size-3.5" aria-hidden />
        {post.tag}
      </div>
      <h3 className="font-heading text-lg leading-snug font-semibold text-foreground">
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      <span className="mt-auto text-xs text-muted-foreground">
        Coming soon
      </span>
    </article>
  );
}
