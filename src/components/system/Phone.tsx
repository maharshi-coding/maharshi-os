"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  Briefcase,
  Crosshair,
  Github,
  GraduationCap,
  MessageSquare,
  Radio as RadioIcon,
  Signal,
  Star,
  X,
} from "lucide-react";
import { person } from "@/data/resume";
import { useOS } from "./Providers";
import { sfx } from "@/hooks/useSfx";

interface AppDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  target?: string; // section id to fast-travel to
  external?: string; // url
  toggleRadio?: boolean;
}

const APPS: AppDef[] = [
  { id: "github", label: "GitHub", icon: Github, color: "var(--fg)", external: person.github },
  { id: "missions", label: "Missions", icon: Crosshair, color: "var(--pink)", target: "projects" },
  { id: "arsenal", label: "Arsenal", icon: Boxes, color: "var(--purple)", target: "skills" },
  { id: "stats", label: "Stats", icon: BarChart3, color: "var(--cyan)", target: "metrics" },
  { id: "saves", label: "Saves", icon: GraduationCap, color: "var(--gold)", target: "education" },
  { id: "career", label: "Career", icon: Briefcase, color: "var(--gold)", target: "experience" },
  { id: "radio", label: "Radio", icon: RadioIcon, color: "var(--pink)", toggleRadio: true },
  { id: "contact", label: "Messages", icon: MessageSquare, color: "var(--cyan)", target: "contact" },
];

/** In-game smartphone. Fast-travels between districts, opens GitHub, toggles the radio. */
export function Phone() {
  const { phoneOpen, setPhoneOpen, toggleRadio, radioOn, wanted, level, reducedMotion } = useOS();
  const panelRef = useRef<HTMLDivElement>(null);
  const clock = useClock();

  useEffect(() => {
    if (!phoneOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhoneOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [phoneOpen, setPhoneOpen]);

  const launch = (app: AppDef) => {
    sfx.play("select");
    if (app.external) {
      window.open(app.external, "_blank", "noopener,noreferrer");
      return;
    }
    if (app.toggleRadio) {
      toggleRadio();
      return;
    }
    if (app.target) {
      setPhoneOpen(false);
      document
        .getElementById(app.target)
        ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {phoneOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[75] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center sm:justify-end sm:pr-8"
          onClick={() => setPhoneOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="In-game phone"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: reducedMotion ? 0 : 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: reducedMotion ? 0 : 60, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[300px] overflow-hidden rounded-[2.2rem] border-[3px] border-[#2a1840] bg-night p-3 shadow-[0_0_60px_-8px_var(--glow)] outline-none"
          >
            {/* Phone frame notch */}
            <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-[#2a1840]" aria-hidden="true" />

            {/* Screen */}
            <div
              className="relative overflow-hidden rounded-[1.6rem] p-4"
              style={{ background: "radial-gradient(120% 90% at 50% 0%, #1a0733, #0a0512)" }}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between font-mono text-[10px] text-fg/80">
                <span className="tabular-nums">{clock}</span>
                <span className="flex items-center gap-1.5">
                  <span className="flex" aria-label={`Wanted level ${wanted}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={9}
                        fill={i < wanted ? "var(--gold)" : "transparent"}
                        color={i < wanted ? "var(--gold)" : "var(--muted)"}
                      />
                    ))}
                  </span>
                  <Signal size={11} />
                  <span className="rounded border border-fg/40 px-1 text-[8px]">LVL {level}</span>
                </span>
              </div>

              {/* Carrier / wallpaper heading */}
              <div className="mt-6 mb-5 text-center">
                <p className="font-display text-2xl text-fg">MAHARSHI<span className="text-pink">.EXE</span></p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">vice mobile · 5G</p>
              </div>

              {/* App grid */}
              <div className="grid grid-cols-4 gap-3">
                {APPS.map((app) => {
                  const Icon = app.icon;
                  const on = app.toggleRadio && radioOn;
                  return (
                    <button
                      key={app.id}
                      onClick={() => launch(app)}
                      onMouseEnter={() => sfx.play("hover")}
                      className="group flex flex-col items-center gap-1"
                      aria-label={
                        app.external
                          ? `${app.label} (opens in new tab)`
                          : app.toggleRadio
                            ? `Radio (${radioOn ? "on" : "off"})`
                            : app.label
                      }
                    >
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                        style={{
                          color: app.color,
                          boxShadow: on ? "0 0 16px var(--pink)" : undefined,
                          borderColor: on ? "var(--pink)" : undefined,
                        }}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="font-mono text-[10px] text-fg/80">{app.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Home bar */}
              <button
                onClick={() => setPhoneOpen(false)}
                className="mx-auto mt-6 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[10px] text-fg/70 transition-colors hover:text-fg"
                aria-label="Close phone"
              >
                <X size={11} /> close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small live clock for the phone status bar. */
function useClock() {
  const [clock, setClock] = useState("00:00");
  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000 * 20);
    return () => clearInterval(id);
  }, []);
  return clock;
}
