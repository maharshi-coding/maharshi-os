/**
 * Open-source contributions — the single source of truth for the
 * "Open Source Contributions" section.
 *
 * Every field here is FACTUAL and verified against the live GitHub PRs
 * (author: maharshi-coding). Nothing is invented. To add a new contribution
 * later, append another object to `openSourceContributions` below — the section
 * renders entirely from this array.
 */

export type ContributionStatus = "merged" | "open" | "closed";

export interface Contribution {
  id: string;
  /** Repository name, e.g. "navigation2". */
  repo: string;
  /** Org / owner login, e.g. "ros-navigation". */
  org: string;
  /** Human label for the project, e.g. "Nav2". */
  project: string;
  /** GitHub owner avatar — public + stable at github.com/<org>.png. */
  avatar: string;
  /** Contribution / PR title (verbatim from the PR). */
  title: string;
  status: ContributionStatus;
  /** PR number. */
  pr: number;
  prUrl: string;
  /** Closing issue number, when the PR resolves one. */
  issue?: number;
  issueUrl?: string;
  repoUrl: string;
  /** Who merged it (only when merged). */
  mergedBy?: string;
  /** ISO date the PR was merged (only when merged). */
  date?: string;
  tech: string[];
  /** The "developer journey" — kept short and truthful. */
  problem: string;
  change: string;
  impact: string;
  /** Diff stats straight from GitHub. `files` omitted where not verified. */
  stats: { additions: number; deletions: number; files?: number };
}

export const openSourceContributions: Contribution[] = [
  {
    id: "nav2-6445",
    repo: "navigation2",
    org: "ros-navigation",
    project: "Nav2 · ROS 2 Navigation",
    avatar: "https://github.com/ros-navigation.png",
    title: "Fix BtActionNode cancellation when halted before goal acknowledgement",
    status: "merged",
    pr: 6445,
    prUrl: "https://github.com/ros-navigation/navigation2/pull/6445",
    issue: 6426,
    issueUrl: "https://github.com/ros-navigation/navigation2/issues/6426",
    repoUrl: "https://github.com/ros-navigation/navigation2",
    mergedBy: "SteveMacenski",
    date: "2026-09-09",
    tech: ["C++", "ROS 2", "Nav2", "Behavior Trees"],
    problem:
      "In Nav2's BtActionNode, halting during the window after a goal is sent but before the action server returns the goal handle could leave the in-flight goal uncancelled — an action-lifecycle race.",
    change:
      "Handled the halt-before-acknowledgement case so the goal is cancelled correctly once the handle arrives, with a regression test in test_bt_action_node.cpp.",
    impact:
      "Merged into main by Nav2's lead maintainer, Steve Macenski, and closes issue #6426 — a reliability fix in the flagship ROS 2 navigation stack.",
    stats: { additions: 215, deletions: 0, files: 2 },
  },
  {
    id: "moveit2-3850",
    repo: "moveit2",
    org: "moveit",
    project: "MoveIt 2 · Motion Planning",
    avatar: "https://github.com/moveit.png",
    title: "Fix use-after-free in servo_keyboard_input demo by joining the spin thread",
    status: "open",
    pr: 3850,
    prUrl: "https://github.com/moveit/moveit2/pull/3850",
    repoUrl: "https://github.com/moveit/moveit2",
    tech: ["C++", "ROS 2", "MoveIt 2", "MoveIt Servo"],
    problem:
      "The servo_keyboard_input demo could read freed memory because its ROS spin thread outlived the resources it referenced.",
    change:
      "Join the spin thread on shutdown so it stops accessing freed memory — a clean lifetime fix for the demo.",
    impact:
      "Open pull request under review in MoveIt 2, the standard ROS 2 manipulation framework.",
    stats: { additions: 18, deletions: 1 },
  },
];

/** Small rollup for the section header — computed, never hardcoded. */
export const contributionStats = {
  total: openSourceContributions.length,
  merged: openSourceContributions.filter((c) => c.status === "merged").length,
  open: openSourceContributions.filter((c) => c.status === "open").length,
  orgs: new Set(openSourceContributions.map((c) => c.org)).size,
};
