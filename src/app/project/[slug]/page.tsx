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

  return (
    <main className="portfolio-shell">
      <div className="scroll-panel" style={{ height: "auto", minHeight: "100vh", paddingTop: "5rem" }}>
        <div className="scroll-panel-inner" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
          <Link href="/#projects" className="btn-ghost" style={{ display: "inline-block", marginBottom: "2rem" }}>
            ← Back to Portfolio
          </Link>
          
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{project.title}</h1>
          <div className="tags" style={{ marginBottom: "2rem" }}>
            {project.tags?.map((t: string) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <p className="lead" style={{ marginBottom: "3rem", color: "rgba(255, 255, 255, 0.8)" }}>
            {project.description}
          </p>

          {(project.images && project.images.length > 0) && (
            <div className="project-gallery" style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollSnapType: "x mandatory" }}>
                {project.images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    style={{
                      maxHeight: "400px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      scrollSnapAlign: "center",
                      objectFit: "contain",
                      backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="project-content glass" style={{ padding: "2rem", borderRadius: "16px" }}>
            {project.content ? (
              <Markdown>{project.content}</Markdown>
            ) : (
              <p>More details coming soon.</p>
            )}
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

          {(project.tags?.length > 0) && (
            <div style={{ marginTop: "3rem" }}>
              <h3>Tech Stack</h3>
              <div className="tech-grid" style={{ marginTop: "1rem" }}>
                {project.tags.map((tech: string) => (
                  <span key={tech} className="tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
