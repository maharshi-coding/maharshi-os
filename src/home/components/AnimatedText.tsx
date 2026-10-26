"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/** One character: a dim placeholder with a scroll-driven bright copy on top. */
function Char({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0.2 }}>{children}</span>
      <motion.span style={{ position: "absolute", left: 0, top: 0, opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Character-by-character scroll reveal. Each character brightens from 0.2 → 1 as
 * the paragraph moves through the viewport. Word-aware so words never break
 * mid-wrap.
 *
 * Renders plain text on the server AND the first client render (and always under
 * reduced motion); the split/animated version only mounts after hydration, so
 * the SSR and client markup always match (no hydration mismatch).
 */
export default function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  if (!mounted || reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  const words = text.split(" ");
  const total = text.length;
  let idx = 0;

  return (
    <p ref={ref} className={className}>
      {words.map((word, wi) => {
        const chars = word.split("").map((ch) => {
          const start = idx / total;
          const end = (idx + 1) / total;
          idx += 1;
          return (
            <Char key={start} progress={scrollYProgress} range={[start, end]}>
              {ch}
            </Char>
          );
        });
        idx += 1; // account for the space between words
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{chars}</span>
            {wi < words.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </p>
  );
}
