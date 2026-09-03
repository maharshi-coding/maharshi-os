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
  location: "Corpus Christi, TX, USA",
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
    degree: "M.S. in Computer Science",
    period: "Jan 2026 – Dec 2027",
    detail: "GPA 3.5 / 4.0",
    status: "RUNNING",
  },
  {
    id: "pdeu",
    institution: "Pandit Deendayal Energy University",
    degree: "B.E. in Computer Engineering",
    period: "Sep 2022 – Jun 2025",
    detail: "GPA 3.2 / 4.0",
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
    id: "meeka",
    role: "Software Developer",
    org: "Meeka Consultancy LLC",
    period: "Jan 2026 – Jun 2026",
    location: "United States",
    level: "EXEC",
    logs: [
      "Shipped end-to-end frontend and backend features across a live production codebase and cloud services — implementing APIs and resolving defects through debugging.",
      "Strengthened production quality across 12 collaborative software releases through code reviews, targeted testing, and DevOps release execution.",
    ],
  },
  {
    id: "treta",
    role: "AI & LLM Product Developer Intern",
    org: "Treta Gen.",
    period: "Jun 2025 – Nov 2025",
    location: "India",
    level: "EXEC",
    logs: [
      "Prioritized validated opportunities across ambiguous customer problems by applying LLMs, Python scripting, and machine-learning experimentation to test hypotheses in Linux/Unix environments.",
      "Accelerated production AI product launches and strengthened reliability through rapid prototyping, ML evaluation, and root-cause debugging across DevOps deployment practices.",
    ],
  },
  {
    id: "bws",
    role: "Full Stack Web Development Intern",
    org: "Business Web Solutions",
    period: "Jan 2025 – May 2025",
    location: "India",
    level: "PROC",
    logs: [
      "Delivered production-ready, customer-facing full-stack features across Agile sprints using TypeScript, Node.js, and strong engineering fundamentals.",
      "Coordinated committed sprint deliveries across cross-functional teams by debugging implementation blockers and validating web services through clear technical communication.",
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
  live?: string; // public, click-to-test deployment (only where one actually exists)
  liveLabel?: string; // button text for `live` (defaults to "Live Demo"; e.g. "Walkthrough")
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
    github: "https://github.com/maharshi-coding/ride-share",
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
    github: "https://github.com/maharshi-coding/face-attendance-app",
  },
  {
    id: "datahub-steward",
    name: "DataHub Steward Squad",
    binary: "steward-squad.mcp",
    kind: "AI Agents · Data Governance",
    featured: true,
    summary:
      "A five-agent system that reads real DataHub metadata over the Model Context Protocol, finds governance risks — missing owners, unclassified PII, lineage blast radius, failing quality assertions — and writes approval-gated fixes back to a live catalog, verified by re-reading.",
    stack: [
      "Python",
      "Claude API",
      "Model Context Protocol (MCP)",
      "Multi-Agent Systems",
      "DataHub",
    ],
    features: [
      "Five specialist agents: catalog scout, lineage investigator, quality sentinel, stewardship writer, release captain",
      "Reads real DataHub metadata over MCP and writes governed fixes back — then re-reads to prove they landed",
      "Claude-powered Chief Steward reasons over grounded findings into an executive brief",
      "Deterministic offline fallback runs the whole loop with zero credentials (29 passing tests, Apache-2.0)",
    ],
    challenge:
      "Turning a data catalog into governed action — detecting real risks and safely writing fixes back without an agent inventing changes.",
    approach:
      "Five deterministic agents surface grounded findings from the graph; a Claude coordinator prioritizes them; every mutation is approval-gated, pushed through real MCP writeback tools, then re-read to verify it applied.",
    impact:
      "A real read → analyze → writeback → verify loop against live DataHub — not a JSON plan on disk — with an offline mock so anyone can run it in seconds.",
    architecture: [
      { from: "DataHub (via MCP)", to: "Catalog + lineage read" },
      { from: "Catalog + lineage read", to: "Five specialist agents" },
      { from: "Five specialist agents", to: "Chief Steward (Claude)" },
      { from: "Chief Steward (Claude)", to: "Approval-gated writeback" },
      { from: "Approval-gated writeback", to: "DataHub (re-read to verify)" },
    ],
    nodes: [
      "DataHub (via MCP)",
      "Catalog + lineage read",
      "Five specialist agents",
      "Chief Steward (Claude)",
      "Approval-gated writeback",
      "DataHub (re-read to verify)",
    ],
    github: "https://github.com/maharshi-coding/datahub-steward-squad",
    live: "https://maharshi-coding.github.io/datahub-steward-squad/",
    liveLabel: "Walkthrough",
  },
  {
    id: "overturn",
    name: "Overturn",
    binary: "overturn.agent",
    kind: "AI Agents · Autonomous",
    featured: true,
    summary:
      "An autonomous agent that fights wrongful health-insurance denials — it reads the denial packet, diagnoses why the claim was rejected, drafts a clause-cited appeal, files it, and keeps following up in the background for weeks until it's resolved.",
    stack: [
      "TypeScript",
      "Gemini",
      "Google GenAI SDK",
      "Cloud Run",
      "Firestore",
      "Cloud Scheduler + Pub/Sub",
    ],
    features: [
      "Multi-agent pipeline: intake → diagnosis → drafting → grounding self-check → filing",
      "Runs asynchronously in the background on a 14-day follow-up cadence, escalating after three attempts",
      "Grounding agent blocks fabricated clinical facts and triggers automatic redrafts",
      "Firestore 'Memory Bank' persists full case state so the agent resumes weeks later exactly where it left off",
    ],
    challenge:
      "Most denied claims are never appealed because appealing means decoding dense policy language while you're already unwell — and a medical letter must never invent clinical facts.",
    approach:
      "A Gemini-driven multi-agent orchestrator with schema-validated, retried steps; a dedicated grounding reflection loop catches hallucinations; Cloud Scheduler + Pub/Sub drive the autonomous follow-up engine.",
    impact:
      "An agent that doesn't stop when you close the tab — measured in denials overturned and money recovered, with mock backends so the full pipeline runs and is tested without any API key.",
    architecture: [
      { from: "Patient uploads denial packet", to: "Orchestrator (Cloud Run)" },
      { from: "Orchestrator (Cloud Run)", to: "Intake → Diagnosis → Drafting → Filing" },
      { from: "Intake → Diagnosis → Drafting → Filing", to: "Gemini (GenAI SDK)" },
      { from: "Orchestrator (Cloud Run)", to: "Firestore Memory Bank" },
      { from: "Cloud Scheduler + Pub/Sub", to: "Background follow-up loop" },
    ],
    nodes: [
      "Patient uploads denial packet",
      "Orchestrator (Cloud Run)",
      "Intake → Diagnosis → Drafting → Filing",
      "Gemini (GenAI SDK)",
      "Firestore Memory Bank",
      "Background follow-up loop",
    ],
    github: "https://github.com/maharshi-coding/overturn",
    live: "https://overturn-368045431718.us-central1.run.app",
  },
  {
    id: "seller-shield",
    name: "Seller Shield",
    binary: "seller-shield.aws",
    kind: "AI Agents · AWS",
    featured: true,
    summary:
      "A four-agent AI team that protects small Amazon sellers — it watches account health in real time, catches suspension and return-fraud risk before it lands, and auto-drafts the evidence-backed appeal or SAFE-T reimbursement claim, citing the exact policy clause.",
    stack: [
      "Python",
      "Strands Agents SDK",
      "Amazon Bedrock",
      "Bedrock Knowledge Base",
      "FastAPI",
      "React",
      "AWS",
    ],
    features: [
      "Four specialist agents — Monitor, Evidence, Drafting, Escalation — composed as tools under one orchestrator (Agents-as-Tools)",
      "Detects suspension risk, ODR/OTDR drift and single-buyer return-fraud spikes, then routes to an advisory or a drafted claim",
      "Bedrock Knowledge Base RAG retrieves the correct Amazon policy clause so every appeal cites real policy, never hallucinated text",
      "Each agent has a deterministic, unit-tested core (138 passing tests) that runs with zero credentials — deployed as a keyless live demo",
    ],
    challenge:
      "Amazon's enforcement is near-instant and automated — listings are suppressed within minutes — while return fraud has climbed to ~14% of returns, and small sellers have no compliance team to react in time or fight back with the right evidence.",
    approach:
      "Four Strands agents on Amazon Bedrock, each split into a deterministic core (detect → evidence → draft → escalate) plus LLM narration; an orchestrator chains them by event, and a Bedrock Knowledge Base grounds every policy citation.",
    impact:
      "Not just policy explanation — it does the paperwork: an evidence-backed appeal or reimbursement claim, drafted automatically, for an underserved B2B audience. The full pipeline is deterministic, tested, and live end-to-end.",
    architecture: [
      { from: "Seller account-health feed", to: "Monitor agent" },
      { from: "Monitor agent", to: "RiskEvent" },
      { from: "RiskEvent", to: "Evidence agent (Bedrock KB RAG)" },
      { from: "Evidence agent (Bedrock KB RAG)", to: "Drafting agent" },
      { from: "Drafting agent", to: "Escalation agent" },
    ],
    nodes: [
      "Seller account-health feed",
      "Monitor agent",
      "RiskEvent",
      "Evidence agent (Bedrock KB RAG)",
      "Drafting agent",
      "Escalation agent",
    ],
    github: "https://github.com/maharshi-coding/seller-shield",
    live: "https://maharshi-coding.github.io/seller-shield/",
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
    github: "https://github.com/maharshi-coding/ai-tutor-app",
  },
];

