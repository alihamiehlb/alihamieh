"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="split-gallery-interactive">
      <div className="split-gallery-main">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="split-gallery-image-wrapper"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={`${title} screenshot ${currentIndex + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              className="split-gallery-nav prev"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <button 
              className="split-gallery-nav next"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="split-gallery-thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              className={`split-gallery-thumb ${i === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
