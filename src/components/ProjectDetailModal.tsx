"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";

type ProjectDetailModalProps = {
  project: Project | null;
  onClose: () => void;
};

type ExtendedProject = Project & {
  overview?: string;
  techStack?: string[];
  dependencies?: string[];
  highlights?: string[];
  languages?: { name: string; count: number }[];
  structure?: string[];
  scripts?: string[];
};

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  const p = project as ExtendedProject | null;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          className="project-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-labelledby="project-modal-title"
        >
          <div
            className="project-modal-backdrop"
            aria-hidden
            onClick={onClose}
          />

          <motion.div
            className="project-modal glass"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="project-modal-header">
              <div>
                <p className="rail-label">Project deep dive</p>
                <h2 id="project-modal-title">{p.title}</h2>
                <div className="tags modal-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="modal-sections">
              <ModalSection title="Overview" icon="◆">
                <p className="overview-text">{p.overview || p.description}</p>
              </ModalSection>

              {(p.highlights?.length ?? 0) > 0 && (
                <ModalSection title="Highlights" icon="✦">
                  <ul className="highlight-list">
                    {p.highlights!.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </ModalSection>
              )}

              <ModalSection title="Tech stack" icon="⚙">
                <div className="tech-grid">
                  {(p.techStack?.length ? p.techStack : p.tags).map((tech) => (
                    <span key={tech} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </ModalSection>

              {(p.dependencies?.length ?? 0) > 0 && (
                <ModalSection title="Dependencies & libraries" icon="⬡">
                  <div className="dep-cloud">
                    {p.dependencies!.map((d) => (
                      <span key={d} className="dep-chip">
                        {d}
                      </span>
                    ))}
                  </div>
                </ModalSection>
              )}

              {(p.languages?.length ?? 0) > 0 && (
                <ModalSection title="Languages in repo" icon="⌗">
                  <div className="lang-bars">
                    {p.languages!.map((lang) => {
                      const max = p.languages![0]?.count || 1;
                      const pct = Math.round((lang.count / max) * 100);
                      return (
                        <div key={lang.name} className="lang-row">
                          <span>{lang.name}</span>
                          <div className="lang-track">
                            <motion.div
                              className="lang-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                          <span className="lang-count">{lang.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </ModalSection>
              )}

              {(p.structure?.length ?? 0) > 0 && (
                <ModalSection title="Project structure" icon="▤">
                  <div className="structure-grid">
                    {p.structure!.map((item) => (
                      <code key={item}>{item}</code>
                    ))}
                  </div>
                </ModalSection>
              )}

              {(p.scripts?.length ?? 0) > 0 && (
                <ModalSection title="npm scripts" icon="▶">
                  <div className="scripts-list">
                    {p.scripts!.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </ModalSection>
              )}

              <ModalSection title="At a glance" icon="✓">
                <p className="meta-line">
                  {p.techStack?.length
                    ? `Built with ${(p.techStack ?? p.tags).slice(0, 6).join(", ")}.`
                    : "Full-stack build with modern tooling."}
                </p>
              </ModalSection>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ModalSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section className="modal-section">
      <h3>
        <span className="modal-icon">{icon}</span> {title}
      </h3>
      {children}
    </section>
  );
}
