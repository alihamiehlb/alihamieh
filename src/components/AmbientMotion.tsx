"use client";

import { motion } from "framer-motion";

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: `${8 + ((i * 17) % 84)}%`,
  y: `${6 + ((i * 23) % 88)}%`,
  size: 6 + (i % 4) * 4,
  delay: i * 0.35,
  duration: 4 + (i % 5),
}));

const LITE_BUBBLES = BUBBLES.slice(0, 4);

type AmbientMotionProps = {
  lite?: boolean;
};

export default function AmbientMotion({ lite = false }: AmbientMotionProps) {
  if (lite) {
    return (
      <motion.div
        className="ambient-motion ambient-motion--lite"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
    );
  }

  return (
    <motion.div className="ambient-motion" aria-hidden>
      {BUBBLES.map((b) => (
        <motion.span
          key={b.id}
          className="ambient-bubble"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, b.id % 2 ? 10 : -10, 0],
            opacity: [0.25, 0.55, 0.25],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
