export const siteConfig = {
  brand: "Emmett Funston SAT & Admissions",
  shortBrand: "Emmett Funston",
  founder: "Emmett Funston",
  founderTitle: "Northwestern University Electrical Engineering",
  tagline:
    "Sharper SAT prep and a serious college application strategy for ambitious students.",
  description:
    "Emmett Funston is a Northwestern Engineering student helping ambitious high school students raise their SAT scores and build stronger college applications through a focused, accountable system.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://emmettfunston.com",
  email: process.env.ADMIN_EMAIL ?? "hello@emmettfunston.com",
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
  { label: "Home", href: "/" },
  { label: "SAT & Admissions", href: "/sat-admissions" },
  { label: "Packages", href: "/sat-admissions/packages" },
  { label: "Proof", href: "/sat-admissions/proof" },
  { label: "Roadmap", href: "/sat-admissions/roadmap" },
  { label: "Workshop", href: "/sat-admissions/workshop" },
  { label: "Apply", href: "/sat-admissions/apply" },
];

export const footerNav = {
  program: [
    { label: "SAT & Admissions", href: "/sat-admissions" },
    { label: "Packages", href: "/sat-admissions/packages" },
    { label: "Proof of Results", href: "/sat-admissions/proof" },
    { label: "The Roadmap", href: "/sat-admissions/roadmap" },
  ],
  getStarted: [
    { label: "Free Workshop", href: "/sat-admissions/workshop" },
    { label: "Apply to Coach", href: "/sat-admissions/apply" },
  ],
  personal: [
    { label: "Projects", href: "/projects" },
    { label: "Resume", href: "/resume" },
    { label: "Drums", href: "/drums" },
    { label: "Content", href: "/content" },
  ],
} as const;

export const disclaimer =
  "Results shown are individual outcomes and are not guarantees. This program is designed for ambitious students who already have strong academic potential and want a sharper system, accountability, and application strategy.";
