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
    <main className="portfolio-shell">
      <div className="scroll-panel" style={{ height: "auto", minHeight: "100vh" }}>
        <div className="detail-page-container">
          <div className="detail-hero">
            <div className="detail-header-content">
              <Link href="/#achievements" className="detail-back-btn">
                ← Back to Achievements
              </Link>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="badge">{achievement.category}</span>
                {achievement.source === "award" && <span className="badge" style={{ background: "var(--aqua)", color: "#fff" }}>Award</span>}
              </div>

              <h1 className="detail-title" style={{ marginTop: "0.5rem" }}>{achievement.title}</h1>
              <p className="detail-lead">{achievement.description}</p>
            </div>

            {achievement.image && (
              <div className="detail-gallery">
                <div className="detail-image-wrapper">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority
                    quality={85}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="detail-content-area glass">
            {achievement.detail ? (
              <Markdown>{achievement.detail}</Markdown>
            ) : (
              <p style={{ fontStyle: "italic", opacity: 0.8 }}>No additional details provided.</p>
            )}

            {achievement.instagramHighlight && (
              <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ color: "var(--aqua-dark)", fontWeight: 600 }}>
                  📸 As seen on Instagram: <span style={{ color: "var(--text)" }}>{achievement.instagramHighlight}</span>
                </p>
                <a 
                  href={site.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary" 
                  style={{ display: "inline-block", marginTop: "1rem" }}
                >
                  View on Instagram
                </a>
              </div>
            )}
          </div>
        </div>

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
      </div>
    </main>
  );
}
