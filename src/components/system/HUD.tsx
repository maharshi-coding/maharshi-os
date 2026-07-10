"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Smartphone, Star } from "lucide-react";
import { districts } from "@/data/resume";
import { useOS } from "./Providers";
import { Minimap } from "./Minimap";
import { Radio } from "./Radio";
import { sfx } from "@/hooks/useSfx";

/**
 * The persistent game HUD. Tracks the district in view (location readout +
 * minimap + XP), shows the wanted level, and exposes the phone / quick-travel
 * controls. The container ignores pointer events; only the controls capture them.
 */
export function HUD() {
  const {
    loaded,
    district,
    setDistrict,
    markVisited,
    wanted,
    xp,
    level,
    setPhoneOpen,
    setPaletteOpen,
  } = useOS();

  const current = districts.find((d) => d.id === district) ?? districts[0];
  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef(level);

  // Show the right modifier key per platform (⌘ on macOS, Ctrl elsewhere).
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent));
  }, []);

  // Track the section in view → drives location, minimap and progression.
  useEffect(() => {
    if (!loaded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDistrict(entry.target.id);
            markVisited(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    districts.forEach((d) => {
      const el = document.getElementById(d.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loaded, setDistrict, markVisited]);

  // "LEVEL UP" toast when the level rises.
  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUp(true);
      sfx.play("success");
      const t = setTimeout(() => setLevelUp(false), 2400);
      prevLevel.current = level;
      return () => clearTimeout(t);
    }
    prevLevel.current = level;
  }, [level]);

  if (!loaded) return null;

  const xpInLevel = xp % 1200;
  const xpPct = (xpInLevel / 1200) * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 select-none">
      {/* ── Top-left: brand + location ─────────────────────────── */}
      <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
        <a
          href="#home"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-line bg-night/70 px-3 py-1.5 font-display text-sm tracking-wider text-fg backdrop-blur-md"
          aria-label="Back to top"
        >
          <span className="h-2 w-2 rounded-full bg-pink animate-pulse-led" aria-hidden="true" />
          MAHARSHI<span className="text-pink">.EXE</span>
        </a>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-cyan sm:text-xs"
          >
            <span className="rounded bg-cyan/15 px-1.5 py-0.5 text-cyan">{current.code}</span>
            <span className="max-w-[52vw] truncate text-fg/90">{current.location}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Top-right: wanted + quick travel ───────────────────── */}
      <div className="absolute right-3 top-3 flex flex-col items-end gap-2 sm:right-5 sm:top-5">
        <div
          className="flex items-center gap-1 rounded-full border border-line bg-night/70 px-2.5 py-1.5 backdrop-blur-md"
          aria-label={`Wanted level ${wanted} of 6`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < wanted ? "" : "opacity-25"}
              fill={i < wanted ? "var(--gold)" : "transparent"}
              color={i < wanted ? "var(--gold)" : "var(--muted)"}
              style={i < wanted ? { filter: "drop-shadow(0 0 4px var(--gold))" } : undefined}
            />
          ))}
        </div>
        <button
          onClick={() => {
            sfx.play("click");
            setPaletteOpen(true);
          }}
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-night/70 px-3 py-1.5 font-mono text-[11px] text-muted backdrop-blur-md transition-colors hover:border-cyan hover:text-cyan"
          aria-label={`Open quick travel and cheats (${isMac ? "Command" : "Ctrl"}+K)`}
        >
          {isMac ? <Command size={12} aria-hidden="true" /> : "Ctrl"} K
        </button>
      </div>

      {/* ── Bottom-left: minimap (only on wide screens where it clears the
             centered content column, so it never covers text) ──────── */}
      <div className="absolute bottom-5 left-5 hidden xl:block">
        <Minimap />
      </div>

      {/* ── Bottom-right: radio + xp + phone ───────────────────── */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
        <Radio />
        <div className="flex items-center gap-2">
          {/* XP / level — only on wide screens so it clears the content column */}
          <div className="pointer-events-auto hidden items-center gap-2 rounded-2xl border border-line bg-night/70 px-3 py-2 backdrop-blur-md xl:flex">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 font-display text-xs text-gold">
              {level}
            </div>
            <div className="w-24">
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted">
                <span>XP</span>
                <span className="tabular-nums text-gold">{xp}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel-strong">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${xpPct}%`, background: "var(--gold)", boxShadow: "0 0 8px var(--gold)" }}
                />
              </div>
            </div>
          </div>
          {/* Phone */}
          <button
            onClick={() => {
              sfx.play("select");
              setPhoneOpen(true);
            }}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl border border-pink bg-pink/15 text-pink backdrop-blur-md shadow-neon transition-transform hover:scale-105 active:scale-95"
            aria-label="Open phone"
          >
            <Smartphone size={20} />
          </button>
        </div>
      </div>

      {/* ── LEVEL UP toast ─────────────────────────────────────── */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-xl border border-gold bg-night/85 px-6 py-3 text-center backdrop-blur-md shadow-neon"
          >
            <p className="font-display text-2xl text-gold neon-gold">LEVEL UP</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              rank {level} reached
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
