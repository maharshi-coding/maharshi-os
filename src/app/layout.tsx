import type { Metadata, Viewport } from "next";
import { person } from "@/data/resume";
import { Providers } from "@/components/system/Providers";
import { OSShell } from "@/components/system/OSShell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PROJECT VICE // MAHARSHI.EXE — Maharshi Barot",
    template: "%s · PROJECT VICE",
  },
  description:
    "Maharshi Barot — AI Solutions Developer and Full-Stack Engineer. An interactive neon-noir portfolio built like an open-world game: every project is a mission, every stat is real, all shipped end-to-end.",
  keywords: [
    "Maharshi Barot",
    "AI developer",
    "full-stack engineer",
    "LLM",
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
    title: "PROJECT VICE // MAHARSHI.EXE — Maharshi Barot",
    description:
      "AI Solutions Developer · Full-Stack Engineer. Enter Vice City and play through the missions.",
    siteName: "PROJECT VICE",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PROJECT VICE // MAHARSHI.EXE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PROJECT VICE // MAHARSHI.EXE — Maharshi Barot",
    description:
      "AI Solutions Developer · Full-Stack Engineer. Enter Vice City and play through the missions.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0512",
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
  sameAs: [person.github],
  jobTitle: "AI Solutions Developer · Full-Stack Engineer",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Texas A&M University–Corpus Christi" },
    { "@type": "CollegeOrUniversity", name: "Pandit Deendayal Energy University" },
    { "@type": "CollegeOrUniversity", name: "Government Polytechnic, Ahmedabad" },
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
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="scanlines antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-link font-mono text-sm">
          skip to content
        </a>
        <Providers>
          <OSShell>{children}</OSShell>
        </Providers>
      </body>
    </html>
  );
}
