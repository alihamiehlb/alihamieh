"use client";

import { useEffect, useState } from "react";

/** Phones, tablets, coarse pointers, or reduced-motion preference */
export function useMobileLite(maxWidth = 900) {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setLite(narrow.matches || coarse.matches || reduced.matches);
    };

    update();
    narrow.addEventListener("change", update);
    coarse.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, [maxWidth]);

  useEffect(() => {
    document.documentElement.classList.toggle("portfolio-lite", lite);
    return () => document.documentElement.classList.remove("portfolio-lite");
  }, [lite]);

  return lite;
}
