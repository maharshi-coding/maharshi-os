/**
 * Open-source contributions — the single source of truth for the
 * "Open Source Contributions" section.
 *
 * Every field here is FACTUAL and verified against the live GitHub PRs
 * (author: maharshi-coding) on 2026-10-26. Status (merged / open) is the real
 * PR state; nothing is implied to be merged that isn't. Closed-but-not-merged
 * PRs are intentionally NOT listed. To add a new contribution later, append
 * another object below — the section renders entirely from this array.
 */

export type ContributionStatus = "merged" | "open" | "closed";

export interface Contribution {
  id: string;
  /** Repository name, e.g. "navigation2". */
  repo: string;
  /** Org / owner login, e.g. "ros-navigation" (used for the repo path + avatar). */
  org: string;
  /** Human company / organization name to highlight, e.g. "Meta". */
  company: string;
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
    id: "tesla-vehicle-command-524",
    repo: "vehicle-command",
    org: "teslamotors",
    company: "Tesla",
    project: "Tesla Vehicle Command SDK",
    avatar: "https://github.com/teslamotors.png",
    title: "tesla-http-proxy: exit 1 and report startup failures on stderr",
    status: "merged",
    pr: 524,
    prUrl: "https://github.com/teslamotors/vehicle-command/pull/524",
    repoUrl: "https://github.com/teslamotors/vehicle-command",
    mergedBy: "sethterashima",
    date: "2026-10-21",
    tech: ["Go", "TLS", "CLI", "DevOps"],
    problem:
      "tesla-http-proxy could exit 0 and print nothing when it failed to start, so supervisors keyed on exit status (Docker / systemd on-failure, shell &&) treated a failed launch as a clean one.",
    change:
      "Split startup into small error-returning functions and made main a thin boundary that writes \"Error: <reason>\" to stderr and exits 1 regardless of log level.",
    impact:
      "Merged into Tesla's official Vehicle Command SDK by a Tesla maintainer — failed starts are now observable to process supervisors.",
    stats: { additions: 419, deletions: 25, files: 2 },
  },
  {
    id: "nav2-6445",
    repo: "navigation2",
    org: "ros-navigation",
    company: "Open Robotics · ROS 2",
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
    tech: ["C++", "ROS 2", "Behavior Trees"],
    problem:
      "In Nav2's BtActionNode, halting during the window after a goal is sent but before the action server returns the goal handle could leave the in-flight goal uncancelled — an action-lifecycle race.",
    change:
      "Handled the halt-before-acknowledgement case so the goal is cancelled correctly once the handle arrives, with a regression test in test_bt_action_node.cpp.",
    impact:
      "Merged into main by Nav2's lead maintainer, Steve Macenski, and closes issue #6426 — a reliability fix in the flagship ROS 2 navigation stack.",
    stats: { additions: 215, deletions: 0, files: 2 },
  },
  {
    id: "meta-pyrefly-5346",
    repo: "pyrefly",
    org: "facebook",
    company: "Meta",
    project: "Pyrefly · Python type checker",
    avatar: "https://github.com/facebook.png",
    title: "Preserve Unknown when narrowing missing attributes",
    status: "open",
    pr: 5346,
    prUrl: "https://github.com/facebook/pyrefly/pull/5346",
    issue: 5333,
    issueUrl: "https://github.com/facebook/pyrefly/issues/5333",
    repoUrl: "https://github.com/facebook/pyrefly",
    tech: ["Rust", "Type inference", "Python typing"],
    problem:
      "When a missing attribute appeared in a narrowing condition, Pyrefly cached `object` instead of the error-origin `Unknown` from ordinary lookup, so later indexing produced a cascade of false errors.",
    change:
      "Recover missing lookup members as `Unknown` — preserving valid union members, positive refinement and genuine type errors — and treat reads of an error-`Unknown` as propagation to avoid duplicate diagnostics.",
    impact:
      "Open PR proposing recovery semantics for Meta's Pyrefly type checker (fixes #5333).",
    stats: { additions: 213, deletions: 9, files: 3 },
  },
  {
    id: "meta-threatexchange-2026",
    repo: "ThreatExchange",
    org: "facebook",
    company: "Meta",
    project: "ThreatExchange · PDQ",
    avatar: "https://github.com/facebook.png",
    title: "[pdq][cpp] Prevent signed integer overflow in image downscaling",
    status: "open",
    pr: 2026,
    prUrl: "https://github.com/facebook/ThreatExchange/pull/2026",
    issue: 1979,
    issueUrl: "https://github.com/facebook/ThreatExchange/issues/1979",
    repoUrl: "https://github.com/facebook/ThreatExchange",
    tech: ["C++", "PDQ", "Image hashing", "Security"],
    problem:
      "In PDQ's C++ downscaling, row-major offsets and box-filter accumulators are `int`; for images where rows×cols exceeds INT_MAX this is signed-overflow UB, reachable from the public pdqHash256FromFloatLuma entry point and causing out-of-bounds access.",
    change:
      "Widened the offset and accumulator arithmetic to prevent the overflow and resulting OOB access, with a dedicated downscaling test.",
    impact:
      "Open PR hardening Meta's PDQ perceptual-hash library (ThreatExchange) against integer-overflow UB (fixes #1979).",
    stats: { additions: 211, deletions: 16, files: 3 },
  },
  {
    id: "meta-mariana-trench-277",
    repo: "mariana-trench",
    org: "facebook",
    company: "Meta",
    project: "Mariana Trench · Security analyzer",
    avatar: "https://github.com/facebook.png",
    title: "Fix false negative: taint propagation through static fields",
    status: "open",
    pr: 277,
    prUrl: "https://github.com/facebook/mariana-trench/pull/277",
    issue: 91,
    issueUrl: "https://github.com/facebook/mariana-trench/issues/91",
    repoUrl: "https://github.com/facebook/mariana-trench",
    tech: ["C++", "Static analysis", "Taint tracking"],
    problem:
      "Mariana Trench missed taint flowing through static fields: a static write and a later read didn't share a storage location, so tainted values never reached the sink — a false negative.",
    change:
      "Added a StaticFieldMemoryLocation, stored static writes there, and resolved references through different declaring types to the same static field so taint is retained across the write.",
    impact:
      "Open PR closing an intraprocedural taint-tracking gap in Meta's Mariana Trench security analyzer (fixes #91).",
    stats: { additions: 2903, deletions: 5, files: 13 },
  },
  {
    id: "deepmind-mujoco-3697",
    repo: "mujoco",
    org: "google-deepmind",
    company: "Google DeepMind",
    project: "MuJoCo · Physics engine",
    avatar: "https://github.com/google-deepmind.png",
    title: "Fix Studio native viewer on macOS: run the viewer on the main thread",
    status: "open",
    pr: 3697,
    prUrl: "https://github.com/google-deepmind/mujoco/pull/3697",
    issue: 3579,
    issueUrl: "https://github.com/google-deepmind/mujoco/issues/3579",
    repoUrl: "https://github.com/google-deepmind/mujoco",
    tech: ["Python", "macOS", "Threading"],
    problem:
      "On macOS, AppKit services UI objects only on the main thread, but MuJoCo Studio's native launcher ran the viewer on a daemon worker thread — so the window was never created and the viewer failed to start.",
    change:
      "Added platform-aware launching that runs the viewer on the main thread on macOS while leaving Linux and Windows behaviour unchanged.",
    impact:
      "Open PR fixing the macOS native Studio viewer in Google DeepMind's MuJoCo physics engine (fixes #3579).",
    stats: { additions: 350, deletions: 11, files: 3 },
  },
  {
    id: "waymo-waymax-96",
    repo: "waymax",
    org: "waymo-research",
    company: "Waymo",
    project: "Waymax · Driving simulator",
    avatar: "https://github.com/waymo-research.png",
    title: "Fix scenario ID batching in the WOSAC notebook",
    status: "open",
    pr: 96,
    prUrl: "https://github.com/waymo-research/waymax/pull/96",
    issue: 69,
    issueUrl: "https://github.com/waymo-research/waymax/issues/69",
    repoUrl: "https://github.com/waymo-research/waymax",
    tech: ["Python", "JAX", "TensorFlow"],
    problem:
      "The WOSAC notebook decoded each scenario ID into a variable-length tensor before dense batching, so differing ID lengths failed in TensorFlow while equal-length IDs were silently concatenated.",
    change:
      "Kept IDs as strings until NumPy conversion, decoded each ID separately outside JAX, and compiled only the numeric simulator conversion — preserving the Python-string interface.",
    impact:
      "Open PR fixing scenario-ID batching in Waymo's Waymax autonomous-driving simulator (fixes #69).",
    stats: { additions: 256, deletions: 11, files: 2 },
  },
  {
    id: "waymo-waymax-94",
    repo: "waymax",
    org: "waymo-research",
    company: "Waymo",
    project: "Waymax · Driving simulator",
    avatar: "https://github.com/waymo-research.png",
    title: "Fix configured simulation actors in the dm_env factory",
    status: "open",
    pr: 94,
    prUrl: "https://github.com/waymo-research/waymax/pull/94",
    repoUrl: "https://github.com/waymo-research/waymax",
    tech: ["Python", "JAX", "Reinforcement Learning"],
    problem:
      "make_sdc_dm_environment built configured IDM actors but omitted their parameter entries, so PlanningAgentEnvironment rejected any nonempty actor configuration before reset.",
    change:
      "Passed one None slot per parameter-free actor, preserving the factory API and constructor check, with regression coverage for batching, reset/step and invalid controls.",
    impact:
      "Open PR restoring configured simulation actors in Waymo's Waymax (dm_env factory).",
    stats: { additions: 100, deletions: 0, files: 2 },
  },
  {
    id: "waymo-waymax-95",
    repo: "waymax",
    org: "waymo-research",
    company: "Waymo",
    project: "Waymax · Driving simulator",
    avatar: "https://github.com/waymo-research.png",
    title: "Clarify rollout actors receive full state; add observation-based test",
    status: "open",
    pr: 95,
    prUrl: "https://github.com/waymo-research/waymax/pull/95",
    issue: 73,
    issueUrl: "https://github.com/waymo-research/waymax/issues/73",
    repoUrl: "https://github.com/waymo-research/waymax",
    tech: ["Python", "JAX", "Docs & Tests"],
    problem:
      "RolloutCarry.observation's docstring said it was the actor's model input, but rollout() hands the actor the full simulator state — never that field — confusing users (reported in #73).",
    change:
      "Documented the actual intended design and added a regression test; no runtime behaviour changes.",
    impact:
      "Open PR clarifying rollout semantics in Waymo's Waymax (resolves #73).",
    stats: { additions: 93, deletions: 4, files: 3 },
  },
  {
    id: "tesla-rn-camera-kit-822",
    repo: "react-native-camera-kit",
    org: "teslamotors",
    company: "Tesla",
    project: "React Native Camera Kit",
    avatar: "https://github.com/teslamotors.png",
    title: "fix(android): center scan frame after enabling and layout changes",
    status: "open",
    pr: 822,
    prUrl: "https://github.com/teslamotors/react-native-camera-kit/pull/822",
    repoUrl: "https://github.com/teslamotors/react-native-camera-kit",
    tech: ["Kotlin", "Android", "React Native"],
    problem:
      "Re-enabling showFrame on an already laid-out Android camera produced a 53×53px corner fragment because the overlay's measured dimensions were still zero.",
    change:
      "Computed frameRect from actual layout bounds in onSizeChanged() and used them when resizing the custom frame, with four Robolectric regression tests.",
    impact:
      "Open PR fixing the Android scan-frame layout in Tesla's React Native Camera Kit.",
    stats: { additions: 213, deletions: 11, files: 7 },
  },
  {
    id: "moveit2-3850",
    repo: "moveit2",
    org: "moveit",
    company: "PickNik · MoveIt",
    project: "MoveIt 2 · Motion planning",
    avatar: "https://github.com/moveit.png",
    title: "Fix use-after-free in servo_keyboard_input demo by joining the spin thread",
    status: "open",
    pr: 3850,
    prUrl: "https://github.com/moveit/moveit2/pull/3850",
    repoUrl: "https://github.com/moveit/moveit2",
    tech: ["C++", "ROS 2", "MoveIt Servo"],
    problem:
      "The servo_keyboard_input demo could read freed memory because its ROS spin thread outlived the resources it referenced.",
    change:
      "Join the spin thread on shutdown so it stops accessing freed memory — a clean lifetime fix for the demo.",
    impact:
      "Open pull request under review in MoveIt 2, the standard ROS 2 manipulation framework.",
    stats: { additions: 18, deletions: 1 },
  },
  {
    id: "supabase-44194",
    repo: "supabase",
    org: "supabase",
    company: "Supabase",
    project: "Supabase Studio",
    avatar: "https://github.com/supabase.png",
    title: "fix(studio): show removed edge functions in branch merge diff",
    status: "open",
    pr: 44194,
    prUrl: "https://github.com/supabase/supabase/pull/44194",
    issue: 44175,
    issueUrl: "https://github.com/supabase/supabase/issues/44175",
    repoUrl: "https://github.com/supabase/supabase",
    tech: ["TypeScript", "React", "Next.js"],
    problem:
      "When an edge function was removed from config.toml on a preview branch, Studio's Edge Functions merge tab showed \"No changes detected\", hiding the deletion so the function looked still-deployed.",
    change:
      "Fixed useEdgeFunctionsDiff so removed or disabled functions surface as a deletion diff on the merge page, with a regression test.",
    impact:
      "Open PR fixing branch-merge edge-function diffs in Supabase Studio (fixes #44175).",
    stats: { additions: 169, deletions: 6, files: 2 },
  },
];

/** Small rollup for the section header — computed, never hardcoded. */
export const contributionStats = {
  total: openSourceContributions.length,
  merged: openSourceContributions.filter((c) => c.status === "merged").length,
  open: openSourceContributions.filter((c) => c.status === "open").length,
  orgs: new Set(openSourceContributions.map((c) => c.org)).size,
  companies: new Set(openSourceContributions.map((c) => c.company)).size,
};

/** Distinct companies/orgs contributed to, in display order (for a logo/name row). */
export const contributionCompanies: string[] = Array.from(
  new Set(openSourceContributions.map((c) => c.company))
);
