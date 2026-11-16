"use client";

import Link from "next/link";
import { ArrowLeft, Home, RotateCw } from "lucide-react";

export default function FailureScreen({
  kind,
  onRetry,
}: {
  kind: "not-found" | "error";
  onRetry?: () => void;
}) {
  const isMissing = kind === "not-found";

  return (
    <main className="failure-screen">
      <div className="failure-orb failure-orb--one" />
      <div className="failure-orb failure-orb--two" />
      <section className="failure-card" aria-labelledby="failure-title">
        <div className="failure-visual" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="none" poster="/portrait-poster.webp">
            <source src="/character-optimized.mp4" type="video/mp4" />
          </video>
          <span className="failure-scanline" />
          <span className="failure-code">{isMissing ? "404" : "OOPS"}</span>
        </div>
        <p className="failure-eyebrow">ALI HAMIEH · PORTFOLIO</p>
        <h1 id="failure-title">{isMissing ? "This page wandered off." : "A small glitch in the system."}</h1>
        <p className="failure-copy">
          {isMissing
            ? "That link may be outdated. The good projects are still right where you left them."
            : "The page hit an unexpected problem. You can try again or head back to the portfolio."}
        </p>
        <div className="failure-actions">
          {isMissing ? (
            <Link href="/" className="btn-primary"><Home size={17} /> Back to portfolio</Link>
          ) : (
            <button type="button" className="btn-primary" onClick={onRetry}><RotateCw size={17} /> Try again</button>
          )}
          <Link href="/#projects" className="failure-secondary"><ArrowLeft size={16} /> Browse projects</Link>
        </div>
        <span className="failure-status"><i /> {isMissing ? "SYSTEM ONLINE · PAGE NOT FOUND" : "RECOVERABLE ERROR"}</span>
      </section>
    </main>
  );
}
