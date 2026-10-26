"use client";

import FadeIn from "../components/FadeIn";

/** Jack's white "Services" section, reframed to Maharshi's real capabilities. */
const ITEMS = [
  {
    name: "AI Systems & Agents",
    desc: "LLM products and autonomous multi-agent systems — RAG, tool use, grounding and evaluation — built with OpenAI, Claude, Gemini and Bedrock, and shipped to production.",
  },
  {
    name: "Full-Stack Engineering",
    desc: "End-to-end web apps and APIs across React, Next.js, Node.js, Django, FastAPI and .NET 8 — from the data model to a deployed, tested UI.",
  },
  {
    name: "Mobile Apps",
    desc: "Cross-platform apps with React Native and Firebase — real-time data, payments, identity verification and maps, released end-to-end.",
  },
  {
    name: "Automation & DevOps",
    desc: "Background pipelines and cloud automation — Cloud Functions, schedulers, Pub/Sub, Docker and CI/CD — that keep working after you close the tab.",
  },
  {
    name: "Computer Vision",
    desc: "Recognition systems with OpenCV and embeddings, hardened with blink-based liveness detection and anti-spoofing.",
  },
];

export default function Expertise() {
  return (
    <section
      id="expertise"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="mb-16 text-center font-black uppercase leading-none text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Expertise
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {ITEMS.map((it, i) => (
          <FadeIn
            key={it.name}
            delay={i * 0.1}
            className="flex items-start gap-4 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:gap-8 sm:py-10 md:py-12"
          >
            <span
              className="shrink-0 font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: "clamp(2.1rem, 10vw, 140px)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-1 sm:pt-2">
              <h3
                className="font-medium uppercase leading-tight text-[#0C0C0C]"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {it.name}
              </h3>
              <p
                className="mt-2 max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60"
                style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
              >
                {it.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
