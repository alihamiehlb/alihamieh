"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/character.mp4";

/** Lightweight portrait for mobile — native video loop only, no 3D or scrubbing */
export default function CharacterAvatarLite() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;

    const play = () => {
      video.loop = true;
      video.muted = true;
      void video.play().catch(() => {});
    };

    const pause = () => {
      video.pause();
    };

    const onReady = () => {
      setReady(true);
      play();
    };

    video.addEventListener("loadeddata", onReady);
    if (video.readyState >= 2) onReady();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else pause();
      },
      { threshold: 0.15 }
    );
    io.observe(stage);

    return () => {
      video.removeEventListener("loadeddata", onReady);
      io.disconnect();
      pause();
    };
  }, []);

  return (
    <motion.div
      ref={stageRef}
      className="character-stage character-stage--lite"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="character-frame"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video
          ref={videoRef}
          className={`character-video${ready ? " ready" : ""}`}
          src={VIDEO_SRC}
          muted
          playsInline
          loop
          preload="metadata"
          poster="/me_standing.png"
          aria-label="Portrait video"
        />
        {!ready && <span className="character-loading">Loading…</span>}
      </motion.div>
    </motion.div>
  );
}
