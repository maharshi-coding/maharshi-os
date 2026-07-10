/**
 * Single source of truth for all portfolio content.
 * Every fact here is taken directly from Maharshi Barot's resume — nothing invented.
 */

export const person = {
  name: "Maharshi Barot",
  handle: "maharshi-coding",
  role: "AI Solutions Developer · Full-Stack Engineer",
  tagline: "I ship AI products end-to-end — from prompt to production.",
  email: "barotmaharshi393@gmail.com",
  github: "https://github.com/maharshi-coding",
  location: "United States",
} as const;

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  detail: string;
  status: "RUNNING" | "COMPLETE";
}

export const education: EducationEntry[] = [
  {
    id: "tamucc",
    institution: "Texas A&M University–Corpus Christi",
    degree: "M.S. in Computer and Information Science",
    period: "Ongoing",
    detail: "United States",
    status: "RUNNING",
  },
  {
    id: "pdeu",
    institution: "Pandit Deendayal Energy University",
    degree: "B.Tech in Computer Science & Engineering",
    period: "Sep 2022 – Jun 2025",
    detail: "CGPA 7.97 / 10",
    status: "COMPLETE",
  },
  {
    id: "gpa",
    institution: "Government Polytechnic, Ahmedabad",
    degree: "Diploma in Computer Engineering",
    period: "Aug 2019 – Jun 2022",
    detail: "CGPA 9.11 / 10",
    status: "COMPLETE",
  },
];

