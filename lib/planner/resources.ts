export const SAT_RESOURCES = [
  {
    slug: "sat-math-book",
    label: "SAT Math",
    description: "The math prep book used for your chapter assignments.",
    url: "https://amzn.to/4kekzFy",
  },
  {
    slug: "sat-grammar-book",
    label: "SAT Grammar",
    description: "The grammar resource used for Writing-focused assignments.",
    url: "https://amzn.to/42QYkjc",
  },
  {
    slug: "sat-reading-book",
    label: "SAT Reading",
    description: "The reading resource used for Reading-focused assignments.",
    url: "https://amzn.to/43mqfaH",
  },
  {
    slug: "sat-practice-exams",
    label: "Practice Exams",
    description: "The full-length practice-test resource for Saturdays.",
    url: "https://amzn.to/3GOy2W7",
  },
] as const;

export function resourceUrlForSlug(slug: string): string | null {
  return SAT_RESOURCES.find((resource) => resource.slug === slug)?.url ?? null;
}
