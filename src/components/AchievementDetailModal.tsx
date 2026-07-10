"use client";

import { AnimatePresence, motion } from "framer-motion";
import LightboxImage from "./LightboxImage";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Achievement } from "@/lib/content";

export type AchievementDetail = Achievement & {
  detail?: string;
  instagramHighlight?: string;
  sourceUrl?: string;
};

type AchievementDetailModalProps = {
  achievement: AchievementDetail | null;
  instagramUrl: string;
  onClose: () => void;
};

export default function AchievementDetailModal({
  achievement,
  instagramUrl,
  onClose,
}: AchievementDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!achievement) return;
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
  }, [achievement, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="project-modal-root achievement-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-labelledby="achievement-modal-title"
        >
          <motion.button
            type="button"
            className="project-modal-backdrop"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="project-modal glass achievement-modal"
            initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformPerspective: 1400 }}
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <motion.div
              className="achievement-modal-image"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <LightboxImage
                src={achievement.image}
                alt={achievement.title}
                className="achievement-image achievement-image--modal"
              />
              <span className="achievement-category">{achievement.category}</span>
            </motion.div>
            <motion.div className="achievement-modal-body">
              <h2 id="achievement-modal-title">{achievement.title}</h2>
              <p className="achievement-modal-detail">
                {achievement.detail || achievement.description}
              </p>
              {achievement.instagramHighlight && (
                <p className="achievement-modal-ig">
                  <span className="ig-label">On Instagram</span>
                  {achievement.instagramHighlight}
                </p>
              )}
              <motion.div
                className="achievement-modal-actions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <a
                  href={achievement.sourceUrl || instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  {achievement.sourceUrl ? "View post" : "Open @alihamiehlb"}
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  Profile & highlights
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
