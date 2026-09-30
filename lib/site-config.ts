export const siteConfig = {
  brand: "Emmett Funston",
  shortBrand: "Emmett Funston",
  founder: "Emmett Funston",
  founderTitle: "Electrical Engineering at Northwestern University",
  tagline:
    "Digital hardware, FPGA, and ASIC/VLSI engineering.",
  description:
    "Electrical Engineering student at Northwestern building digital hardware across RTL, ASIC physical design, FPGA, embedded systems, and PCBs.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://emmettfunston.com",
  email: process.env.ADMIN_EMAIL ?? "emmettfunstuff@gmail.com",
  github: "https://github.com/emmettfunston",
  linkedin: "https://www.linkedin.com/in/emmettfunston",
  youtube: "https://www.youtube.com/@EmmettFunston",
} as const;

/**
 * Resolves the external Pathway Tutors profile URL for 1-on-1 private bookings.
 * Pathway Tutors is used ONLY as an external booking link — never as the site's brand.
 * Returns "#" when the env var is missing so links stay valid during development.
 */
export function getPathwayBookingUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PATHWAY_TUTORS_PROFILE_URL?.trim();
  if (!raw) {
    // TODO: Set NEXT_PUBLIC_PATHWAY_TUTORS_PROFILE_URL in .env for the 1-on-1 booking CTA.
    return "#";
  }
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export type NavItem = {
  label: string;
  href: string;
  /** External links open in a new tab and get a TODO fallback when env is missing. */
  external?: boolean;
  /** Highlight in the nav (e.g. Book 1-on-1). */
  emphasis?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Media", href: "/content" },
  { label: "Resume", href: "/resume" },
  { label: "SAT Planner", href: "/sat-planner", emphasis: true },
];

export const footerNav = {
  engineering: [
    { label: "Selected Projects", href: "/projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Technical Stack", href: "/#stack" },
    { label: "Resume", href: "/resume" },
  ],
  profile: [
    { label: "About", href: "/#about" },
    { label: "Media / YouTube", href: "/content" },
    { label: "Drumming", href: "/drums" },
  ],
  coaching: [
    { label: "SAT Study Planner", href: "/sat-planner" },
  ],
} as const;

export const disclaimer =
  "Results shown are individual outcomes and are not guarantees. This program is designed for ambitious students who already have strong academic potential and want a sharper system, accountability, and application strategy.";
