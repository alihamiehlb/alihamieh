"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

type CharacterAvatarProps = {
  mouseX: number;
  mouseY: number;
};

export default function CharacterAvatar({ mouseX, mouseY }: CharacterAvatarProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 60, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 60, damping: 30 });
  const scale = useSpring(1, { stiffness: 50, damping: 25 });
  const tiltZ = useSpring(0, { stiffness: 60, damping: 30 });
  const floatY = useSpring(0, { stiffness: 30, damping: 20 });
  const depthZ = useSpring(0, { stiffness: 50, damping: 25 });

  useEffect(() => {
    rotateX.set(mouseY * -4);
    rotateY.set(mouseX * 5);
    scale.set(1.01 + Math.hypot(mouseX, mouseY) * 0.02);
    tiltZ.set(mouseX * -1);
    depthZ.set(mouseX * 4 + mouseY * -3);
  }, [mouseX, mouseY, rotateX, rotateY, scale, tiltZ, depthZ]);

  useEffect(() => {
    let raf = 0;
    const pulse = () => {
      floatY.set(Math.sin(Date.now() / 1400) * 2);
      raf = requestAnimationFrame(pulse);
    };
    raf = requestAnimationFrame(pulse);
    return () => cancelAnimationFrame(raf);
  }, [floatY]);

  return (
    <motion.div
      ref={stageRef}
      className="character-stage"
      style={{
        rotateX,
        rotateY,
        rotateZ: tiltZ,
        scale,
        y: floatY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="character-grid-floor"
        style={{ translateZ: -72, rotateX: 78, opacity: 0.3 }}
      />
      <motion.div
        className="character-plate character-plate--back"
        style={{ translateZ: -56, opacity: 0.45 }}
      />
      <motion.div
        className="character-plate character-plate--mid"
        style={{ translateZ: -32 }}
      />
      <motion.div
        className="character-plate character-plate--front"
        style={{ translateZ: -8, opacity: 0.3 }}
      />
      <motion.div className="character-ring" style={{ translateZ: depthZ }} />

      <motion.div
        className="character-shine"
        style={{ translateZ: 24 }}
        animate={{ x: mouseX * 5, y: mouseY * 5 }}
      />

      <motion.div
        className="character-frame"
        style={{ translateZ: 20 }}
      >
        <img
          src="/character.gif"
          alt="Ali Hamieh Avatar"
          className="character-video ready"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <motion.div
        className="character-shadow-3d"
        style={{ translateZ: -72 }}
        animate={{ scaleX: 1 + Math.abs(mouseX) * 0.05, opacity: 0.6 }}
      />
    </motion.div>
  );
}
