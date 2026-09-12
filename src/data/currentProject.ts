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
  name: "Open-source robotics · ROS 2",
  description:
    "Upstreaming reliability fixes to the ROS 2 stack — a merged Behavior-Tree cancellation race in Nav2, and an open lifetime fix in MoveIt 2.",
  tech: ["C++", "ROS 2", "Nav2", "MoveIt 2"],
  status: "In review",
  url: "https://github.com/moveit/moveit2/pull/3850",
};
