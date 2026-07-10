"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { experience } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { fadeUp, stagger } from "@/animations/variants";

const LEVEL_LABEL: Record<string, string> = {
  EXEC: "SOLO OP",
  PROC: "CREW JOB",
};

/**
 * Experience — "Career Mode". Each role is a completed job: a rap-sheet
 * header, a mission-type badge, then the objectives cleared.
 */
export function Experience() {
  return (
    <SectionShell
      id="experience"
      module="jobs"
      title="Career Mode"
      intro="Jobs pulled off so far. Every one completed — no bad endings."
    >
      <div className="space-y-6">
        {experience.map((job, i) => {
          const solo = job.level === "EXEC";
          const accent = solo ? "var(--pink)" : "var(--cyan)";
          return (
            <motion.article
              key={job.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="group relative overflow-hidden rounded-2xl border border-line bg-night/50 backdrop-blur-sm transition-all duration-300 hover:border-pink/50 hover:shadow-neon"
            >
              {/* Left accent rail */}
              <span
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
                aria-hidden="true"
              />

              {/* Rap-sheet header */}
              <motion.header
                variants={fadeUp}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-6 py-4 font-mono text-xs"
              >
                <span
                  className="rounded-full px-2.5 py-1 font-display tracking-wider"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {LEVEL_LABEL[job.level]}
                </span>
                <span className="text-muted">job #{String(i + 1).padStart(2, "0")}</span>
                <span className="tabular-nums text-muted">{job.period}</span>
                <span className="ml-auto text-muted">{job.location}</span>
              </motion.header>

              <div className="px-6 py-6 sm:px-8">
                <motion.div variants={fadeUp}>
                  <h3 className="font-display text-2xl tracking-wide text-fg sm:text-3xl">
                    {job.role}
                  </h3>
                  <p className="mt-1 font-mono text-sm" style={{ color: accent }}>
                    {job.org}
                  </p>
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
                >
                  objectives cleared
                </motion.p>
                <motion.ul variants={stagger} className="space-y-3">
                  {job.logs.map((log, j) => (
                    <motion.li
                      key={j}
                      variants={fadeUp}
                      className="flex gap-3 text-sm leading-relaxed text-fg/90 sm:text-base"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-[3px] shrink-0 text-neon"
                        aria-hidden="true"
                      />
                      {log}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionShell>
  );
}
