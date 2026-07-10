"use client";

import { useEffect, useRef, useState } from "react";
import { useOS } from "./Providers";

/**
 * A neon targeting reticle: a crosshair that eases toward the pointer and
 * locks on (scales + turns cyan) over interactive elements. Fine-pointer
 * devices only; under reduced-motion it snaps to the pointer (no trailing lag)
 * rather than disappearing, so the reticle still works with animations off.
 */
export function CustomCursor() {
  const { reducedMotion } = useOS();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let teardown: (() => void) | null = null;

    // Wire up the reticle. Guarded so repeated "change" events can't stack it.
    const activate = () => {
      if (teardown) return;
      setEnabled(true);
      document.documentElement.classList.add("custom-cursor");

      const pos = { x: -100, y: -100 };
      const ring = { x: -100, y: -100 };
      let hovering = false;
      let pressed = false;
      let raf = 0;

      const onMove = (e: PointerEvent) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
        const target = e.target as HTMLElement;
        hovering = !!target.closest(
          "a, button, [role='button'], input, textarea, [data-cursor]"
        );
      };
      const onDown = () => (pressed = true);
      const onUp = () => (pressed = false);

      // Snap straight to the pointer when motion is reduced; ease/trail otherwise.
      const ease = reducedMotion ? 1 : 0.2;
      const loop = () => {
        ring.x += (pos.x - ring.x) * ease;
        ring.y += (pos.y - ring.y) * ease;
        const dot = dotRef.current;
        const rg = ringRef.current;
        if (dot && rg) {
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%)`;
          const scale = pressed ? 0.7 : hovering ? 1.9 : 1;
          rg.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%,-50%) rotate(45deg) scale(${scale})`;
          rg.style.color = hovering ? "var(--cyan)" : "var(--pink)";
        }
        raf = requestAnimationFrame(loop);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      raf = requestAnimationFrame(loop);

      teardown = () => {
        document.documentElement.classList.remove("custom-cursor");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        cancelAnimationFrame(raf);
      };
    };

    // Activate for a fine pointer now, or when one appears later (a mouse is
    // plugged in, or the browser reports capabilities after first paint).
    if (fine.matches) activate();
    const onFineChange = () => {
      if (fine.matches) activate();
    };
    fine.addEventListener("change", onFineChange);

    return () => {
      fine.removeEventListener("change", onFineChange);
      teardown?.();
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-1.5 w-1.5 rounded-full bg-cyan"
        style={{ boxShadow: "0 0 10px var(--cyan)" }}
      />
      {/* Reticle: a rotated square with a gap in each side = crosshair look */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-8 w-8 text-pink transition-colors duration-150"
        style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
      >
        <span className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-current" />
        <span className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-current" />
        <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-current" />
        <span className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-current" />
      </div>
    </>
  );
}
