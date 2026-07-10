"use client";

import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { education } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { fadeUp, stagger } from "@/animations/variants";

const STATUS_LABEL: Record<string, string> = {
  RUNNING: "AUTOSAVING",
  COMPLETE: "SAVED",
};

/**
 * Education — "Save Files". A neon checkpoint timeline; each save slot slides
 * in as its spine draws itself on scroll.
 */
export function Education() {
  return (
    <SectionShell
      id="education"
      module="checkpoints"
      title="Save Files"
      intro="Three checkpoints reached. The most recent one is still autosaving."
    >
      <div className="relative">
        {/* Spine */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-[2px] origin-top sm:left-1/2"
          style={{ background: "linear-gradient(var(--pink), var(--purple), transparent)" }}
          aria-hidden="true"
        />

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-14"
        >
          {education.map((entry, i) => {
            const running = entry.status === "RUNNING";
            return (
              <motion.li
                key={entry.id}
                variants={fadeUp}
                className={`relative grid gap-4 pl-10 sm:grid-cols-2 sm:gap-16 sm:pl-0 ${
                  i % 2 ? "sm:text-left" : "sm:text-right"
                }`}
              >
                {/* Node */}
                <span
                  className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-pink bg-night sm:left-1/2 sm:-translate-x-1/2"
                  style={{ boxShadow: "0 0 10px var(--pink)" }}
                  aria-hidden="true"
                >
                  <span
                    className={`h-[5px] w-[5px] rounded-full bg-pink ${running ? "animate-pulse-led" : ""}`}
                  />
                </span>

                {/* Card — alternate sides on desktop */}
                <div className={i % 2 ? "sm:order-2" : "sm:order-1"}>
                  <div
                    className={`group inline-block rounded-2xl border border-line bg-night/50 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-pink/60 hover:shadow-neon ${
                      i % 2 ? "" : "sm:ml-auto"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
                      <Save size={13} className={running ? "text-cyan" : "text-muted"} aria-hidden="true" />
                      <span className={running ? "text-cyan" : "text-muted"}>
                        {STATUS_LABEL[entry.status]}
                      </span>
                    </div>
                    <h3 className="font-display text-xl tracking-wide text-fg sm:text-2xl">
                      {entry.institution}
                    </h3>
                    <p className="mt-1.5 text-sm text-fg/90 sm:text-base">{entry.degree}</p>
                    <p className="mt-3 font-mono text-xs text-gold">{entry.detail}</p>
                  </div>
                </div>

                <div
                  className={`font-mono text-xs text-muted sm:self-start sm:pt-7 sm:text-sm ${
                    i % 2 ? "sm:order-1 sm:text-right" : "sm:order-2 sm:text-left"
                  }`}
                >
                  {entry.period}
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </SectionShell>
  );
}
