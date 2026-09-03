"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Elegant desktop cursor: a small dot that trails a ring. The ring expands on
 * interactive elements and shows "VIEW" over project cards (elements carrying
 * `data-cursor="view"`). Fully disabled on touch / coarse-pointer devices.
 */
export default function CustomCursor() {
  const wrap = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "view">("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.querySelector(".hx")?.setAttribute("data-cursor", "on");

    const target = { x: -100, y: -100 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button, input, textarea, [role='button']"
      );
      const kind = el?.getAttribute("data-cursor");
      if (kind === "view") {
        setVariant("view");
        setLabel("View");
      } else if (el) {
        setVariant("hover");
        setLabel("");
      } else {
        setVariant("default");
        setLabel("");
      }
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.querySelector(".hx")?.removeAttribute("data-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={wrap} className="hx-cursor" data-variant={variant} aria-hidden="true">
      <span className="hx-cursor__ring">{label}</span>
      <span className="hx-cursor__dot" />
    </div>
  );
}
