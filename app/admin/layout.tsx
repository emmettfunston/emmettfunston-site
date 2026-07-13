import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Bare admin layout — intentionally does NOT render the marketing Navbar or
 * Footer. This lives outside the (marketing) route group.
 *
 * Force dynamic rendering because the page reads the session cookie and, when
 * authed, queries Supabase for the latest submissions.
 */
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">{children}</div>
  );
}
