"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smoothly scroll to a section id (used by the nav). Falls back to native. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -8 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Sets up Lenis momentum scrolling and a raf loop. Disabled under reduced
 * motion (native scroll is kept fully usable).
 */
export default function SmoothScroll({ reduced }: { reduced: boolean }) {
  useEffect(() => {
    if (reduced) return;
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, [reduced]);

  return null;
}
