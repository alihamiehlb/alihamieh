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
  const project = site.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Ali Hamieh`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Ali Hamieh`,
      description: project.description,
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteContent();
  const project = site.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const hasImages = project.images && project.images.length > 0;
  const heroImage = hasImages ? project.images[0] : null;
  const galleryImages = hasImages ? project.images.slice(1) : [];

  return (
    <main className="project-detail-page">
      {/* ── Full-width hero banner ── */}
      <section className="pd-hero">
        {heroImage && (
          <div className="pd-hero-bg">
            <Image
              src={heroImage}
              alt={project.title}
              fill
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="pd-hero-overlay" />
          </div>
        )}
        <div className="pd-hero-content">
          <Link href="/#projects" className="pd-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Projects
          </Link>
          {project.featured && <span className="pd-featured-badge">★ Featured Project</span>}
          <h1 className="pd-title">{project.title}</h1>
          <p className="pd-subtitle">{project.description}</p>
          {project.tags && project.tags.length > 0 && (
            <div className="pd-tech-row">
              {project.tags.map((t: string) => (
                <span key={t} className="pd-tech-chip">{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Image gallery (if more than 1 image) ── */}
      {galleryImages.length > 0 && (
        <section className="pd-gallery-section">
          <div className="pd-container">
            <h2 className="pd-section-heading">Gallery</h2>
            <div className="pd-gallery-grid">
              {galleryImages.map((img: string, i: number) => (
                <div key={i} className="pd-gallery-card">
                  <Image
                    src={img}
                    alt={`${project.title} — image ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={80}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Content body ── */}
      <section className="pd-body-section">
        <div className="pd-container">
          <div className="pd-body-card">
            <h2 className="pd-section-heading">About This Project</h2>
            <div className="pd-prose">
              {project.content ? (
                <Markdown>{project.content}</Markdown>
              ) : (
                <p className="pd-empty">Detailed write-up coming soon.</p>
              )}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="pd-body-card" style={{ marginTop: "2rem" }}>
              <h2 className="pd-section-heading">Tech Stack</h2>
              <div className="pd-tech-grid">
                {project.tags.map((tech: string) => (
                  <div key={tech} className="pd-tech-item">
                    <span className="pd-tech-dot" />
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            image: heroImage,
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
