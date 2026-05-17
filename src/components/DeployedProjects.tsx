"use client";

import { motion } from "framer-motion";
import type { DeployedProject } from "@/lib/content";
import { clampText, deployedDisplayName } from "@/lib/format";

type DeployedProjectsProps = {
  projects: DeployedProject[];
  githubUrl: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45 },
  }),
};

export default function DeployedProjects({
  projects,
  githubUrl,
}: DeployedProjectsProps) {
  const live = projects.filter((p) => p.homepage || p.isFounder);
  if (live.length === 0) return null;

  return (
    <motion.div
      className="deployed-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div className="deployed-section-header" variants={fadeUp} custom={0}>
        <h3>Live on the web</h3>
        <p>
          Deployed builds from{" "}
          <a href={githubUrl} target="_blank" rel="noreferrer" className="insta-link">
            GitHub
          </a>
        </p>
      </motion.div>

      <div className="deployed-grid">
        {live.map((project, i) => {
          const title = deployedDisplayName(project);
          const desc = clampText(project.description, 140);
          const siteUrl =
            project.homepage ||
            (project.isFounder ? "https://printslb.com" : null);

          return (
            <motion.article
              key={project.id}
              className={`deployed-card${project.isFounder ? " deployed-card--founder" : ""}`}
              variants={fadeUp}
              custom={i + 1}
              whileHover={{ y: -8, scale: 1.01 }}
            >
              <motion.div className="deployed-card-top">
                <motion.div className="deployed-icon" aria-hidden>
                  {project.isFounder ? "🖨" : "◆"}
                </motion.div>
                <motion.div className="deployed-card-titles">
                  <h4>{title}</h4>
                  <motion.div className="deployed-badges">
                    {project.isFounder && (
                      <span className="founder-badge">Founder</span>
                    )}
                    {project.featured && !project.isFounder && (
                      <span className="badge">Featured</span>
                    )}
                    {project.language && (
                      <span className="deployed-lang">{project.language}</span>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>

              <p className="deployed-desc">{desc}</p>

              <motion.div className="deployed-actions">
                {siteUrl && (
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="deployed-btn deployed-btn--live"
                  >
                    Live site
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="deployed-btn deployed-btn--gh"
                >
                  GitHub
                </a>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
