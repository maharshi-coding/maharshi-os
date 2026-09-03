/**
 * Home content maps — every value here is derived from the real résumé data in
 * `@/data/resume` (skills, projects, stacks). Nothing is invented.
 */
import { person } from "@/data/resume";

/** Rotating role words under the hero name (masked vertical switcher). */
export const roleWords = [
  "AI Systems",
  "Full-Stack Products",
  "Mobile Experiences",
  "Automation Systems",
  "Data Products",
];

/** Hero constellation nodes — each reveals real technologies on hover. */
export interface HeroNode {
  id: string;
  label: string;
  blurb: string;
  tech: string[];
}

export const heroNodes: HeroNode[] = [
  {
    id: "ai",
    label: "AI",
    blurb: "LLM products & autonomous agents",
    tech: ["OpenAI API", "Claude / Gemini", "RAG", "Prompt Engineering", "Agent Systems", "LLM Evaluation"],
  },
  {
    id: "fullstack",
    label: "Full Stack",
    blurb: "End-to-end web apps & APIs",
    tech: ["React", "Next.js", "Node.js", "Django", "FastAPI", ".NET 8"],
  },
  {
    id: "mobile",
    label: "Mobile",
    blurb: "Cross-platform native apps",
    tech: ["React Native", "Firebase", "Firestore", "Cloud Functions", "Stripe"],
  },
  {
    id: "data",
    label: "Data",
    blurb: "Storage, catalogs & governance",
    tech: ["PostgreSQL", "MongoDB", "Firestore", "DataHub · MCP", "SQL"],
  },
  {
    id: "automation",
    label: "Automation",
    blurb: "Background pipelines that keep working",
    tech: ["Cloud Scheduler", "Pub/Sub", "Cloud Functions", "CI/CD", "Workflow Automation"],
  },
  {
    id: "cv",
    label: "Computer Vision",
    blurb: "Recognition with anti-spoofing",
    tech: ["OpenCV", "128-d Embeddings", "Liveness Detection"],
  },
];

/** In-page nav destinations. */
export const navItems = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const resumeHref = "/Maharshi-Barot-Resume.pdf";

/** Contact / social links. */
export const socials = [
  { id: "github", label: "GitHub", value: "github.com/maharshi-coding", href: person.github, external: true },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/maharshi-barot",
    href: person.linkedin,
    external: true,
  },
  { id: "email", label: "Email", value: person.email, href: `mailto:${person.email}`, external: false },
  { id: "resume", label: "Résumé", value: "Maharshi-Barot-Resume.pdf", href: resumeHref, external: true },
];
