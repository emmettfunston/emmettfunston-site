import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getPathwayBookingUrl } from "@/lib/site-config";

/**
 * Layout for the public/marketing surface of the site.
 *
 * Route groups (folders wrapped in parentheses) do not add URL segments, so
 * `app/(marketing)/sat-admissions/page.tsx` still lives at `/sat-admissions`.
 * The admin route sits outside this group so it never inherits Navbar/Footer.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathwayBookingUrl = getPathwayBookingUrl();

  return (
    <>
      <Navbar pathwayBookingUrl={pathwayBookingUrl} />
      <main className="flex-1">{children}</main>
      <Footer pathwayBookingUrl={pathwayBookingUrl} />
    </>
  );
}
