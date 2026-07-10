"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { SkillGraph } from "./SkillGraph";
import { fadeUp, stagger } from "@/animations/variants";

// Matches the neon palette used inside the graph canvas. Purple is lightened
// (#a56bff) so the label text clears WCAG AA (raw --purple is only 3.4:1).
const CAT_COLOR: Record<string, string> = {
  ai: "var(--pink)",
  lang: "var(--cyan)",
  frontend: "#a56bff",
  backend: "var(--gold)",
  db: "var(--green)",
  cloud: "#ff6b3d",
};

/**
 * Skills — "The Arsenal". The interactive neon graph is the centerpiece; the
 * colour-coded readout below doubles as the accessible / keyboard fallback.
 */
export function Skills() {
  return (
    <SectionShell
      id="skills"
      module="arsenal"
      title="The Arsenal"
      intro="The whole stack wired as one system: languages feed frameworks, frameworks feed missions, missions feed infrastructure. Hover any node to trace it."
    >
      <SkillGraph />

      {/* Colour-coded readout — also the screen-reader / keyboard path */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((cat) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: CAT_COLOR[cat.id], boxShadow: `0 0 8px ${CAT_COLOR[cat.id]}` }}
                aria-hidden="true"
              />
              <span style={{ color: CAT_COLOR[cat.id] }}>{cat.label}</span>
            </h3>
            <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
              {cat.skills.map((s) => (
                <li
                  key={s}
                  className="font-mono text-[13px] text-fg/90 transition-colors duration-200 hover:text-fg"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
