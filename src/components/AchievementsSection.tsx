"use client";

import { motion } from "framer-motion";
import LoadingLink from "./LoadingLink";
import type { Achievement } from "@/lib/content";
import { Trophy, Award, FileBadge, Code, Cpu, Shield, GraduationCap, Wrench, Bot } from "lucide-react";

type AchievementsSectionProps = {
  achievements: Achievement[];
  instagramUrl: string;
  lite?: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

const fadeUpLite = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.02, 0.1), duration: 0.28 },
  }),
};

const MotionLink = motion.create(LoadingLink);

function getIconForCategory(category: string, isAward: boolean) {
  const cat = category.toLowerCase();
  if (cat.includes("robotics")) return <Bot size={40} strokeWidth={1.5} />;
  if (cat.includes("cybersecurity")) return <Shield size={40} strokeWidth={1.5} />;
  if (cat.includes("hackathon")) return <Code size={40} strokeWidth={1.5} />;
  if (cat.includes("ai") || cat.includes("python")) return <Cpu size={40} strokeWidth={1.5} />;
  if (cat.includes("hardware")) return <Wrench size={40} strokeWidth={1.5} />;
  if (cat.includes("academy") || cat.includes("academic")) return <GraduationCap size={40} strokeWidth={1.5} />;
  if (cat.includes("certification")) return <FileBadge size={40} strokeWidth={1.5} />;
  if (isAward) return <Trophy size={40} strokeWidth={1.5} />;
  return <Award size={40} strokeWidth={1.5} />;
}

export default function AchievementsSection({
  achievements,
  instagramUrl,
  lite = false,
}: AchievementsSectionProps) {
  const fade = lite ? fadeUpLite : fadeUp;

  const awards = achievements.filter((a) => a.source === "award");
  const certs = achievements.filter((a) => a.source !== "award");

  return (
    <section id="achievements" className="scroll-panel" data-section="achievements">
      <motion.div
        className="scroll-panel-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          visible: {
            transition: { staggerChildren: lite ? 0.025 : 0.05 },
          },
        }}
      >
        <motion.h2 variants={fade} custom={0}>
          Achievements
        </motion.h2>
        <motion.p className="section-sub" variants={fade} custom={1}>
          Competitions, certifications, robotics, and hands-on work — tap a
          card for details · also on{" "}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="insta-link"
          >
            @alihamiehlb
          </a>
        </motion.p>

        {/* ────── Awards & Competitions ────── */}
        {awards.length > 0 && (
          <div className="ach-group">
            <motion.div variants={fade} custom={2} className="ach-group-header">
              <span className="ach-group-icon">🏆</span>
              <div>
                <h3 className="ach-group-title">Awards & Competitions</h3>
                <p className="ach-group-count">{awards.length} wins & placements</p>
              </div>
            </motion.div>
            <motion.div className="achievements-grid">
              {awards.map((item, i) => (
                <MotionLink
                  href={`/achievement/${item.id}`}
                  key={item.id}
                  className="ach-card glass"
                  style={{ textDecoration: 'none', display: 'block' }}
                  variants={fade}
                  custom={i + 3}
                  whileHover={
                    lite ? undefined : { y: -8, boxShadow: "0 24px 48px rgba(42, 154, 173, 0.18)" }
                  }
                  whileTap={{ scale: lite ? 0.99 : 0.97 }}
                >
                  <div className="ach-card-icon ach-card-icon--award">
                    {getIconForCategory(item.category, true)}
                  </div>
                  <div className="ach-card-body">
                    <span className="ach-card-category">{item.category}</span>
                    <h3 className="ach-card-title">{item.title}</h3>
                    <p className="ach-card-desc">{item.description}</p>
                    <span className="ach-card-cta">View details →</span>
                  </div>
                </MotionLink>
              ))}
            </motion.div>
          </div>
        )}

        {/* ────── Certifications & Training ────── */}
        {certs.length > 0 && (
          <div className="ach-group ach-group--certs">
            <motion.div variants={fade} custom={5} className="ach-group-header">
              <span className="ach-group-icon">📜</span>
              <div>
                <h3 className="ach-group-title">Certifications & Training</h3>
                <p className="ach-group-count">{certs.length} certifications</p>
              </div>
            </motion.div>
            <motion.div className="achievements-grid">
              {certs.map((item, i) => (
                <MotionLink
                  href={`/achievement/${item.id}`}
                  key={item.id}
                  className="ach-card glass"
                  style={{ textDecoration: 'none', display: 'block' }}
                  variants={fade}
                  custom={i + 6}
                  whileHover={
                    lite ? undefined : { y: -8, boxShadow: "0 24px 48px rgba(42, 154, 173, 0.18)" }
                  }
                  whileTap={{ scale: lite ? 0.99 : 0.97 }}
                >
                  <div className="ach-card-icon ach-card-icon--cert">
                    {getIconForCategory(item.category, false)}
                  </div>
                  <div className="ach-card-body">
                    <span className="ach-card-category">{item.category}</span>
                    <h3 className="ach-card-title">{item.title}</h3>
                    <p className="ach-card-desc">{item.description}</p>
                    <span className="ach-card-cta ach-card-cta--cert">View details →</span>
                  </div>
                </MotionLink>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

