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
    "Ali Hamieh Lebanon",
    "Full Stack",
    "AI Engineer",
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
  icons: {
    icon: "/icon.gif",
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
        <link
          rel="preload"
          href="/character.gif"
          as="image"
          type="image/gif"
          fetchPriority="high"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ali Hamieh",
              "url": siteUrl,
              "jobTitle": "Full Stack Developer & AI Engineer",
              "homeLocation": {
                "@type": "Place",
                "name": "Lebanon"
              },
              "worksFor": {
                "@type": "Organization",
                "name": "printsLB"
              },
              "sameAs": [
                "https://github.com/alihamiehlb",
                "https://www.linkedin.com/in/ali-hamieh-85617a232/",
                "https://www.instagram.com/alihamiehlb/"
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
