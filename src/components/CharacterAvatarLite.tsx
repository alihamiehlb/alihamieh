"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PortraitVideo from "./PortraitVideo";

/** Lightweight portrait for mobile — poster first, video loads when visible */
export default function CharacterAvatarLite() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [attachVideo, setAttachVideo] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAttachVideo(true);
        else videoRef.current?.pause();
      },
      { threshold: 0.12, rootMargin: "80px" }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={stageRef}
      className="character-stage character-stage--lite"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="character-frame">
        <PortraitVideo
          mode="loop"
          ready={ready}
          videoRef={videoRef}
          attachSrc={attachVideo}
          onReady={() => setReady(true)}
        />
      </div>
    </motion.div>
  );
}
