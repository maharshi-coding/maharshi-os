"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleDot, Github, GitMerge, GitPullRequest } from "lucide-react";
import {
  openSourceContributions,
  contributionStats,
  type Contribution,
  type ContributionStatus,
} from "@/data/openSource";

const EASE = [0.22, 1, 0.36, 1] as const;

type Filter = "all" | "merged" | "open";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "merged", label: "Merged" },
  { id: "open", label: "Open PRs" },
];

function StatusBadge({ status }: { status: ContributionStatus }) {
  if (status === "merged") {
    return (
      <span className="hx-os__badge hx-os__badge--merged">
        <GitMerge size={13} strokeWidth={2.2} />
        Merged
      </span>
    );
  }
  if (status === "open") {
    return (
      <span className="hx-os__badge hx-os__badge--open">
        <GitPullRequest size={13} strokeWidth={2.2} />
        Open PR
      </span>
    );
  }
  return (
    <span className="hx-os__badge hx-os__badge--closed">
      <CircleDot size={13} strokeWidth={2.2} />
      Closed
    </span>
  );
}

function ContributionCard({ c }: { c: Contribution }) {
  const dateLabel = c.date
    ? new Date(c.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : undefined;

  return (
    <motion.li
      className="hx-os__item"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <span className="hx-os__rail" aria-hidden="true">
        <span className="hx-os__dot" data-status={c.status} />
      </span>

      <article className="hx-os__card">
        <header className="hx-os__top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hx-os__avatar"
            src={c.avatar}
            alt={`${c.org} organization avatar`}
            width={40}
            height={40}
            loading="lazy"
          />
          <div className="hx-os__id">
            <p className="hx-os__project">{c.project}</p>
            <p className="hx-os__repo">
              {c.org}/{c.repo}
            </p>
          </div>
          <StatusBadge status={c.status} />
        </header>

        <h3 className="hx-os__title">{c.title}</h3>

        <p className="hx-os__meta">
          <a href={c.prUrl} target="_blank" rel="noopener noreferrer" className="hx-os__ref">
            PR #{c.pr}
          </a>
          {c.issue && c.issueUrl && (
            <a href={c.issueUrl} target="_blank" rel="noopener noreferrer" className="hx-os__ref">
              Issue #{c.issue}
            </a>
          )}
          {c.mergedBy && (
            <span className="hx-os__by">
              merged by <strong>@{c.mergedBy}</strong>
            </span>
          )}
          {dateLabel && <span className="hx-os__date">{dateLabel}</span>}
        </p>

        {/* The developer journey: problem → change → impact */}
        <ol className="hx-os__journey">
          <li>
            <span className="hx-os__step">Problem</span>
            <p>{c.problem}</p>
          </li>
          <li>
            <span className="hx-os__step">What I changed</span>
            <p>{c.change}</p>
          </li>
          <li>
            <span className="hx-os__step">Impact</span>
            <p>{c.impact}</p>
          </li>
        </ol>

        <ul className="hx-tags">
          {c.tech.map((t) => (
            <li key={t} className="hx-tag">
              {t}
            </li>
          ))}
        </ul>

        <footer className="hx-os__foot">
          <span className="hx-os__diff" aria-label={`${c.stats.additions} additions, ${c.stats.deletions} deletions`}>
            <span className="hx-os__add">+{c.stats.additions}</span>
            <span className="hx-os__del">−{c.stats.deletions}</span>
            {typeof c.stats.files === "number" && (
              <span className="hx-os__files">
                {c.stats.files} file{c.stats.files === 1 ? "" : "s"}
              </span>
            )}
          </span>

          <span className="hx-os__links">
            <a className="hx-inlink" href={c.prUrl} target="_blank" rel="noopener noreferrer">
              <GitPullRequest size={14} strokeWidth={2} />
              Pull Request
              <ArrowUpRight size={13} strokeWidth={2} />
            </a>
            <a className="hx-inlink" href={c.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github size={14} strokeWidth={2} />
              Repo
            </a>
          </span>
        </footer>
      </article>
    </motion.li>
  );
}

export default function OpenSource() {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(
    () => openSourceContributions.filter((c) => filter === "all" || c.status === filter),
    [filter]
  );

  return (
    <section id="opensource" className="hx-section hx-os">
      <div className="hx-container">
        <header className="hx-os__head">
          <p className="hx-eyebrow">Open Source</p>
          <h2 className="hx-h2">Contributions to the tools I build on.</h2>
          <p className="hx-lead">
            Real fixes upstreamed to the ROS 2 ecosystem — concurrency and lifetime bugs in the
            navigation and manipulation stacks used across robotics.{" "}
            <strong>
              {contributionStats.merged} merged
            </strong>{" "}
            across {contributionStats.orgs} projects.
          </p>
        </header>

        <div className="hx-os__filters" role="tablist" aria-label="Filter contributions">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className="hx-os__filter"
              data-active={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ol className="hx-os__list">
          {shown.map((c) => (
            <ContributionCard key={c.id} c={c} />
          ))}
        </ol>
      </div>
    </section>
  );
}
