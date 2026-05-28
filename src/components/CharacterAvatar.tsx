"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PortraitVideo from "./PortraitVideo";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const durationRef = useRef(0);
  const modeRef = useRef<VideoMode>("paused");
  const readyRef = useRef(false);
  const visibleRef = useRef(true);
  const lastInteractRef = useRef(0);
  const lastFrameRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [attachVideo, setAttachVideo] = useState(false);

  const rotateX = useSpring(0, { stiffness: 85, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 85, damping: 20 });
  const scale = useSpring(1, { stiffness: 75, damping: 18 });
  const tiltZ = useSpring(0, { stiffness: 70, damping: 22 });
  const floatY = useSpring(0, { stiffness: 40, damping: 14 });
  const depthZ = useSpring(0, { stiffness: 60, damping: 18 });

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
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) setAttachVideo(true);
        const video = videoRef.current;
        if (!video || !readyRef.current) return;
        if (!entry.isIntersecting) {
          video.pause();
          modeRef.current = "paused";
        } else if (isIdle()) {
          startNativePlay(video);
        }
      },
      { threshold: 0.1, rootMargin: "80px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    rotateX.set(mouseY * -28);
    rotateY.set(mouseX * 32);
    scale.set(1.04 + Math.hypot(mouseX, mouseY) * 0.09);
    tiltZ.set(mouseX * -6);
    depthZ.set(mouseX * 18 + mouseY * -12);
  }, [mouseX, mouseY, rotateX, rotateY, scale, tiltZ, depthZ]);

  useEffect(() => {
    let raf = 0;
    const pulse = () => {
      floatY.set(Math.sin(Date.now() / 1400) * 5);
      raf = requestAnimationFrame(pulse);
    };
    raf = requestAnimationFrame(pulse);
    return () => cancelAnimationFrame(raf);
  }, [floatY]);

  useEffect(() => {
    if (!attachVideo) return;
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let cancelled = false;

    const applyTime = (t: number, force = false) => {
      const duration = durationRef.current;
      if (duration <= 0) return;
      const clamped = Math.max(0.02, Math.min(duration - 0.03, t));
      timeRef.current = clamped;
      const delta = Math.abs(video.currentTime - clamped);
      if (force || delta > 0.003) {
        try {
          seekVideo(video, clamped);
        } catch {
          /* not ready */
        }
      }
    };

    const syncMode = () => {
      if (!readyRef.current || !visibleRef.current) {
        if (!video.paused) video.pause();
        modeRef.current = "paused";
        return;
      }

      if (isIdle()) {
        if (modeRef.current !== "play") startNativePlay(video);
        return;
      }

      startScrub(video);
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const last = lastFrameRef.current || now;
      const dt = Math.min(0.032, (now - last) / 1000);
      lastFrameRef.current = now;

      syncMode();

      const duration = durationRef.current;
      if (
        duration > 0 &&
        readyRef.current &&
        visibleRef.current &&
        modeRef.current === "scrub"
      ) {
        const { x, y } = pointerRef.current;
        const target = mapMouseToTime(x, y, duration);
        const err = target - timeRef.current;
        const absErr = Math.abs(err);
        const next =
          absErr > duration * 0.12
            ? easeToward(timeRef.current, target, dt, 0.022)
            : easeToward(timeRef.current, target, dt, 0.038);
        applyTime(next, absErr > 0.08);
      }

      raf = requestAnimationFrame(tick);
    };

    const onReady = () => {
      durationRef.current = video.duration || 5;
      video.pause();
      const start = durationRef.current * 0.42;
      applyTime(start, true);
      lastInteractRef.current = 0;
      readyRef.current = true;
      setReady(true);
      lastFrameRef.current = performance.now();
      syncMode();
      raf = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    if (video.readyState >= 1) onReady();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      cancelAnimationFrame(raf);
    };
  }, [attachVideo]);

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
        style={{ translateZ: -72, rotateX: 78 }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="character-plate character-plate--back"
        style={{ translateZ: -56 }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="character-plate character-plate--mid"
        style={{ translateZ: -32 }}
      />
      <motion.div
        className="character-plate character-plate--front"
        style={{ translateZ: -8 }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div className="character-ring" style={{ translateZ: depthZ }} />

      <motion.div
        className="character-shine"
        style={{ translateZ: 24 }}
        animate={{
          x: mouseX * 40,
          y: mouseY * 30,
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{ opacity: { duration: 3, repeat: Infinity } }}
      />

      <motion.div
        className="character-frame"
        style={{ translateZ: 20 }}
        animate={{
          boxShadow: `0 42px 100px rgba(42,154,173,${0.28 + Math.abs(mouseX) * 0.14}), 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.55) inset`,
        }}
      >
        <PortraitVideo
          mode="scrub"
          ready={ready}
          videoRef={videoRef}
          attachSrc={attachVideo}
          onReady={() => setReady(true)}
        />
      </motion.div>

      <motion.div
        className="character-shadow-3d"
        style={{ translateZ: -72 }}
        animate={{ scaleX: 1 + Math.abs(mouseX) * 0.2, opacity: [0.5, 0.75, 0.5] }}
        transition={{ opacity: { duration: 4, repeat: Infinity } }}
      />
    </motion.div>
  );
}
