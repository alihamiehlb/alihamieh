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

  return (
    <main className="portfolio-shell">
      <div className="scroll-panel" style={{ height: "auto", minHeight: "100vh" }}>
        <div className="detail-page-container">
          <div className="detail-hero">
            <div className="detail-header-content">
              <Link href="/#projects" className="detail-back-btn">
                ← Back to Portfolio
              </Link>
              
              <h1 className="detail-title">{project.title}</h1>
              <p className="detail-lead">{project.description}</p>
              
              {project.tags && project.tags.length > 0 && (
                <div className="detail-tags-row">
                  {project.tags.map((t: string) => (
                    <span key={t} className="detail-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {hasImages && (
              <div className="detail-gallery">
                {project.images.map((img: string, i: number) => (
                  <div key={i} className="detail-image-wrapper">
                    <Image
                      src={img}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      priority={i === 0}
                      quality={85}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-content-area glass">
            {project.content ? (
              <Markdown>{project.content}</Markdown>
            ) : (
              <p style={{ fontStyle: "italic", opacity: 0.8 }}>No extended documentation provided for this project yet.</p>
            )}
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: project.title,
              description: project.description,
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
