"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Achievement } from "@/lib/content";
import AchievementDetailModal, {
  type AchievementDetail,
} from "./AchievementDetailModal";

type AchievementItem = AchievementDetail;

type AchievementsSectionProps = {
  achievements: AchievementItem[];
  instagramUrl: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function AchievementsSection({
  achievements,
  instagramUrl,
}: AchievementsSectionProps) {
  const [selected, setSelected] = useState<AchievementItem | null>(null);

  return (
    <>
      <section id="achievements" className="scroll-panel" data-section="achievements">
        <motion.div
          className="scroll-panel-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <motion.h2 variants={fadeUp} custom={0}>
            Achievements
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp} custom={1}>
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

          <motion.div className="achievements-grid">
            {achievements.map((item, i) => (
              <motion.button
                type="button"
                key={item.id}
                className="achievement-card glass achievement-card--clickable"
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -6, scale: 1.02, rotateX: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(item)}
                style={{ transformPerspective: 900 }}
              >
                <motion.div
                  className="achievement-image-wrap"
                  style={{ translateZ: 8 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="achievement-image"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="achievement-category">{item.category}</span>
                </motion.div>
                <motion.div className="achievement-body" style={{ translateZ: 12 }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="achievement-tap-hint">Tap for details →</span>
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <AchievementDetailModal
        achievement={selected}
        instagramUrl={instagramUrl}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
