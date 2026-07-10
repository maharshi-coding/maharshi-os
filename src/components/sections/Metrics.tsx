"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { metrics } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { useOS } from "@/components/system/Providers";

/**
 * One stat that spins up when scrolled into view. Uses a plain
 * IntersectionObserver plus a fallback timer, so the count-up can never get
 * stuck at 0 (the failure mode in the previous build).
 */
function Stat({
  value,
  suffix,
  label,
  note,
  delay,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  note: string;
  delay: number;
  index: number;
}) {
  const { reducedMotion } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const run = () => {
      if (started.current) return;
      started.current = true;
      let raf = 0;
      const duration = 1400;
      const start = performance.now() + delay;
      const step = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(isFloat ? +(value * eased).toFixed(2) : Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      cleanup.push(() => cancelAnimationFrame(raf));
    };

    const cleanup: (() => void)[] = [];
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    if (el) observer.observe(el);
    // Fallback: start regardless after a beat (covers any observer miss).
    const fallback = setTimeout(run, 1600);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      cleanup.forEach((fn) => fn());
    };
  }, [value, delay, isFloat, reducedMotion]);

  const accent = ["var(--pink)", "var(--cyan)", "var(--gold)", "var(--purple)"][index % 4];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-night/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-pink/50"
    >
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
        aria-hidden="true"
      />
      <p className="font-display text-5xl tabular-nums text-fg sm:text-6xl" style={{ textShadow: `0 0 18px ${accent}55` }}>
        {isFloat ? display.toFixed(2) : display}
        <span style={{ color: accent }}>{suffix}</span>
      </p>
      <p className="mt-3 font-display text-sm tracking-wide text-fg">{label}</p>
      <p className="mt-1 font-mono text-xs text-muted">{note}</p>
    </motion.div>
  );
}

/** Stats — "Player Stats". Counters derived strictly from the résumé. */
export function Metrics() {
  return (
    <SectionShell
      id="metrics"
      module="stats"
      title="Player Stats"
      intro="Straight from the save file. No cheats used to earn these."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Stat
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            note={m.note}
            delay={i * 120}
            index={i}
          />
        ))}
      </div>
    </SectionShell>
  );
}
