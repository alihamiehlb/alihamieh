import { getSiteContent } from "@/lib/get-site-content";
import { notFound } from "next/navigation";
import Link from "next/link";
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
      <div className="scroll-panel" style={{ height: "auto", minHeight: "100vh", paddingTop: "5rem" }}>
        <div className="scroll-panel-inner" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
          <Link href="/#achievements" className="btn-ghost" style={{ display: "inline-block", marginBottom: "2rem" }}>
            ← Back to Achievements
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span className="badge">{achievement.category}</span>
            {achievement.source === "award" && <span className="badge" style={{ background: "var(--aqua)", color: "#fff" }}>Award</span>}
          </div>

          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{achievement.title}</h1>
          
          <p className="lead" style={{ marginBottom: "3rem", color: "rgba(255, 255, 255, 0.8)" }}>
            {achievement.description}
          </p>

          {achievement.image && (
            <div className="project-gallery" style={{ marginBottom: "3rem" }}>
              <img
                src={achievement.image}
                alt={achievement.title}
                loading="lazy"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  objectFit: "cover",
                  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.3)"
                }}
              />
            </div>
          )}

          <div className="project-content glass" style={{ padding: "2rem", borderRadius: "16px" }}>
            {achievement.detail ? (
              <Markdown>{achievement.detail}</Markdown>
            ) : (
              <p>No additional details provided.</p>
            )}

            {achievement.instagramHighlight && (
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
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
      </div>
    </main>
  );
}