export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  period: string;
  location: string;
  level: "EXEC" | "PROC";
  logs: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "independent",
    role: "Independent AI Solutions Developer",
    org: "Self-directed",
    period: "2024 – Present",
    location: "—",
    level: "EXEC",
    logs: [
      "Built and shipped multiple AI-powered apps end-to-end — a conversational assistant (RamayanaGPT), an AI Tutor mobile app (React Native + OpenAI APIs), and a fully automated tech-news pipeline (text-to-speech, video rendering).",
      "Integrated LLMs via REST APIs with prompt engineering and iterative evaluation to improve output quality and reliability.",
      "Demonstrated projects to non-technical users, gathered feedback, and maintained documentation for long-term handoff.",
    ],
  },
  {
    id: "freelance",
    role: "Freelance Full Stack Developer",
    org: "Remote clients",
    period: "Jun 2025 – Nov 2025",
    location: "Remote",
    level: "EXEC",
    logs: [
      "Developed full-stack applications using React.js, .NET 8, and PostgreSQL, including scalable APIs and auth systems.",
      "Managed client requirements directly, translating non-technical needs into working technical solutions.",
    ],
  },
  {
    id: "bws",
    role: "Full Stack Web Development Intern",
    org: "BWS Certifications",
    period: "Jan 2025 – May 2025",
    location: "India",
    level: "PROC",
    logs: [
      "Delivered full-stack features using React.js, Django, Bootstrap, JavaScript, and Python with strong performance feedback.",
      "Built REST APIs, integrated backend services with the frontend, and collaborated in Agile sprint cycles.",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  binary: string; // process name for OS theming
  kind: string;
  featured: boolean;
  summary: string;
  stack: string[];
  features: string[];
  challenge: string;
  approach: string;
  impact: string;
  architecture: { from: string; to: string }[];
  nodes: string[];
  github: string;
}

export const projects: Project[] = [
  {
    id: "campus-ride",
    name: "Campus Ride Pooling",
    binary: "ride-pool.app",
    kind: "Mobile · Full-Stack",
    featured: true,
    summary:
      "A full-stack campus ride-sharing app with real-time ride creation and chat, secure payments, identity verification, and route-aware ride matching.",
    stack: [
      "React Native",
      "Firebase Auth",
      "Firestore",
      "Cloud Functions",
      "Node.js",
      "Stripe Payments",
      "Stripe Identity",
      "Mapbox",
    ],
    features: [
      "Real-time ride creation and live chat between riders",
      "Firebase Auth, Firestore and Cloud Functions backbone",
      "Stripe payments plus Stripe Identity verification",
      "Mapbox route-aware ride matching",
    ],
    challenge:
      "Coordinating live state — rides, chat, payments and identity — across many concurrent mobile clients.",
    approach:
      "Firestore real-time listeners for live data, Cloud Functions for trusted server-side logic, and Stripe's hosted flows for payment and identity security.",
    impact:
      "A production-grade marketplace pattern — auth, money movement, identity and geo-matching — shipped end-to-end by one developer.",
    architecture: [
      { from: "React Native app", to: "Firebase Auth" },
      { from: "React Native app", to: "Firestore (real-time)" },
      { from: "Firestore (real-time)", to: "Cloud Functions" },
      { from: "Cloud Functions", to: "Stripe Payments + Identity" },
      { from: "React Native app", to: "Mapbox routing" },
    ],
    nodes: [
      "React Native app",
      "Firebase Auth",
      "Firestore (real-time)",
      "Cloud Functions",
      "Stripe Payments + Identity",
      "Mapbox routing",
    ],
    github: "https://github.com/maharshi-coding",
  },
  {
    id: "face-attendance",
    name: "Face Recognition Attendance",
    binary: "face-attend.svc",
    kind: "Computer Vision · Backend",
    featured: true,
    summary:
      "An attendance platform that recognizes faces using 128-dimensional embeddings, defeats photo spoofing with blink-based liveness detection, and serves role-based analytics.",
    stack: ["Python", "FastAPI", "OpenCV", "JWT Auth", "RBAC"],
    features: [
      "128-d face embeddings for recognition",
      "Blink-based liveness detection against spoofing",
      "JWT authentication with role-based access control",
      "Analytics dashboard with CSV / XLSX export",
    ],
    challenge:
      "Making face recognition trustworthy — a photo of a face must not count as a face.",
    approach:
      "Blink-based liveness detection layered over 128-d embedding matching, with RBAC so each role sees exactly what it should.",
    impact:
      "A complete biometric attendance pipeline — recognition, anti-spoofing, auth, analytics and export — in one system.",
    architecture: [
      { from: "Camera client", to: "FastAPI service" },
      { from: "FastAPI service", to: "OpenCV pipeline" },
      { from: "OpenCV pipeline", to: "128-d embeddings" },
      { from: "FastAPI service", to: "JWT + RBAC" },
      { from: "FastAPI service", to: "Analytics + export" },
    ],
    nodes: [
      "Camera client",
      "FastAPI service",
      "OpenCV pipeline",
      "128-d embeddings",
      "JWT + RBAC",
      "Analytics + export",
    ],
    github: "https://github.com/maharshi-coding",
  },
  {
    id: "ramayana-gpt",
    name: "RamayanaGPT",
    binary: "ramayana-gpt.ai",
    kind: "Conversational AI",
    featured: true,
    summary:
      "A conversational AI assistant built end-to-end — LLM integration over REST with prompt engineering and iterative evaluation to keep answers reliable.",
    stack: ["OpenAI API", "Prompt Engineering", "LLM Evaluation", "REST API"],
    features: [
      "Conversational assistant shipped end-to-end",
      "LLM integration via REST APIs",
      "Prompt engineering with iterative evaluation loops",
      "Documented for long-term handoff",
    ],
    challenge:
      "LLM output quality drifts — a conversational assistant is only useful if it stays reliable.",
    approach:
      "Iterative evaluation: engineer the prompt, measure output quality, refine, repeat — treated as an engineering loop, not a one-shot.",
    impact:
      "Demonstrated to non-technical users and refined from their feedback — AI made usable for a general audience.",
    architecture: [
      { from: "Chat client", to: "REST API layer" },
      { from: "REST API layer", to: "Prompt pipeline" },
      { from: "Prompt pipeline", to: "OpenAI API" },
      { from: "OpenAI API", to: "Evaluation loop" },
      { from: "Evaluation loop", to: "Prompt pipeline" },
    ],
    nodes: ["Chat client", "REST API layer", "Prompt pipeline", "OpenAI API", "Evaluation loop"],
    github: "https://github.com/maharshi-coding",
  },
  {
    id: "ai-tutor",
    name: "AI Tutor",
    binary: "ai-tutor.apk",
    kind: "Mobile · AI",
    featured: false,
    summary:
      "An AI tutoring mobile app built with React Native and OpenAI APIs — LLM-powered learning in your pocket, shipped end-to-end.",
    stack: ["React Native", "OpenAI API", "Prompt Engineering"],
    features: [
      "Native mobile experience built with React Native",
      "OpenAI API integration for tutoring conversations",
      "Prompt engineering tuned for teaching quality",
    ],
    challenge: "Delivering a responsive LLM experience within a mobile app's constraints.",
    approach:
      "REST-based LLM integration with prompts engineered and iterated specifically for tutoring interactions.",
    impact: "One of multiple AI apps shipped end-to-end as an independent developer.",
    architecture: [
      { from: "React Native app", to: "REST API" },
      { from: "REST API", to: "OpenAI API" },
      { from: "OpenAI API", to: "Tutor responses" },
    ],
    nodes: ["React Native app", "REST API", "OpenAI API", "Tutor responses"],
    github: "https://github.com/maharshi-coding",
  },
  {
    id: "news-pipeline",
    name: "Automated Tech News Pipeline",
    binary: "newsgen.daemon",
    kind: "AI Automation",
    featured: false,
    summary:
      "A fully automated pipeline that turns tech news into finished videos — text-to-speech narration and video rendering with no human in the loop.",
    stack: ["Workflow Automation", "Text-to-Speech", "Video Rendering", "Python"],
    features: [
      "Fully automated end-to-end content pipeline",
      "Text-to-speech narration generation",
      "Automated video rendering and assembly",
    ],
    challenge:
      "Chaining unreliable steps — fetch, narrate, render — into a pipeline that runs without supervision.",
    approach:
      "Workflow automation treating each stage as a composable unit, so the pipeline runs hands-free from source text to rendered video.",
    impact: "Content production that runs itself — a daemon, not a chore.",
    architecture: [
      { from: "News source", to: "Processing" },
      { from: "Processing", to: "Text-to-speech" },
      { from: "Text-to-speech", to: "Video renderer" },
      { from: "Video renderer", to: "Published video" },
    ],
    nodes: ["News source", "Processing", "Text-to-speech", "Video renderer", "Published video"],
    github: "https://github.com/maharshi-coding",
  },
  {
    id: "investor-dash",
    name: "AI Retail Investor Dashboard",
    binary: "investor-dash.web",
    kind: "Data · Full-Stack",
    featured: false,
    summary:
      "A dashboard that fuses multiple market-data sources into real-time insights, with a REST API backend and interactive React visualizations.",
    stack: ["Python", "React", "SQL", "REST API"],
    features: [
      "Multiple market-data sources combined in real time",
      "REST API backend",
      "Interactive React visualizations",
    ],
    challenge:
      "Market data arrives from many sources in many shapes — insight requires fusing them coherently.",
    approach:
      "A Python + SQL backend normalizes the sources behind a REST API; React renders them as interactive, real-time visualizations.",
    impact: "Raw market feeds turned into decisions a retail investor can actually read.",
    architecture: [
      { from: "Market data sources", to: "Python backend" },
      { from: "Python backend", to: "SQL store" },
      { from: "Python backend", to: "REST API" },
      { from: "REST API", to: "React dashboard" },
    ],
    nodes: ["Market data sources", "Python backend", "SQL store", "REST API", "React dashboard"],
    github: "https://github.com/maharshi-coding",
  },
];

export const skillCategories = [
  {
    id: "ai",
    label: "AI / LLM",
    skills: [
      "OpenAI API",
      "Prompt Engineering",
      "RAG",
      "LLM Evaluation",
      "NLP",
      "Workflow Automation",
      "Agent-Based Systems",
    ],
  },
  {
    id: "lang",
    label: "Languages",
    skills: ["Python", "C++", "Java", "JavaScript", "TypeScript", "C#", "SQL", "HTML", "CSS"],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React.js", "React Native", "Next.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "Express.js", "Django", "FastAPI", ".NET 8", "REST APIs"],
  },
  {
    id: "db",
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Firebase Firestore", "SQLite"],
  },
  {
    id: "cloud",
    label: "Cloud / Tools",
    skills: ["Firebase", "Stripe API", "Docker", "Mapbox", "Git", "JWT Auth", "CI/CD (GitHub Actions)"],
  },
] as const;

