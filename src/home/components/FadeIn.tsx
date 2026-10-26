"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ElementType, ReactNode } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Scroll-into-view reveal. Fades + translates its children in once, the first
 * time they enter the viewport. `as` picks the rendered (motion) element so
 * headings/paragraphs keep their semantics. Reduced motion is honoured globally
 * via <MotionConfig reducedMotion="user">.
 */
export default function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // framer exposes a motion component for every intrinsic tag (motion.h1 …).
  // All share the same prop surface, so we cast to a concrete one for typing.
  const MotionTag = (motion[as as keyof typeof motion] ?? motion.div) as typeof motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
