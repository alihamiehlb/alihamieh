import { getSiteContent } from "@/lib/get-site-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteContent();
  const achievement = site.achievements.find((a) => a.id === slug);
  
  if (!achievement) return { title: "Achievement Not Found" };
  
  return {
    title: `${achievement.title} | Ali Hamieh`,
    description: achievement.description,
    openGraph: {
      title: `${achievement.title} | Ali Hamieh`,
      description: achievement.description,
      images: achievement.image ? [{ url: achievement.image }] : [],
    },
  };
}

export default async function AchievementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteContent();
  const achievement = site.achievements.find((a) => a.id === slug);

  if (!achievement) {
    notFound();
  }

  return (
    <main className="project-detail-page">
      {/* ── Full-width hero banner ── */}
      <section className="pd-hero">
        {achievement.image && (
          <div className="pd-hero-bg">
            <Image
              src={achievement.image}
              alt={achievement.title}
              fill
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="pd-hero-overlay" />
          </div>
        )}
        <div className="pd-hero-content">
          <Link href="/#achievements" className="pd-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Achievements
          </Link>
          <div className="pd-tech-row" style={{ marginTop: 0 }}>
            <span className="pd-tech-chip">{achievement.category}</span>
            {achievement.source === "award" && (
              <span className="pd-featured-badge">🏆 Award</span>
            )}
          </div>
          <h1 className="pd-title">{achievement.title}</h1>
          <p className="pd-subtitle">{achievement.description}</p>
        </div>
      </section>

      {/* ── Content body ── */}
      <section className="pd-body-section" style={{ paddingTop: "3rem" }}>
        <div className="pd-container">
          <div className="pd-body-card">
            <h2 className="pd-section-heading">Details</h2>
            <div className="pd-prose">
              {achievement.detail ? (
                <Markdown>{achievement.detail}</Markdown>
              ) : (
                <p className="pd-empty">No additional details provided.</p>
              )}
            </div>

            {achievement.instagramHighlight && (
              <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "var(--aqua)", fontWeight: 600, fontSize: "0.95rem" }}>
                  📸 As seen on Instagram: <span style={{ color: "rgba(255,255,255,0.7)" }}>{achievement.instagramHighlight}</span>
                </p>
                <a 
                  href={site.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary" 
                  style={{ marginTop: "1rem" }}
                >
                  View on Instagram →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: achievement.title,
            description: achievement.description,
            image: achievement.image,
            author: {
              "@type": "Person",
              name: "Ali Hamieh",
            },
          }),
        }}
      />
    </main>
  );
}
