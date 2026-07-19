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
  const interview = site.interviews.find((i: any) => i.id === slug);
  if (!interview) return { title: "Interview Not Found" };
  return {
    title: `${interview.title} | Ali Hamieh`,
    description: interview.description,
    openGraph: {
      title: `${interview.title} | Ali Hamieh`,
      description: interview.description,
      images: interview.image ? [{ url: interview.image }] : [],
    }
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
    <main className="project-detail-page">
      <section className="pd-hero">
        {interview.image && (
          <div className="pd-hero-bg">
            <Image
              src={interview.image}
              alt={interview.title}
              fill
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="pd-hero-overlay" />
          </div>
        )}
        <div className="pd-hero-content">
          <Link href="/#interviews" className="pd-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Portfolio
          </Link>
          
          <div className="pd-tech-row" style={{ marginTop: 0 }}>
            <span className="pd-tech-chip">{interview.channel}</span>
            <span className="pd-tech-chip" style={{ borderColor: 'transparent', background: 'transparent', paddingLeft: 0 }}>{interview.date}</span>
          </div>

          <h1 className="pd-title" style={{ marginTop: "0.5rem" }}>{interview.title}</h1>
        </div>
      </section>

      <section className="pd-body-section" style={{ paddingTop: "3rem" }}>
        <div className="pd-container">
          <div className="pd-body-card">
            <h2 className="pd-section-heading">Overview</h2>
            <div className="pd-prose">
              {interview.description ? (
                <Markdown>{interview.description}</Markdown>
              ) : (
                <p className="pd-empty">More details coming soon.</p>
              )}
            </div>

            <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <a href={interview.url} target="_blank" rel="noreferrer" className="btn-primary">
                Watch Full Interview →
              </a>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: interview.title,
            description: interview.description,
            startDate: interview.date,
            image: interview.image,
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
    </main>
  );
}
