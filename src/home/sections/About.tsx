"use client";

import FadeIn from "../components/FadeIn";
import AnimatedText from "../components/AnimatedText";
import ContactButton from "../components/ContactButton";

const ABOUT_TEXT =
  "I'm an AI Solutions Developer and Full-Stack Engineer who ships intelligent products end-to-end — from autonomous agents and LLM systems to full-stack apps, mobile experiences and computer vision. I turn ambiguous ideas into working, tested software, and I upstream fixes to the open-source tools the industry runs on. Let's build something intelligent together.";

/* On-brand abstract decorations (replacing Jack's figma 3D images). */
function ShapeMoon() {
  return (
    <svg viewBox="0 0 120 120" className="jk-float h-full w-full">
      <defs>
        <radialGradient id="jk-moon" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#d7e2ea" />
          <stop offset="60%" stopColor="#8a93a0" />
          <stop offset="100%" stopColor="#3b3f47" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#jk-moon)" />
      <circle cx="46" cy="48" r="7" fill="#2b2e34" opacity="0.5" />
      <circle cx="72" cy="66" r="10" fill="#2b2e34" opacity="0.4" />
      <ellipse cx="60" cy="60" rx="56" ry="20" fill="none" stroke="rgba(182,0,168,0.5)" strokeWidth="1.5" transform="rotate(-18 60 60)" />
    </svg>
  );
}
function ShapeTorus() {
  return (
    <svg viewBox="0 0 120 120" className="jk-float h-full w-full">
      <defs>
        <linearGradient id="jk-torus" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b600a8" />
          <stop offset="100%" stopColor="#7621b0" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill="none" stroke="url(#jk-torus)" strokeWidth="18" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(215,226,234,0.25)" strokeWidth="2" />
    </svg>
  );
}
function ShapeBlocks() {
  return (
    <svg viewBox="0 0 120 120" className="jk-float h-full w-full">
      <defs>
        <linearGradient id="jk-blocks" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bbccd7" />
          <stop offset="100%" stopColor="#646973" />
        </linearGradient>
      </defs>
      <rect x="26" y="26" width="38" height="38" rx="9" fill="url(#jk-blocks)" />
      <rect x="58" y="54" width="38" height="38" rx="9" fill="#be4c00" opacity="0.85" />
      <rect x="40" y="62" width="26" height="26" rx="7" fill="#7621b0" />
    </svg>
  );
}
function ShapeCluster() {
  return (
    <svg viewBox="0 0 120 120" className="jk-float h-full w-full">
      <defs>
        <radialGradient id="jk-sph" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#d7e2ea" />
          <stop offset="100%" stopColor="#5a5f68" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="54" r="26" fill="url(#jk-sph)" />
      <circle cx="80" cy="44" r="15" fill="#b600a8" opacity="0.9" />
      <circle cx="78" cy="78" r="18" fill="#7621b0" />
    </svg>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
      style={{ overflowX: "clip" }}
    >
      {/* Corner decorations */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="pointer-events-none absolute left-[1%] top-[4%] z-0 w-[110px] sm:left-[2%] sm:w-[150px] md:left-[4%] md:w-[200px]">
        <ShapeMoon />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="pointer-events-none absolute bottom-[8%] left-[3%] z-0 w-[90px] sm:left-[6%] sm:w-[130px] md:left-[10%] md:w-[170px]">
        <ShapeTorus />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="pointer-events-none absolute right-[1%] top-[4%] z-0 w-[110px] sm:right-[2%] sm:w-[150px] md:right-[4%] md:w-[200px]">
        <ShapeBlocks />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="pointer-events-none absolute bottom-[8%] right-[3%] z-0 w-[120px] sm:right-[6%] sm:w-[160px] md:right-[10%] md:w-[210px]">
        <ShapeCluster />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn as="h2" delay={0} y={40} className="hero-heading jk-h2 text-center">
          About me
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text={ABOUT_TEXT}
            className="max-w-[620px] text-center font-medium leading-relaxed text-[#D7E2EA] text-[clamp(1rem,2vw,1.35rem)]"
          />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
