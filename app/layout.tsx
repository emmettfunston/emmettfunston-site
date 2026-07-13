import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Base site metadata. Individual route groups (marketing, admin) can override
 * per page — the admin layout intentionally sets `robots: noindex`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} — SAT Prep & College Admissions Coaching`,
    template: `%s — ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  keywords: [
    "SAT prep",
    "SAT tutoring",
    "college admissions",
    "college essay coaching",
    "Northwestern",
    "test prep",
    "1500 SAT",
    "Emmett Funston",
  ],
  openGraph: {
    title: `${siteConfig.brand} — SAT Prep & College Admissions Coaching`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.brand,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
