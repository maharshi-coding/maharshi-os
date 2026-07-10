"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { projects, secretMission } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { ProjectWindow } from "./ProjectWindow";
import { useOS } from "@/components/system/Providers";

/**
 * Projects — "Mission Row". Six missions, each a full briefing. The Konami
 * cheat unlocks a hidden seventh (a playful signature, not a résumé claim).
 */
export function Projects() {
  const { secretUnlocked } = useOS();

  return (
    <SectionShell
      id="projects"
      module="mission_row"
      title="Missions"
      intro="Six missions, each shipped end-to-end by one operative. Open a briefing — every one is still live."
    >
      <div className="space-y-10 sm:space-y-14">
        {projects.map((project, i) => (
          <ProjectWindow key={project.id} project={project} index={i} />
        ))}

        <AnimatePresence>
          {secretUnlocked && (
            <motion.article
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border-2 border-gold bg-night/60 p-7 backdrop-blur-sm sm:p-9"
              style={{ boxShadow: "0 0 50px -12px var(--gold)" }}
            >
              <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
                <Lock size={13} aria-hidden="true" /> classified · secret mission unlocked
              </div>
              <h3 className="font-display text-3xl tracking-wide text-gold neon-gold sm:text-4xl">
                {secretMission.codename}
              </h3>
              <div className="mt-5 space-y-1.5 font-mono text-sm leading-6 text-fg/80">
                {secretMission.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
