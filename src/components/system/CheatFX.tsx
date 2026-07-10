"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOS } from "./Providers";

/** Renders cheat feedback: the code toast and the "star rain" particle burst. */
export function CheatFX() {
  const { cheatToast, starRain, reducedMotion } = useOS();

  return (
    <>
      {/* Cheat activation toast */}
      <AnimatePresence>
        {cheatToast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-24 z-[86] -translate-x-1/2 rounded-xl border border-pink bg-night/90 px-6 py-3 text-center backdrop-blur-md shadow-neon"
            role="status"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">
              cheat activated
            </p>
            <p className="mt-1 font-display text-lg tracking-wider text-pink neon">{cheatToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star rain */}
      {starRain && !reducedMotion && (
        <div className="pointer-events-none fixed inset-0 z-[84] overflow-hidden" aria-hidden="true">
          {Array.from({ length: 44 }).map((_, i) => {
            const left = (i * 37) % 100;
            const delay = (i % 10) * 0.18;
            const dur = 2.4 + ((i * 13) % 20) / 10;
            const size = 10 + ((i * 7) % 16);
            return (
              <span
                key={i}
                className="absolute top-0 font-display"
                style={{
                  left: `${left}%`,
                  fontSize: size,
                  color: i % 2 ? "var(--gold)" : "var(--pink)",
                  textShadow: "0 0 8px currentColor",
                  animation: `star-fall ${dur}s linear ${delay}s infinite`,
                }}
              >
                ★
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}
