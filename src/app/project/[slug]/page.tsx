import { getSiteContent } from "@/lib/get-site-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import type { Metadata } from "next";
import ProjectImageGallery from "@/components/ProjectImageGallery";

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
      images: project.images && project.images.length > 0 ? [{ url: project.images[0] }] : [],
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

  return (
    <main className="split-layout">
      {/* ── Left Sticky Column ── */}
      <aside className="split-left">
        <div className="split-left-content">
          <Link href="/#projects" className="split-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Projects
          </Link>
          
          <h1 className="split-title">{project.title}</h1>
          <p className="split-description">{project.description}</p>
          
          {project.tags && project.tags.length > 0 && (
            <div className="split-tags">
              {project.tags.map((tag: string) => (
                <span key={tag} className="split-tag">{tag}</span>
              ))}
            </div>
          )}

          {(project as any).url && (
            <div className="split-primary-action">
              <a href={(project as any).url} target="_blank" rel="noreferrer" className="btn-primary">
                View Live Project →
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right Scrolling Column ── */}
      <section className="split-right">
        {project.images && project.images.length > 0 && (
          <ProjectImageGallery images={project.images} title={project.title} />
        )}

        <div className="split-content">
          <div className="split-prose">
            {project.content ? (
              <Markdown>{project.content}</Markdown>
            ) : (
              <p className="pd-empty">More details coming soon.</p>
            )}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.title,
            description: project.description,
            applicationCategory: "WebApplication",
            url: (project as any).url,
            author: {
              "@type": "Person",
              name: "Ali Hamieh",
            },
            screenshot: project.images && project.images.length > 0 ? project.images[0] : undefined,
          }),
        }}
      />
    </main>
  );
}
