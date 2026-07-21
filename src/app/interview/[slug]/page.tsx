import { getSiteContent } from "@/lib/get-site-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Tv, Radio, Globe, Share2, ExternalLink, ArrowLeft, Calendar, Mic } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteContent();
  const interview = site.interviews.find((i: any) => i.id === slug);
  if (!interview) return { title: "Interview Not Found" };

  const title = (interview as any).titleEn || interview.title;
  const description = (interview as any).descriptionEn || interview.description;

  return {
    title: `${title} | Ali Hamieh`,
    description,
    openGraph: {
      title: `${title} | Ali Hamieh`,
      description,
    },
  };
}

function getOutletIcon(type: string) {
  switch (type) {
    case "tv": return <Tv size={18} />;
    case "radio": return <Radio size={18} />;
    case "social": return <Share2 size={18} />;
    default: return <Globe size={18} />;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "tv": return "TV Interview";
    case "radio": return "Radio Interview";
    case "social": return "Social Media";
    default: return "Online Media";
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "tv": return { bg: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.3)", color: "#6366f1" };
    case "radio": return { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#d97706" };
    case "social": return { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", color: "#059669" };
    default: return { bg: "rgba(42, 154, 173, 0.1)", border: "rgba(42, 154, 173, 0.3)", color: "var(--aqua-dark)" };
  }
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteContent();
  const interview = site.interviews.find((i: any) => i.id === slug) as any;

  if (!interview) notFound();

  const typeColor = getTypeColor(interview.type || "online");
  const links: Array<{ label: string; url: string }> = interview.links || [];

  // Format date nicely
  const dateObj = interview.date ? new Date(interview.date) : null;
  const dateDisplay = dateObj
    ? dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : interview.date;

  return (
    <main className="split-layout">
      {/* ── Left Sticky Column ── */}
      <aside className="split-left">
        <div className="split-left-content">
          <Link href="/#interviews" className="split-back">
            <ArrowLeft size={18} />
            Back to Interviews
          </Link>

          {/* Type Badge */}
          <div style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }}>
            <span
              className="interview-type-badge"
              style={{ background: typeColor.bg, borderColor: typeColor.border, color: typeColor.color }}
            >
              {getOutletIcon(interview.type)}
              {getTypeLabel(interview.type)}
            </span>
          </div>

          <h1 className="split-title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)" }}>
            {interview.titleEn || interview.title}
          </h1>

          {/* Arabic title */}
          {interview.titleEn && interview.title !== interview.titleEn && (
            <p className="interview-ar-title">{interview.title}</p>
          )}

          <p className="split-description">
            {interview.descriptionEn || interview.description}
          </p>

          {/* Meta info */}
          <div className="interview-meta">
            <div className="interview-meta-item">
              <Mic size={16} />
              <span>{interview.outletEn || interview.outlet}</span>
            </div>
            {dateDisplay && (
              <div className="interview-meta-item">
                <Calendar size={16} />
                <span>{dateDisplay}</span>
              </div>
            )}
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="interview-links-section">
              <p className="interview-links-label">Watch / Read</p>
              <div className="interview-links-list">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="interview-link-btn"
                  >
                    <ExternalLink size={15} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right Scrolling Column ── */}
      <section className="split-right">
        {interview.image && (
          <div className="interview-hero-image" style={{ marginBottom: "2rem", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <img 
              src={interview.image} 
              alt={interview.titleEn || interview.title} 
              style={{ width: "100%", height: "auto", display: "block" }} 
            />
          </div>
        )}

        {/* Arabic description block */}
        <div className="interview-ar-block split-content" dir="rtl">
          <p className="interview-ar-label">التغطية الإعلامية</p>
          <p className="interview-ar-body">{interview.description}</p>
        </div>

        {/* Media Links Preview Cards */}
        {links.length > 0 && (
          <div className="interview-media-cards">
            {links.map((link, i) => {
              const domain = (() => {
                try { return new URL(link.url).hostname.replace("www.", ""); }
                catch { return link.url; }
              })();

              const isFb = link.url.includes("facebook.com");
              const isYt = link.url.includes("youtube.com");

              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="interview-media-card glass"
                >
                  <div className="interview-media-card-icon">
                    {isFb ? "📘" : isYt ? "▶️" : "🔗"}
                  </div>
                  <div className="interview-media-card-body">
                    <span className="interview-media-card-label">{link.label}</span>
                    <span className="interview-media-card-domain">{domain}</span>
                  </div>
                  <ExternalLink size={16} className="interview-media-card-arrow" />
                </a>
              );
            })}
          </div>
        )}

        {links.length === 0 && (
          <div className="split-content">
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>
              Coverage details available upon request.
            </p>
          </div>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: interview.titleEn || interview.title,
              description: interview.descriptionEn || interview.description,
              startDate: interview.date,
              location: {
                "@type": "Place",
                name: interview.outletEn || interview.outlet,
              },
              performer: {
                "@type": "Person",
                name: "Ali Hamieh",
              },
            }),
          }}
        />
      </section>
    </main>
  );
}
