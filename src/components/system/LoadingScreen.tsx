"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loadingTips, person } from "@/data/resume";
import { useOS } from "./Providers";
import { Skyline } from "@/components/ui/Skyline";

/**
 * The GTA-style loading screen: neon sunset art streams the city in, a
 * progress bar fills with rotating tips, then the visitor presses ENTER (a
 * real user gesture) to drop into Vice City. Runs once per session.
 */
export function LoadingScreen() {
  const { completeLoad, reducedMotion } = useOS();
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  // Fill the progress bar.
  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      setReady(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const DURATION = 2600;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(step);
      else setReady(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // Rotate loading tips.
  useEffect(() => {
    const id = setInterval(() => setTip((t) => (t + 1) % loadingTips.length), 2400);
    return () => clearInterval(id);
  }, []);

  const enter = () => {
    if (done.current || !ready) return;
    done.current = true;
    setLeaving(true);
    setTimeout(completeLoad, 650);
  };

  // ENTER / SPACE / click enters once ready.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ready && (e.key === "Enter" || e.key === " ")) enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="loading"
          role="status"
          aria-label="Loading Vice City — press Enter to start"
          className="fixed inset-0 z-[90] flex flex-col overflow-hidden bg-night"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          onClick={enter}
        >
          {/* Art */}
          <div className="relative flex-1">
            <Skyline className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/50 via-transparent to-night" />

            {/* Logo lockup */}
            <div className="absolute inset-x-0 top-[14%] flex flex-col items-center px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-[11px] uppercase tracking-[0.6em] text-cyan sm:text-xs"
              >
                A Maharshi Barot Production
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-display text-6xl leading-[0.85] text-fg drop-shadow-[0_2px_30px_rgba(255,46,151,0.5)] sm:text-8xl lg:text-9xl"
              >
                PROJECT
                <br />
                <span className="text-sunset">VICE</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 font-mono text-sm tracking-[0.3em] text-fg/90 sm:text-base"
              >
                MAHARSHI<span className="text-pink">.EXE</span>
              </motion.p>
            </div>
          </div>

          {/* Loading dock */}
          <div className="relative z-10 w-full bg-night/80 px-6 py-6 backdrop-blur-sm sm:px-10 sm:py-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
                <span>{person.role}</span>
                <span className="tabular-nums text-cyan">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-strong">
                <div
                  className="h-full rounded-full transition-[width] duration-100"
                  style={{
                    width: `${progress}%`,
                    background: "var(--sunset-h)",
                    boxShadow: "0 0 16px var(--glow)",
                  }}
                />
              </div>

              <div className="mt-1 flex min-h-[20px] items-center justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tip}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-[11px] text-muted sm:text-xs"
                  >
                    {loadingTips[tip]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-2 flex h-12 items-center justify-center">
                <AnimatePresence>
                  {ready && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={enter}
                      className="animate-pulse-led rounded-full bg-pink px-8 py-3 font-display text-sm tracking-[0.25em] text-[#0a0512] shadow-neon"
                      style={{ animationDuration: "2s" }}
                    >
                      ▶ PRESS ENTER TO PLAY
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
