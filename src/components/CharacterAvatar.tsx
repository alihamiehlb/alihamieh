"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

type CharacterAvatarProps = {
  mouseX: number;
  mouseY: number;
};

type VideoMode = "scrub" | "play" | "paused";

const POSE_WEIGHTS = [
  { x: -1, y: 0, weight: 0 },
  { x: -0.55, y: -0.2, weight: 0.14 },
  { x: -0.4, y: -0.75, weight: 0.22 },
  { x: 0, y: 0, weight: 0.42 },
  { x: 0, y: -0.85, weight: 0.52 },
  { x: 0.55, y: -0.15, weight: 0.68 },
  { x: 1, y: 0.1, weight: 0.86 },
  { x: 0.15, y: 0.85, weight: 0.94 },
] as const;

type PoseWeight = (typeof POSE_WEIGHTS)[number];

const IDLE_AFTER_MS = 700;

function mapMouseToTime(mx: number, my: number, duration: number) {
  let best: PoseWeight = POSE_WEIGHTS[3];
  let bestD = Infinity;
  for (const z of POSE_WEIGHTS) {
    const d = (mx - z.x) ** 2 + (my - z.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = z;
    }
  }
  const angle = Math.atan2(my, mx);
  const dist = Math.min(1, Math.hypot(mx, my));
  const base = best.weight * duration;
  const fine =
    ((angle + Math.PI) / (2 * Math.PI)) * duration * 0.04 +
    dist * duration * 0.025 * Math.sin(angle * 2);
  return Math.max(0.02, Math.min(duration - 0.02, base + fine));
}

function easeToward(current: number, target: number, dt: number, tau: number) {
  const alpha = 1 - Math.exp(-dt / Math.max(0.008, tau));
  return current + (target - current) * alpha;
}

function seekVideo(video: HTMLVideoElement, t: number) {
  const fastSeek = (
    video as HTMLVideoElement & { fastSeek?: (time: number) => void }
  ).fastSeek;
  if (typeof fastSeek === "function") {
    try {
      fastSeek.call(video, t);
      return;
    } catch {
      /* fall through */
    }
  }
  video.currentTime = t;
}

export default function CharacterAvatar({ mouseX, mouseY }: CharacterAvatarProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const rotateX = useSpring(0, { stiffness: 60, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 60, damping: 30 });
  const scale = useSpring(1, { stiffness: 50, damping: 25 });
  const tiltZ = useSpring(0, { stiffness: 60, damping: 30 });
  const floatY = useSpring(0, { stiffness: 30, damping: 20 });
  const depthZ = useSpring(0, { stiffness: 50, damping: 25 });

  const isIdle = () =>
    performance.now() - lastInteractRef.current > IDLE_AFTER_MS;

  const markInteract = () => {
    lastInteractRef.current = performance.now();
  };

  const startNativePlay = (video: HTMLVideoElement) => {
    modeRef.current = "play";
    video.loop = true;
    video.playbackRate = 1;
    timeRef.current = video.currentTime;
    void video.play().catch(() => {
      /* autoplay blocked until gesture — scrub path still works */
    });
  };

  const startScrub = (video: HTMLVideoElement) => {
    if (modeRef.current !== "scrub") {
      video.pause();
      timeRef.current = video.currentTime;
      modeRef.current = "scrub";
    }
  };

  useEffect(() => {
    pointerRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      pointerRef.current = {
        x: (clientX / window.innerWidth) * 2 - 1,
        y: (clientY / window.innerHeight) * 2 - 1,
      };
      markInteract();
    };
    const onMouse = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

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
