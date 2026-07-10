"use client";

import { useEffect, useRef, useState } from "react";
import { useOS } from "@/components/system/Providers";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/**
 * DecoderText — text that resolves out of glitch glyphs,
 * character by character, like a signal locking on.
 */
export function DecoderText({
  text,
  delay = 0,
  className,
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const { reducedMotion } = useOS();
  const [output, setOutput] = useState(reducedMotion ? text : "");
  const frame = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      setOutput(text);
      return;
    }
    let raf = 0;
    let started = false;
    const start = performance.now() + delay;

    const step = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(step);
        return;
      }
      started = true;
      frame.current += 1;
      // Each character locks in after ~2 frames of scramble, staggered.
      const progress = Math.floor(frame.current / 2.2);
      const resolved = text.slice(0, progress);
      let scramble = "";
      const scrambleLen = Math.min(3, text.length - progress);
      for (let i = 0; i < scrambleLen; i++) {
        scramble += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(resolved + scramble);
      if (progress < text.length) {
        raf = requestAnimationFrame(step);
      } else {
        setOutput(text);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (started) setOutput(text);
    };
  }, [text, delay, reducedMotion]);

  return (
    <Tag className={className}>
      {/* Real text for crawlers and screen readers… */}
      <span className="sr-only">{text}</span>
      {/* …the scramble is purely decorative (nbsp placeholder keeps height). */}
      <span aria-hidden="true">{output || " "}</span>
    </Tag>
  );
}
