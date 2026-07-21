"use client";

import { useState } from "react";

export default function CvToolbar() {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 150);
  };

  return (
    <div className="cv-toolbar">
      <a href="/" className="cv-toolbar-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
        </svg>
        Back to Portfolio
      </a>

      <div className="cv-toolbar-actions">
        <p className="cv-toolbar-hint">Save as PDF using your browser's print dialog</p>
        <button
          type="button"
          className={`cv-toolbar-pdf-btn${printing ? " cv-toolbar-pdf-btn--loading" : ""}`}
          onClick={handlePrint}
          disabled={printing}
          aria-label="Download CV as PDF"
        >
          {printing ? (
            <>
              <span className="cv-toolbar-spinner" />
              Opening...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
