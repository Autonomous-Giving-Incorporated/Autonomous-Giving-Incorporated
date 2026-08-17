import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import { SITE_ORIGIN, absoluteSiteUrl } from "@/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

const description =
  "Autonomously Giving Incorporated shows how contributions move from funding intent to verified community impact through Portfolio Signals and Impact Relay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Autonomously Giving Incorporated",
    template: "%s | AGI",
  },
  description,
  alternates: { canonical: absoluteSiteUrl() },
  openGraph: {
    title: "Autonomously Giving Incorporated",
    description: "Giving should not end with a receipt.",
    type: "website",
    url: absoluteSiteUrl(),
    siteName: "Autonomously Giving Incorporated",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomously Giving Incorporated",
    description: "Giving should not end with a receipt.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
