"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import FadeIn from "../components/FadeIn";
import LiveProjectButton from "../components/LiveProjectButton";
import { projects, type Project } from "@/data/resume";

const PROFILE = "https://github.com/maharshi-coding";

function CardInner({ project, num }: { project: Project; num: string }) {
  // A private repo would 404 — fall back to the GitHub profile for those.
  const codeHref = project.repoPrivate ? PROFILE : project.github;
  const liveHref = project.live ?? codeHref;
  const liveLabel = project.live
    ? project.liveLabel ?? "Live Project"
    : project.repoPrivate
      ? "GitHub"
      : "View Code";

  return (
    <>
      {/* Top row */}
      <div className="flex shrink-0 items-start justify-between gap-4 px-2 pb-4 pt-1 sm:px-3">
        <div className="flex items-start gap-4 sm:gap-6">
          <span
            className="hero-heading font-black leading-none"
            style={{ fontSize: "clamp(2.2rem, 7vw, 92px)" }}
          >
            {num}
          </span>
          <div className="pt-1 sm:pt-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#868d99] sm:text-xs">
              {project.kind}
            </p>
            <h3
              className="mt-1 font-semibold uppercase leading-none text-[#D7E2EA]"
              style={{ fontSize: "clamp(1.2rem, 2.8vw, 2.2rem)" }}
            >
              {project.name}
            </h3>
          </div>
        </div>
        <div className="hidden shrink-0 pt-2 sm:block">
          <LiveProjectButton href={liveHref} label={liveLabel} />
        </div>
      </div>

      {/* Body — 40/60 grid; fills the card on desktop, stacks on mobile */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-5">
        <div className="flex min-h-0 flex-col gap-3 sm:gap-4 md:col-span-2">
          <div className="jk-panel min-h-[120px] md:flex-[0.85]">
            <p className="jk-panel__label">Stack</p>
            <ul className="jk-chips">
              {project.stack.slice(0, 6).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="jk-panel min-h-[150px] md:flex-[1.15]">
            <p className="jk-panel__label">Architecture</p>
            <ul className="jk-flow2">
              {project.nodes.slice(0, 5).map((n, i) => (
                <li key={i}>
                  <span className="jk-flow2__dot" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="jk-panel jk-panel--feature min-h-0 md:col-span-3">
          <p className="jk-panel__label">What it does</p>
          <p className="jk-panel__summary">{project.summary}</p>
          <ul className="jk-feats">
            {project.features.slice(0, 3).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="mt-4 sm:hidden">
            <LiveProjectButton href={liveHref} label={liveLabel} />
          </div>
        </div>
      </div>
    </>
  );
}

function Card({
  project,
  index,
  total,
  progress,
  isDesktop,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const num = String(index + 1).padStart(2, "0");

  // Mobile / SSR + first client render: plain stacked card (no sticky, no scale) —
  // avoids the tall card overflowing a fixed sticky slot and overlapping the next section.
  if (!isDesktop) {
    return (
      <article className="jk-card mb-6 flex w-full flex-col rounded-[36px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 last:mb-0 sm:rounded-[44px] sm:p-6">
        <CardInner project={project} num={num} />
      </article>
    );
  }

  return (
    <div className="sticky top-28 flex h-[90vh] items-start justify-center">
      <motion.article
        style={{ scale, top: `${index * 26}px` }}
        className="jk-card flex h-[78vh] w-full max-w-5xl flex-col rounded-[50px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 md:rounded-[60px] md:p-8"
      >
        <CardInner project={project} num={num} />
      </motion.article>
    </div>
  );
}

export default function Work() {
  const container = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="work"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-28"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto mb-10 max-w-5xl sm:mb-14">
        <FadeIn as="p" className="font-mono text-xs uppercase tracking-[0.24em] text-[#868d99]">
          Selected Work
        </FadeIn>
        <FadeIn as="h2" y={40} className="hero-heading jk-h2 mt-3">
          Project
        </FadeIn>
      </div>

      <div ref={container} className="mx-auto max-w-5xl md:max-w-none">
        {projects.map((p, i) => (
          <Card
            key={p.id}
            project={p}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </section>
  );
}
