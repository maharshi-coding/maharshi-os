"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillCategories, skillEdges, projects } from "@/data/resume";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Build, for every skill, the set of project names it powers — following the
 * skillEdges graph one hop through frameworks (e.g. Python → FastAPI → project).
 */
function useSkillProjectMap() {
  return useMemo(() => {
    const projectNames = new Set(projects.map((p) => p.name));
    const adj = new Map<string, Set<string>>();
    const add = (a: string, b: string) => {
      if (!adj.has(a)) adj.set(a, new Set());
      adj.get(a)!.add(b);
    };
    for (const [a, b] of skillEdges) {
      add(a, b);
      add(b, a);
    }
    const skillToProjects = new Map<string, Set<string>>();
    for (const node of adj.keys()) {
      const reached = new Set<string>();
      const seen = new Set<string>([node]);
      const queue = [...(adj.get(node) ?? [])];
      let depth = 0;
      let frontier = queue.length;
      while (queue.length && depth < 2) {
        const next = queue.shift()!;
        frontier--;
        if (!seen.has(next)) {
          seen.add(next);
          if (projectNames.has(next)) reached.add(next);
          for (const n of adj.get(next) ?? []) if (!seen.has(n)) queue.push(n);
        }
        if (frontier === 0) {
          depth++;
          frontier = queue.length;
        }
      }
      skillToProjects.set(node, reached);
    }
    return skillToProjects;
  }, []);
}

export default function Skills() {
  const skillToProjects = useSkillProjectMap();
  const [hover, setHover] = useState<string | null>(null);
  const [hoverProject, setHoverProject] = useState<string | null>(null);

  const activeProjects = hover ? skillToProjects.get(hover) ?? new Set<string>() : null;

  const projectToSkills = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const [skill, set] of skillToProjects) {
      for (const proj of set) {
        if (!map.has(proj)) map.set(proj, new Set());
        map.get(proj)!.add(skill);
      }
    }
    return map;
  }, [skillToProjects]);

  const activeSkills = hoverProject ? projectToSkills.get(hoverProject) ?? new Set<string>() : null;

  return (
    <section id="skills" className="hx-section hx-skills">
      <div className="hx-container">
        <header className="hx-skills__head">
          <p className="hx-eyebrow">Technical Ecosystem</p>
          <h2 className="hx-h2">The tools, and what they built.</h2>
          <p className="hx-lead">
            Hover a technology to light up the projects it powers — or a project to see its stack.
          </p>
        </header>

        <div className="hx-skills__grid">
          <div className="hx-skills__cats">
            {skillCategories.map((cat) => (
              <motion.div
                key={cat.id}
                className="hx-skills__cat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="hx-skills__catlabel">{cat.label}</p>
                <ul className="hx-tags">
                  {cat.skills.map((s) => {
                    const dim = activeSkills ? !activeSkills.has(s) : false;
                    const lit = activeSkills ? activeSkills.has(s) : hover === s;
                    return (
                      <li
                        key={s}
                        className="hx-tag hx-tag--interactive"
                        data-lit={lit}
                        data-dim={dim}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(null)}
                      >
                        {s}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

          <aside className="hx-skills__projects">
            <p className="hx-skills__catlabel">Projects</p>
            <ul className="hx-skills__plist">
              {projects.map((p) => {
                const lit = activeProjects ? activeProjects.has(p.name) : hoverProject === p.name;
                const dim = activeProjects ? !activeProjects.has(p.name) : false;
                return (
                  <li
                    key={p.id}
                    className="hx-skills__pitem"
                    data-lit={lit}
                    data-dim={dim}
                    onMouseEnter={() => setHoverProject(p.name)}
                    onMouseLeave={() => setHoverProject(null)}
                  >
                    <span className="hx-skills__pdot" />
                    <span>{p.name}</span>
                    <span className="hx-skills__pkind">{p.kind}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
