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
  const interview = site.interviews.find((i: any) => i.id === slug);
  if (!interview) return { title: "Interview Not Found" };
  return {
    title: `${interview.title} | Ali Hamieh`,
    description: interview.description,
  };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteContent();
  const interview = site.interviews.find((i: any) => i.id === slug);

  if (!interview) {
    notFound();
  }

  return (
    <main className="portfolio-shell">
      <div className="scroll-panel" style={{ height: "auto", minHeight: "100vh", paddingTop: "5rem" }}>
        <div className="scroll-panel-inner" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
          <Link href="/#interviews" className="btn-ghost" style={{ display: "inline-block", marginBottom: "2rem" }}>
            ← Back to Portfolio
          </Link>
          
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{interview.title}</h1>
          
          <div className="tags" style={{ marginBottom: "2rem" }}>
            <span className="badge">{interview.channel}</span>
            <span>{interview.date}</span>
          </div>

          {interview.image && (
            <div className="interview-image" style={{ marginBottom: "2rem" }}>
              <img
                src={interview.image}
                alt={interview.title}
                loading="lazy"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          )}

          <div className="project-content glass" style={{ padding: "2rem", borderRadius: "16px", marginBottom: "3rem" }}>
            {interview.description ? (
              <Markdown>{interview.description}</Markdown>
            ) : (
              <p>More details coming soon.</p>
            )}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Event",
                name: interview.title,
                description: interview.description,
                startDate: interview.date,
                location: {
                  "@type": "Place",
                  name: interview.channel,
                },
                performer: {
                  "@type": "Person",
                  name: "Ali Hamieh",
                },
              }),
            }}
          />

          <a href={interview.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: "inline-flex" }}>
            Watch Full Interview
          </a>
        </div>
      </div>
    </main>
  );
}