export const skillCategories = [
  {
    id: "ai",
    label: "AI / LLM",
    skills: [
      "OpenAI API",
      "LangChain",
      "Prompt Engineering",
      "RAG",
      "Agent-Based Systems",
      "LLM Evaluation",
      "PyTorch",
      "NLP",
      "Workflow Automation",
    ],
  },
  {
    id: "lang",
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "C#", "C/C++", "Java", "SQL", "PHP", "MATLAB"],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React.js", "Next.js", "React Native", "Angular", "Tailwind CSS", "Bootstrap", "HTML/CSS"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "Express.js", "Django", "FastAPI", "Flask", "ASP.NET", "Spring", ".NET 8", "REST APIs"],
  },
  {
    id: "db",
    label: "Databases",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "DynamoDB",
      "Redis",
      "Elasticsearch",
      "Oracle",
      "Microsoft SQL Server",
      "Firebase Firestore",
      "SQLite",
    ],
  },
  {
    id: "cloud",
    label: "Cloud / Tools",
    skills: [
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Linux/Unix",
      "Git",
      "CI/CD (GitHub Actions)",
      "Firebase",
      "Stripe API",
      "Mapbox",
      "JWT Auth",
    ],
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
  ["Python", "Seller Shield"],
  ["FastAPI", "Seller Shield"],
  ["Agent-Based Systems", "Seller Shield"],
  ["Node.js", "Campus Ride Pooling"],
  ["OpenAI API", "AI Tutor"],
  ["Prompt Engineering", "AI Tutor"],
  ["Campus Ride Pooling", "Firebase"],
  ["Campus Ride Pooling", "Stripe API"],
  ["Campus Ride Pooling", "Mapbox"],
  ["Face Recognition Attendance", "JWT Auth"],
  ["Python", "DataHub Steward Squad"],
  ["Agent-Based Systems", "DataHub Steward Squad"],
  ["Docker", "DataHub Steward Squad"],
  ["TypeScript", "Overturn"],
  ["Agent-Based Systems", "Overturn"],
  ["Firebase Firestore", "Overturn"],
  ["AWS", "Seller Shield"],
  ["GCP", "Overturn"],
];

/** Factual counters for the metrics section — all derived from the resume. */
export const metrics = [
  { value: 6, suffix: "", label: "apps shipped end-to-end", note: "AI, mobile, web and CV projects" },
  { value: 9, suffix: "", label: "programming languages", note: "Python to C# to TypeScript" },
  { value: 4, suffix: "", label: "backend ecosystems", note: "Node, Django, FastAPI, .NET 8" },
  { value: 3.5, suffix: "/4", label: "master's GPA", note: "Texas A&M University–Corpus Christi" },
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
