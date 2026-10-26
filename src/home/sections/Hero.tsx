"use client";

import dynamic from "next/dynamic";
import FadeIn from "../components/FadeIn";
import Magnet from "../components/Magnet";
import ContactButton from "../components/ContactButton";
import { scrollToId } from "../scroll";

const WorkspaceScene = dynamic(() => import("./WorkspaceScene"), { ssr: false });

const NAV = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Open Source", id: "opensource" },
  { label: "Contact", id: "contact" },
];

export default function Hero({ reduced }: { reduced: boolean }) {
  return (
    <header
      id="top"
      className="relative flex min-h-screen flex-col px-6 md:px-10"
      style={{ overflowX: "clip" }}
    >
      {/* Navbar */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="flex items-center justify-between gap-6 pt-6 md:pt-8"
      >
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="jk-link hidden shrink-0 text-sm font-semibold uppercase tracking-wider text-[#D7E2EA] sm:block md:text-lg"
        >
          Maharshi Barot
        </button>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-7 md:gap-9">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => scrollToId(n.id)}
              className="jk-link whitespace-nowrap text-xs font-medium uppercase tracking-wider text-[#D7E2EA] sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {n.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Center stage: name + magnetic workspace scene */}
      <div className="relative flex flex-1 flex-col items-center justify-center py-6">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading w-full text-center font-black uppercase leading-[0.82] tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 13vw, 15rem)" }}
        >
          <span className="block">Maharshi</span>
          <span className="block">Barot</span>
        </FadeIn>

        <FadeIn
          delay={0.45}
          y={30}
          className="mt-6 w-full max-w-[640px] px-2 md:-mt-2"
        >
          <Magnet padding={120} strength={4} className="mx-auto w-full">
            <WorkspaceScene reduced={reduced} />
          </Magnet>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex items-end justify-between gap-6 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[200px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[260px] md:max-w-[320px]"
          style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.4rem)" }}
        >
          AI Solutions Developer &amp; Full-Stack Engineer — building intelligent products from idea
          to production.
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="shrink-0">
          <ContactButton />
        </FadeIn>
      </div>
    </header>
  );
}
