/**
 * Dialogue + guide choices for the workspace character. Centralized so wording
 * changes never touch component code. Lines are short, natural and confident.
 *
 * Each choice `target` is either a section id on the scrolling site (the guide
 * closes and scrolls the visitor there) or an external URL.
 */
import { person } from "@/data/resume";

export const characterDialogue = {
  /** First thing said when the guide is activated. */
  welcome: "Hey! I'm Maharshi — well, his workspace guide. What would you like me to show you?",
  /** Spoken/shown when a section is chosen (keyed by choice id). */
  intros: {
    work: "These are some of the systems I've enjoyed building. Let me show you.",
    opensource: "Sure — let me show you what I've been contributing to upstream.",
    journey: "Here's where I've worked and studied so far.",
    skills: "This is the toolkit I build with. Take a look.",
    currentproject: "Right now I'm upstreaming reliability fixes to ROS 2 — take a look.",
    contact: "Want to build something together? Here's how to reach me.",
    github: "Here's everything I'm shipping in public.",
  } as Record<string, string>,
  /** Said if speech/interaction ends. */
  farewell: "Catch you around — scroll on whenever you like.",
} as const;

export interface GuideChoice {
  id: string;
  label: string;
  /** Section id to scroll to, or an absolute URL for external. */
  target: string;
  external?: boolean;
}

export const guideChoices: GuideChoice[] = [
  { id: "work", label: "My Work", target: "work" },
  { id: "opensource", label: "Open Source", target: "opensource" },
  { id: "journey", label: "My Experience", target: "journey" },
  { id: "skills", label: "My Skills", target: "skills" },
  { id: "currentproject", label: "Currently Building", target: "opensource" },
  { id: "contact", label: "Contact Me", target: "contact" },
  { id: "github", label: "GitHub", target: person.github, external: true },
];
