"use client";

import { useEffect, useRef } from "react";

/**
 * Alive-but-subtle backdrop: near-black base, a faint grid that fades out, a
 * grain layer, and a soft accent glow that eases toward the pointer. Purely
 * decorative and pointer-events:none, so it never interferes with content.
 */
export default function Background({ reduced }: { reduced: boolean }) {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.06;
      pos.y += (target.y - pos.y) * 0.06;
      if (glow.current) {
        glow.current.style.setProperty("--mx", `${pos.x}px`);
        glow.current.style.setProperty("--my", `${pos.y}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="hx-bg" aria-hidden="true">
      <div className="hx-bg__grid" />
      <div ref={glow} className="hx-bg__glow" />
      <div className="hx-bg__grain" />
    </div>
  );
}
