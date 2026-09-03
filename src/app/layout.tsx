import type { Metadata, Viewport } from "next";
import { person } from "@/data/resume";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maharshi Barot — AI Solutions Developer & Full-Stack Engineer",
    template: "%s · Maharshi Barot",
  },
  description:
    "Maharshi Barot — AI Solutions Developer and Full-Stack Engineer building intelligent products from idea to production. AI agents, full-stack apps, mobile, automation, computer vision — shipped end-to-end.",
  keywords: [
    "Maharshi Barot",
    "AI developer",
    "AI solutions developer",
    "full-stack engineer",
    "LLM",
    "AI agents",
    "React",
    "Next.js",
    "creative developer",
    "portfolio",
  ],
  authors: [{ name: person.name, url: person.github }],
  creator: person.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Maharshi Barot — AI Solutions Developer & Full-Stack Engineer",
    description:
      "Building intelligent products from idea to production. AI agents, full-stack apps, mobile, automation and computer vision — shipped end-to-end.",
    siteName: "Maharshi Barot",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Maharshi Barot — AI Solutions Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maharshi Barot — AI Solutions Developer & Full-Stack Engineer",
    description:
      "Building intelligent products from idea to production — shipped end-to-end.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD structured data — facts from the resume only. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  email: `mailto:${person.email}`,
  url: siteUrl,
  sameAs: [person.github, person.linkedin],
  jobTitle: "AI Solutions Developer · Full-Stack Engineer",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Texas A&M University–Corpus Christi" },
    { "@type": "CollegeOrUniversity", name: "Pandit Deendayal Energy University" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
