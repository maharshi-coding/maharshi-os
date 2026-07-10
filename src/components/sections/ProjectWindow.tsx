"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, Target } from "lucide-react";
import type { Project } from "@/data/resume";
import { ArchDiagram } from "./ArchDiagram";
import { cn } from "@/lib/utils";
import { sfx } from "@/hooks/useSfx";

type Tab = "briefing" | "intel" | "debrief";

/** Cosmetic difficulty: derived from how much tech a mission juggles. */
function difficulty(project: Project) {
  return Math.max(2, Math.min(5, Math.round(project.stack.length / 2) + (project.featured ? 1 : 0)));
}

function Stars({ n, label }: { n: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={label ?? `Difficulty ${n} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-sm leading-none"
          style={{
            color: i < n ? "var(--gold)" : "var(--muted)",
            opacity: i < n ? 1 : 0.35,
            textShadow: i < n ? "0 0 6px var(--gold)" : "none",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * ProjectWindow — each project is a mission briefing: rap-sheet header,
 * difficulty rating, target summary and briefing / intel / debrief tabs.
 */
export function ProjectWindow({ project, index }: { project: Project; index: number }) {
  const [tab, setTab] = useState<Tab>("briefing");
  const diff = difficulty(project);

  const tabs: { id: Tab; label: string }[] = [
    { id: "briefing", label: "briefing" },
    { id: "intel", label: "intel" },
    { id: "debrief", label: "debrief" },
  ];

  return (
    <motion.article
      id={`project-${project.id}`}
      initial={{ opacity: 0, y: 48, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-night/50 backdrop-blur-sm transition-shadow duration-500 hover:shadow-neon-lg"
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-pink/15 font-mono text-[10px] text-pink" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs text-muted">
          MISSION //<span className="text-cyan">{project.binary}</span>
        </span>
        <span className="ml-auto hidden rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
          {project.kind}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">threat</span>
          <Stars n={diff} label={`Threat level ${diff} of 5`} />
        </span>
      </header>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className={cn("grid gap-8 p-6 sm:p-9 lg:grid-cols-5", index % 2 && "lg:[direction:rtl]")}>
        <div className="lg:col-span-3 lg:[direction:ltr]">
          <h3 className="font-display text-3xl tracking-wide text-fg sm:text-4xl">
            {project.name}
          </h3>

          <div className="mt-4 flex items-start gap-2.5">
            <Target size={16} className="mt-1 shrink-0 text-pink" aria-hidden="true" />
            <p className="max-w-prose text-sm leading-relaxed text-fg/90 sm:text-base">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pink">target: </span>
              {project.summary}
            </p>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label={`${project.name} details`} className="mt-7 flex gap-1 border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  sfx.play("click");
                }}
                className={cn(
                  "relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors",
                  tab === t.id ? "text-cyan" : "text-muted hover:text-fg"
                )}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId={`tab-${project.id}`}
                    className="absolute inset-x-2 -bottom-px h-[2px] bg-cyan"
                    style={{ boxShadow: "0 0 8px var(--cyan)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab panels — content is never hidden via opacity on enter (only a
             slide), and the first tab skips the mount animation, so objectives
             stay readable even if a mount animation stalls. */}
          <div className="min-h-[190px] pt-6">
            <AnimatePresence mode="wait" initial={false}>
              {tab === "briefing" && (
                <motion.ul
                  key="briefing"
                  role="tabpanel"
                  initial={{ y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">objectives</p>
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm leading-relaxed text-fg/90 sm:text-base">
                      <Crosshair size={15} className="mt-1 shrink-0 text-cyan" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </motion.ul>
              )}

              {tab === "intel" && (
                <motion.div
                  key="intel"
                  role="tabpanel"
                  initial={{ y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <ArchDiagram project={project} />
                </motion.div>
              )}

              {tab === "debrief" && (
                <motion.dl
                  key="debrief"
                  role="tabpanel"
                  initial={{ y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5 text-sm leading-relaxed sm:text-base"
                >
                  <div>
                    <dt className="mb-1 font-mono text-[11px] uppercase tracking-widest text-pink">
                      complication
                    </dt>
                    <dd className="text-fg/90">{project.challenge}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[11px] uppercase tracking-widest text-cyan">
                      the play
                    </dt>
                    <dd className="text-fg/90">{project.approach}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[11px] uppercase tracking-widest text-neon">
                      payout
                    </dt>
                    <dd className="text-fg/90">{project.impact}</dd>
                  </div>
                </motion.dl>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Side rail: loadout + status ──────────────────────────── */}
        <aside className="lg:col-span-2 lg:[direction:ltr]">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
            loadout
          </p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech, i) => (
              <motion.li
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
                className="rounded-lg border border-line bg-panel-strong px-3 py-1.5 font-mono text-xs text-fg transition-colors duration-200 hover:border-cyan hover:text-cyan"
              >
                {tech}
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 space-y-2 rounded-xl border border-line bg-night/40 p-4 font-mono text-[11px] leading-6 text-muted">
            <div className="flex justify-between">
              <span>type</span>
              <span className="text-fg">{project.kind}</span>
            </div>
            <div className="flex justify-between">
              <span>threat</span>
              <Stars n={diff} />
            </div>
            <div className="flex justify-between">
              <span>status</span>
              <span className="flex items-center gap-1.5 text-neon">
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse-led" aria-hidden="true" />
                active
              </span>
            </div>
            <div className="flex justify-between">
              <span>payout</span>
              <span className="text-gold">shipped end-to-end</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.article>
  );
}
