/**
 * "Currently Building" — the single source of truth for what Maharshi is
 * actively working on. Shown on the workspace monitor. Edit this one object to
 * change what the guide is "building". Facts only — nothing invented.
 */
export interface CurrentProject {
  name: string;
  description: string;
  tech: string[];
  status: string;
  url: string;
}

export const currentProject: CurrentProject = {
  name: "Upstream open-source fixes",
  description:
    "Shipping fixes to major open-source projects — merged into Tesla's Vehicle Command SDK and ROS 2 Nav2, with open PRs to Meta, Google DeepMind, Waymo and Supabase.",
  tech: ["Go", "C++", "Rust", "Python", "TypeScript"],
  status: "Active",
  url: "https://github.com/maharshi-coding",
};
