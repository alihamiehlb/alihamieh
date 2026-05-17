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
  title: "Ali Hamieh — Portfolio",
  description:
    "Portfolio of Ali Hamieh — developer, maker, and student building web, mobile, and hardware projects.",
  openGraph: {
    title: "Ali Hamieh — Portfolio",
    url: siteUrl,
    siteName: "printsLB",
    images: ["/me_standing.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
