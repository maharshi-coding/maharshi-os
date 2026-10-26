"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import StickyNav from "./components/StickyNav";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import About from "./sections/About";
import Expertise from "./sections/Expertise";
import Work from "./sections/Work";
import OpenSource from "./sections/OpenSource";
import Journey from "./sections/Journey";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";

/**
 * The homepage — a "Creator"-styled scrolling tour (Jack-inspired: Kanit,
 * #0C0C0C, steel-gradient headings, magnetic hero, scroll-driven marquee,
 * char-reveal About, white Expertise panel, sticky-stacking project cards),
 * populated end-to-end with Maharshi's real content.
 *
 * Scrolling and the cursor are native; motion honours prefers-reduced-motion
 * via <MotionConfig reducedMotion="user"> and per-component guards.
 */
export default function Home() {
  const reduced = !!useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="hx">
        <StickyNav />
        <main className="hx-main">
          <Hero reduced={reduced} />
          <Marquee />
          <About />
          <Expertise />
          <Work />
          <OpenSource />
          <Journey />
          <Skills />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
