"use client";

import { MotionConfig, motion, useReducedMotion, useScroll } from "framer-motion";
import Background from "./Background";
import CustomCursor from "./CustomCursor";
import Nav from "./Nav";
import SmoothScroll from "./SmoothScroll";
import Companion from "./companion/Companion";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Journey from "./sections/Journey";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";

/**
 * The redesigned homepage: a scrolling "digital intelligence" experience.
 * Reads reduced-motion once and threads it through the motion-heavy pieces.
 */
export default function Home() {
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div className="hx">
        <Background reduced={reduced} />
        <CustomCursor />
        <Companion />
        <SmoothScroll reduced={reduced} />
        <motion.div className="hx-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
        <Nav />

        <main className="hx-main">
          <Hero reduced={reduced} />
          <Work />
          <Journey />
          <Skills />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
