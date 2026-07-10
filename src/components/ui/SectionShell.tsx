"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

/**
 * SectionShell — every district loads through the same chrome: a neon
 * "location unlocked" tag, a big display title and a sunset divider.
 */
export function SectionShell({
  id,
  module,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  module: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 ${className}`}
    >
      <motion.header
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12 sm:mb-16"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-night/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-led" aria-hidden="true" />
          location unlocked · {module}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-5xl leading-[0.9] text-fg sm:text-7xl"
        >
          {title}
        </motion.h2>
        {intro && (
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-relaxed text-fg/90 sm:text-lg"
          >
            {intro}
          </motion.p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-7 h-[3px] w-full origin-left rounded-full"
          style={{ background: "var(--sunset-h)", boxShadow: "0 0 14px var(--glow)" }}
          aria-hidden="true"
        />
      </motion.header>
      {children}
    </section>
  );
}
