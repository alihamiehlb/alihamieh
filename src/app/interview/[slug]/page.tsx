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
    <main className="split-layout">
      {/* ── Left Sticky Column ── */}
      <aside className="split-left">
        <div className="split-left-content">
          <Link href="/#interviews" className="split-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Portfolio
          </Link>
          
          <h1 className="split-title">{interview.title}</h1>
          <p className="split-description">{interview.description || "Interview details"}</p>
          
          <div className="split-tags">
            <span className="split-tag">{interview.channel}</span>
            <span className="split-tag" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
              {interview.date}
            </span>
          </div>

          <div className="split-primary-action">
            <a href={interview.url} target="_blank" rel="noreferrer" className="btn-primary">
              Watch Full Interview →
            </a>
          </div>
        </div>
      </aside>

      {/* ── Right Scrolling Column ── */}
      <section className="split-right">
        {interview.image && (
          <div className="split-gallery">
            <div className="split-gallery-image">
              <Image
                src={interview.image}
                alt={interview.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={85}
                priority
              />
            </div>
          </div>
        )}

        <div className="split-content">
          <div className="split-prose">
            {interview.description ? (
              <Markdown>{interview.description}</Markdown>
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
