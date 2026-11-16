"use client";

import { useEffect, useRef, useState } from "react";

export const PORTRAIT_POSTER = "/portrait-poster.webp";
export const PORTRAIT_VIDEO = "/character-optimized.mp4";

type PortraitVideoProps = {
  className?: string;
  /** Desktop: scrub mode pauses until loaded; lite: loop when visible */
  mode: "loop" | "scrub";
  ready: boolean;
  onReady?: () => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  /** Parent controls when src is attached (scrub mode) */
  attachSrc?: boolean;
};

function posterFallback() {
  return "/me_standing.png";
}

export default function PortraitVideo({
  className = "",
  mode,
  ready,
  onReady,
  videoRef: externalRef,
  attachSrc = false,
}: PortraitVideoProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalRef ?? internalRef;
  const [posterOk, setPosterOk] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const isReady = ready || videoReady;

  const poster = posterOk ? PORTRAIT_POSTER : posterFallback();

  useEffect(() => {
    setLoadVideo(attachSrc);
  }, [attachSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;

    const onCanPlay = () => {
      setVideoReady(true);
      onReady?.();
      if (mode === "loop") {
        video.loop = true;
        video.muted = true;
        void video.play().catch(() => {});
      }
    };
    video.addEventListener("canplay", onCanPlay);
    if (video.readyState >= 3) onCanPlay();

    return () => video.removeEventListener("canplay", onCanPlay);
  }, [loadVideo, onReady, videoRef, mode]);

  const showVideo = loadVideo && !videoFailed;

  return (
    <div className={`portrait-video-wrap${className ? ` ${className}` : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={`character-poster${isReady && showVideo ? " character-poster--hidden" : ""}`}
        decoding="async"
        fetchPriority="high"
        onError={() => setPosterOk(false)}
      />

      {showVideo && (
        <video
          ref={videoRef}
          className={`character-video${isReady ? " ready" : ""}`}
          src={PORTRAIT_VIDEO}
          muted
          playsInline
          loop={mode === "loop"}
          preload="metadata"
          poster={poster}
          aria-hidden={!isReady}
          aria-label="Portrait video"
          onError={() => setVideoFailed(true)}
        />
      )}

      {!isReady && loadVideo && !videoFailed && (
        <span className="character-loading" aria-live="polite">
          Loading video…
        </span>
      )}

      {videoFailed && <span className="character-error-note">Animation unavailable · poster shown</span>}
    </div>
  );
}