/** Edges for the neural skill graph: language → framework → project relationships. */
export const skillEdges: [string, string][] = [
  ["Python", "Django"],
  ["Python", "FastAPI"],
  ["JavaScript", "React.js"],
  ["JavaScript", "Node.js"],
  ["TypeScript", "React.js"],
  ["TypeScript", "Next.js"],
  ["JavaScript", "React Native"],
  ["C#", ".NET 8"],
  ["Node.js", "Express.js"],
  ["SQL", "PostgreSQL"],
  ["React Native", "Campus Ride Pooling"],
  ["React Native", "AI Tutor"],
  ["FastAPI", "Face Recognition Attendance"],
  ["Python", "Automated Tech News Pipeline"],
  ["React.js", "AI Retail Investor Dashboard"],
  ["Node.js", "Campus Ride Pooling"],
  ["OpenAI API", "RamayanaGPT"],
  ["OpenAI API", "AI Tutor"],
  ["Prompt Engineering", "RamayanaGPT"],
  ["LLM Evaluation", "RamayanaGPT"],
  ["Workflow Automation", "Automated Tech News Pipeline"],
  ["Campus Ride Pooling", "Firebase"],
  ["Campus Ride Pooling", "Stripe API"],
  ["Campus Ride Pooling", "Mapbox"],
  ["Face Recognition Attendance", "JWT Auth"],
  ["AI Retail Investor Dashboard", "SQL"],
];

