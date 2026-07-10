"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Crosshair, Smartphone } from "lucide-react";
import { person } from "@/data/resume";
import { useOS } from "@/components/system/Providers";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Skyline } from "@/components/ui/Skyline";

// The 3D scene loads client-side only, after the main bundle.
const ViceCity = dynamic(() => import("@/components/three/ViceCity"), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero — "WELCOME TO VICE CITY". A neon sunset drive: the synthwave scene
 * hums behind the identity lockup on capable screens, with a pure-SVG skyline
 * fallback on mobile / reduced-motion.
 */
export function Hero() {
  const { loaded, reducedMotion, setPhoneOpen } = useOS();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, reducedMotion ? 0 : -100]);
  const sceneOpacity = useTransform(scrollY, [0, 520], [1, 0]);

  const [rich, setRich] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    setRich(desktop && !reducedMotion);
  }, [reducedMotion]);

  const show = loaded;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "var(--sunset)", opacity: 0.2 }} aria-hidden="true" />
      <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
        {show && rich ? (
          <ViceCity animate={!reducedMotion} className="absolute inset-0 h-full w-full" />
        ) : (
          <Skyline className="absolute bottom-0 left-0 h-[58%] w-full opacity-90" />
        )}
      </motion.div>
      {/* Legibility washes: a strong left panel where the copy lives, a bottom
          scrim, and a vignette so text stays readable over the animated scene. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night via-night/80 to-night/10" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-night via-night/75 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(130% 85% at 45% 55%, transparent 26%, rgba(10,5,18,0.72) 100%)" }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-24 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-night/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-led" aria-hidden="true" />
          Press start · single player
        </motion.p>

        <h1 className="font-display text-[17vw] leading-[0.82] text-fg sm:text-8xl lg:text-[9.5rem]">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block drop-shadow-[0_2px_30px_rgba(255,46,151,0.45)]"
          >
            MAHARSHI
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block text-sunset"
          >
            BAROT
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-fg/90 sm:text-lg"
            style={{ textShadow: "0 1px 14px rgba(10,5,18,0.95), 0 0 4px rgba(10,5,18,0.8)" }}
          >
            <span className="font-display tracking-wide text-pink">{person.role}.</span>{" "}
            {person.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
            {[
              `loc: ${person.location}`,
              "M.S. CIS @ TAMU-CC",
              "6 missions cleared",
              "9 languages",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line bg-night/75 px-3 py-1.5 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton href="#projects" variant="solid" ariaLabel="Start the missions">
              <Crosshair size={15} aria-hidden="true" /> START MISSIONS
            </MagneticButton>
            <MagneticButton onClick={() => setPhoneOpen(true)} variant="outline" ariaLabel="Open phone">
              <Smartphone size={14} aria-hidden="true" /> open phone
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#education"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-pink"
        aria-label="Drive into the city"
      >
        drive in
        <motion.span
          animate={reducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown size={16} aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
