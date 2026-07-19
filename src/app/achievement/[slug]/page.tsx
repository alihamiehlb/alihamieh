import { getSiteContent } from "@/lib/get-site-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import type { Metadata } from "next";
import { Trophy } from "lucide-react";

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
    <main className="split-layout">
      {/* ── Left Sticky Column ── */}
      <aside className="split-left">
        <div className="split-left-content">
          <Link href="/#achievements" className="split-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Achievements
          </Link>
          
          <h1 className="split-title">{achievement.title}</h1>
          <p className="split-description">{achievement.description}</p>
          
          <div className="split-tags">
            <span className="split-tag">{achievement.category}</span>
            {achievement.source === "award" && (
              <span className="split-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: "rgba(255, 184, 0, 0.1)", borderColor: "rgba(255, 184, 0, 0.3)", color: "#ffb800" }}>
                <Trophy size={14} /> Award
              </span>
            )}
          </div>

          {achievement.instagramHighlight && (
            <div className="split-primary-action">
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn-primary">
                View on Instagram →
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right Scrolling Column ── */}
      <section className="split-right">
        {achievement.image && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow)',
              background: 'var(--ice)',
            }}>
              <Image
                src={achievement.image}
                alt={achievement.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={85}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        <div className="split-content">
          <div className="split-prose">
            {achievement.detail ? (
              <Markdown>{achievement.detail}</Markdown>
            ) : (
              <p className="pd-empty">No additional details provided.</p>
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
