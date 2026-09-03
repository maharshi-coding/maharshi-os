"use client";

import { motion } from "framer-motion";
import { experience, education } from "@/data/resume";

const EASE = [0.22, 1, 0.36, 1] as const;

function Entry({
  period,
  title,
  subtitle,
  lines,
  tag,
}: {
  period: string;
  title: string;
  subtitle: string;
  lines: string[];
  tag?: string;
}) {
  return (
    <motion.li
      className="hx-tl__item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className="hx-tl__dot" />
      <p className="hx-tl__period">
        {period}
        {tag && <span className="hx-tl__tag">{tag}</span>}
      </p>
      <h4 className="hx-tl__title">{title}</h4>
      <p className="hx-tl__sub">{subtitle}</p>
      {lines.length > 0 && (
        <ul className="hx-tl__lines">
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}

export default function Journey() {
  return (
    <section id="journey" className="hx-section hx-journey">
      <div className="hx-container">
        <header className="hx-journey__head">
          <p className="hx-eyebrow">The Journey</p>
          <h2 className="hx-h2">Experience &amp; education.</h2>
        </header>

        <div className="hx-journey__grid">
          <div className="hx-journey__col">
            <p className="hx-tl__label">Experience</p>
            <ul className="hx-tl">
              {experience.map((e) => (
                <Entry
                  key={e.id}
                  period={e.period}
                  title={e.role}
                  subtitle={`${e.org}${e.location && e.location !== "—" ? ` · ${e.location}` : ""}`}
                  lines={e.logs}
                />
              ))}
            </ul>
          </div>

          <div className="hx-journey__col">
            <p className="hx-tl__label">Education</p>
            <ul className="hx-tl">
              {education.map((ed) => (
                <Entry
                  key={ed.id}
                  period={ed.period}
                  title={ed.degree}
                  subtitle={ed.institution}
                  lines={ed.detail ? [ed.detail] : []}
                  tag={ed.status === "RUNNING" ? "Ongoing" : undefined}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
