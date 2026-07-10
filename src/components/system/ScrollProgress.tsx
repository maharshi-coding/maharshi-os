"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Reading progress rendered as a neon "road" line across the very top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left"
      style={{
        scaleX,
        background: "var(--sunset-h)",
        boxShadow: "0 0 12px var(--glow)",
      }}
    />
  );
}
