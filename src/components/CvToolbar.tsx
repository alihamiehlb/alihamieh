"use client";

type CvToolbarProps = {
  fileName: string;
};

export default function CvToolbar({ fileName }: CvToolbarProps) {
  const href = `/${fileName}`;

  return (
    <div className="cv-toolbar">
      <a href="/">← Portfolio</a>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <a href={href} download={fileName}>
          Download HTML
        </a>
        <button type="button" className="cv-print" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
