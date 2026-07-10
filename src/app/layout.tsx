import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "./portfolio.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ali Hamieh | Developer, Maker & Student",
  description:
    "Portfolio of Ali Hamieh — full-stack developer, maker, and student building web, mobile, and hardware projects.",
  keywords: [
    "Ali Hamieh",
    "Portfolio",
    "Web Developer",
    "Software Engineer",
    "Lebanon",
    "Full Stack",
    "React",
    "Next.js",
    "Hardware",
    "Embedded",
    "printsLB",
  ],
  authors: [{ name: "Ali Hamieh", url: siteUrl }],
  creator: "Ali Hamieh",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ali Hamieh | Developer, Maker & Student",
    description: "Portfolio of Ali Hamieh — full-stack developer, maker, and student building web, mobile, and hardware projects.",
    url: siteUrl,
    siteName: "Ali Hamieh Portfolio",
    images: [
      {
        url: "/portrait-poster.webp",
        width: 1200,
        height: 630,
        alt: "Ali Hamieh Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Hamieh | Developer, Maker & Student",
    description: "Portfolio of Ali Hamieh — full-stack developer, maker, and student building web, mobile, and hardware projects.",
    images: ["/portrait-poster.webp"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <link
          rel="preload"
          href="/portrait-poster.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
