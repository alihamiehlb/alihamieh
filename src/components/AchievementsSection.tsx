"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import LoadingLink from "./LoadingLink";
import type { Achievement } from "@/lib/content";

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

        {awards.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <motion.div variants={fade} custom={2} style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: "#fff", display: "inline-block", borderBottom: "2px solid var(--aqua)", paddingBottom: "0.5rem" }}>
                🏆 Awards & Competitions
              </h3>
            </motion.div>
            <motion.div className="achievements-grid">
              {awards.map((item, i) => (
                <MotionLink
                  href={`/achievement/${item.id}`}
                  key={item.id}
                  className="achievement-card glass achievement-card--clickable"
                  style={{ textDecoration: 'none', display: 'block' }}
                  variants={fade}
                  custom={i + 3}
                  whileHover={
                    lite ? undefined : { y: -6, scale: 1.02, rotateX: 4 }
                  }
                  whileTap={{ scale: lite ? 0.99 : 0.98 }}
                >
                  <motion.div
                    className="achievement-image-wrap"
                    style={lite ? undefined : { translateZ: 8 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="achievement-image"
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 320px"
                      quality={75}
                      loading="lazy"
                    />
                    <span className="achievement-category">{item.category}</span>
                  </motion.div>
                  <motion.div
                    className="achievement-body"
                    style={lite ? undefined : { translateZ: 12 }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="achievement-tap-hint">View details →</span>
                  </motion.div>
                </MotionLink>
              ))}
            </motion.div>
          </div>
        )}

        {certs.length > 0 && (
          <div style={{ marginTop: "6rem", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <motion.div variants={fade} custom={5} style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: "#fff", display: "inline-block", borderBottom: "2px solid var(--aqua)", paddingBottom: "0.5rem" }}>
                📜 Certifications & Training
              </h3>
            </motion.div>
            <motion.div className="achievements-grid">
              {certs.map((item, i) => (
                <MotionLink
                  href={`/achievement/${item.id}`}
                  key={item.id}
                  className="achievement-card glass achievement-card--clickable"
                  style={{ textDecoration: 'none', display: 'block' }}
                  variants={fade}
                  custom={i + 6}
                  whileHover={
                    lite ? undefined : { y: -6, scale: 1.02, rotateX: 4 }
                  }
                  whileTap={{ scale: lite ? 0.99 : 0.98 }}
                >
                  <motion.div
                    className="achievement-image-wrap"
                    style={lite ? undefined : { translateZ: 8 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="achievement-image"
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 320px"
                      quality={75}
                      loading="lazy"
                    />
                    <span className="achievement-category">{item.category}</span>
                  </motion.div>
                  <motion.div
                    className="achievement-body"
                    style={lite ? undefined : { translateZ: 12 }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="achievement-tap-hint">View details →</span>
                  </motion.div>
                </MotionLink>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
