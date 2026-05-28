"use client";

import { useEffect, useRef, useState } from "react";

export const PORTRAIT_POSTER = "/portrait-poster.webp";
export const PORTRAIT_VIDEO = "/character.mp4";

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

function isSlowConnection() {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return true;
  const t = conn?.effectiveType;
  return t === "slow-2g" || t === "2g" || t === "3g";
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
  const [needsTap, setNeedsTap] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const poster = posterOk ? PORTRAIT_POSTER : posterFallback();

  useEffect(() => {
    setNeedsTap(isSlowConnection());
  }, []);

  useEffect(() => {
    if (mode === "scrub") {
      setLoadVideo(attachSrc);
      return;
    }
    if (!needsTap) setLoadVideo(true);
  }, [mode, attachSrc, needsTap]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;

    const onCanPlay = () => {
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
        className={`character-poster${ready && showVideo ? " character-poster--hidden" : ""}`}
        decoding="async"
        fetchPriority="high"
        onError={() => setPosterOk(false)}
      />

      {showVideo && (
        <video
          ref={videoRef}
          className={`character-video${ready ? " ready" : ""}`}
          src={PORTRAIT_VIDEO}
          muted
          playsInline
          loop={mode === "loop"}
          preload="none"
          poster={poster}
          aria-hidden={!ready}
          aria-label="Portrait video"
          onError={() => setVideoFailed(true)}
        />
      )}

      {needsTap && !loadVideo && !videoFailed && (
        <button
          type="button"
          className="portrait-load-btn"
          onClick={() => setLoadVideo(true)}
        >
          Play portrait video
        </button>
      )}

      {!ready && loadVideo && !videoFailed && (
        <span className="character-loading" aria-live="polite">
          Loading video…
        </span>
      )}

      {videoFailed && (
        <span className="character-loading character-loading--static">Portrait</span>
      )}
    </div>
  );
}
