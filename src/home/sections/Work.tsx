"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "@/data/resume";

const EASE = [0.22, 1, 0.36, 1] as const;

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <motion.article
      className="hx-work__row"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="hx-work__body">
        <div className="hx-work__index">
          <span>{num}</span>
          <span className="hx-work__count">/ 06</span>
        </div>
        <p className="hx-work__kind">{project.kind}</p>
        <h3 className="hx-work__name">{project.name}</h3>
        <p className="hx-work__summary">{project.summary}</p>

        <ul className="hx-tags">
          {project.stack.slice(0, 7).map((t) => (
            <li key={t} className="hx-tag">
              {t}
            </li>
          ))}
        </ul>

        <div className="hx-work__links">
          {project.live && (
            <a className="hx-inlink" href={project.live} target="_blank" rel="noopener noreferrer">
              {project.liveLabel ?? "Live"}
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          )}
          <a className="hx-inlink" href={project.github} target="_blank" rel="noopener noreferrer">
            <Github size={14} strokeWidth={2} />
            Code
          </a>
        </div>
      </div>

      {/* Visual: the project's real architecture, as a connected flow. */}
      <a
        className="hx-work__visual"
        href={project.live ?? project.github}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="view"
        aria-label={`Open ${project.name}`}
      >
        <span className="hx-work__ghost">{num}</span>
        <ul className="hx-flow">
          {project.nodes.map((node, i) => (
            <li key={i} className="hx-flow__node">
              <span className="hx-flow__dot" />
              {node}
            </li>
          ))}
        </ul>
      </a>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="hx-section hx-work">
      <div className="hx-container">
        <header className="hx-work__head">
          <p className="hx-eyebrow">Selected Work</p>
          <h2 className="hx-h2">Products I&apos;ve shipped end-to-end.</h2>
          <p className="hx-lead">
            Six projects across AI agents, full-stack apps, mobile and computer vision — each
            taken from idea to a running, tested product.
          </p>
        </header>

        <div className="hx-work__list">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