/** Factual counters for the metrics section — all derived from the resume. */
export const metrics = [
  { value: 6, suffix: "", label: "apps shipped end-to-end", note: "AI, mobile, web and CV projects" },
  { value: 9, suffix: "", label: "programming languages", note: "Python to C# to TypeScript" },
  { value: 4, suffix: "", label: "backend ecosystems", note: "Node, Django, FastAPI, .NET 8" },
  { value: 9.11, suffix: "/10", label: "diploma CGPA", note: "Government Polytechnic, Ahmedabad" },
] as const;

export const sections = [
  { id: "home", label: "home", title: "boot" },
  { id: "education", label: "training_data", title: "Education" },
  { id: "experience", label: "runtime_logs", title: "Experience" },
  { id: "projects", label: "applications", title: "Projects" },
  { id: "skills", label: "neural_graph", title: "Skills" },
  { id: "metrics", label: "sys_metrics", title: "Metrics" },
  { id: "contact", label: "uplink", title: "Contact" },
] as const;

/* ===========================================================================
   PROJECT VICE — game framing (cosmetic labels over the real resume content).
=========================================================================== */

/** Districts drive the HUD location readout, the minimap blips and quick-travel. */
export interface District {
  id: string; // matches a section's DOM id
  code: string; // 2–3 char minimap tag
  location: string; // full HUD location name
  blip: string; // short minimap label
  x: number; // minimap position, 0–100
  y: number;
  color: "pink" | "cyan" | "gold" | "purple";
}

export const districts: District[] = [
  { id: "home", code: "VC", location: "WELCOME TO VICE CITY", blip: "DOWNTOWN", x: 50, y: 34, color: "pink" },
  { id: "education", code: "SV", location: "CHECKPOINT DISTRICT", blip: "SAVES", x: 24, y: 22, color: "cyan" },
  { id: "experience", code: "JB", location: "CAREER MILE", blip: "JOBS", x: 78, y: 26, color: "gold" },
  { id: "projects", code: "MX", location: "MISSION ROW", blip: "MISSIONS", x: 66, y: 58, color: "pink" },
  { id: "skills", code: "AR", location: "THE ARSENAL", blip: "SKILLS", x: 30, y: 62, color: "purple" },
  { id: "metrics", code: "ST", location: "STATS PLAZA", blip: "STATS", x: 50, y: 78, color: "cyan" },
  { id: "contact", code: "PP", location: "THE PAYPHONE", blip: "COMMS", x: 82, y: 82, color: "gold" },
];

/** Cosmetic radio stations. Tempo/scale tweak the in-browser synthwave generator. */
export interface Station {
  id: string;
  name: string;
  dial: string;
  genre: string;
  bpm: number;
  color: "pink" | "cyan" | "gold" | "purple";
}

export const stations: Station[] = [
  { id: "wave", name: "NEON WAVE", dial: "103.7", genre: "SYNTHWAVE", bpm: 100, color: "pink" },
  { id: "flash", name: "FLASH FM", dial: "88.5", genre: "RETRO POP", bpm: 116, color: "cyan" },
  { id: "vice", name: "VICE NIGHTS", dial: "96.1", genre: "DARK SYNTH", bpm: 84, color: "purple" },
  { id: "sunset", name: "SUNSET DRIVE", dial: "108.0", genre: "CHILLWAVE", bpm: 72, color: "gold" },
];

/** Cheat codes. `code` is typed on the keyboard; "KONAMI" is the arrow sequence. */
export interface Cheat {
  id: string;
  code: string;
  label: string;
  hint: string;
}

export const cheats: Cheat[] = [
  { id: "wanted", code: "VICE", label: "SIX STARS", hint: "raise the heat to max" },
  { id: "daylight", code: "SUNNY", label: "DAYLIGHT", hint: "flip the city to midday" },
  { id: "godmode", code: "IDDQD", label: "STAR RAIN", hint: "classic — you know this one" },
  { id: "secret", code: "KONAMI", label: "SECRET MISSION", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
];

/** Revealed by the Konami cheat — a playful signature, not a resume claim. */
export const secretMission = {
  codename: "OPERATION: GHOST COMMIT",
  lines: [
    "// You found the cheat menu. Respect.",
    "// This whole city was hand-built in code — no page templates.",
    "// Every stat on the map is pulled straight from a real résumé.",
    "// Now go hire the developer who hid this here. — MAHARSHI",
  ],
} as const;

/** Loading-screen tips shown while the city streams in. */
export const loadingTips: string[] = [
  "TIP: Press the ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard for a surprise.",
  "TIP: Open the PHONE (bottom-right) to reach the developer.",
  "TIP: Tap a blip on the MINIMAP to fast-travel across the city.",
  "TIP: Hit the RADIO to turn on the synthwave. It's off by default.",
  "TIP: Press ⌘K / Ctrl+K for quick-travel and cheats.",
  "TIP: Every mission is a real project shipped end-to-end.",
];
