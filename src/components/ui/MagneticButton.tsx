"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useOS } from "@/components/system/Providers";
import { sfx } from "@/hooks/useSfx";
import { cn } from "@/lib/utils";

/**
 * MagneticButton — leans toward the cursor as it approaches,
 * springs back on leave. Wraps any anchor/button content.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "solid",
  external,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
  external?: boolean;
  ariaLabel?: string;
}) {
  const { reducedMotion } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.3 });

  const onMove = (e: MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles = cn(
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-[filter,color,border-color] duration-200",
    variant === "solid" &&
      "bg-pink font-display tracking-[0.15em] text-[#0a0512] shadow-neon hover:brightness-110",
    variant === "outline" &&
      "border border-line font-mono text-fg hover:border-cyan hover:text-cyan",
    variant === "ghost" && "font-mono text-muted hover:text-pink",
    className
  );

  const handleClick = () => {
    sfx.play("click");
    onClick?.();
  };

  const inner = href ? (
    <a
      href={href}
      onClick={handleClick}
      className={styles}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  ) : (
    <button onClick={handleClick} className={styles} aria-label={ariaLabel}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onMouseEnter={() => sfx.play("hover")}
      style={reducedMotion ? undefined : { x: sx, y: sy }}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}
