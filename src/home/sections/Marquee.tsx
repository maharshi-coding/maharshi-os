"use client";

import { useEffect, useRef } from "react";
import {
  Atom,
  Bot,
  Boxes,
  Braces,
  Car,
  Cloud,
  Code2,
  Database,
  Eye,
  Hexagon,
  Layers,
  ScanFace,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Triangle,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Two rows of on-brand tiles that scroll horizontally in opposite directions as
 * the page scrolls (mirrors Jack's marquee, but built from Maharshi's real stack
 * and work, each with a themed graphic, instead of hotlinked third-party GIFs).
 */

type Tile = { label: string; tag: string; Icon: LucideIcon };

const ROW1: Tile[] = [
  { label: "Python", tag: "lang", Icon: Code2 },
  { label: "TypeScript", tag: "lang", Icon: Braces },
  { label: "React", tag: "frontend", Icon: Atom },
  { label: "Next.js", tag: "frontend", Icon: Triangle },
  { label: "Node.js", tag: "backend", Icon: Hexagon },
  { label: "FastAPI", tag: "backend", Icon: Zap },
  { label: ".NET 8", tag: "backend", Icon: Boxes },
  { label: "React Native", tag: "mobile", Icon: Smartphone },
  { label: "OpenAI · Claude", tag: "ai", Icon: Sparkles },
  { label: "RAG · Agents", tag: "ai", Icon: Bot },
  { label: "AWS · GCP", tag: "cloud", Icon: Cloud },
];

const ROW2: Tile[] = [
  { label: "AI Agents", tag: "domain", Icon: Bot },
  { label: "Campus Ride Pooling", tag: "mobile", Icon: Car },
  { label: "Face Recognition", tag: "vision", Icon: ScanFace },
  { label: "DataHub Steward Squad", tag: "agents", Icon: Database },
  { label: "Overturn", tag: "agents", Icon: ShieldCheck },
  { label: "Seller Shield", tag: "agents", Icon: Shield },
  { label: "Computer Vision", tag: "domain", Icon: Eye },
  { label: "Automation", tag: "domain", Icon: Workflow },
  { label: "Full-Stack", tag: "domain", Icon: Layers },
  { label: "Mobile Apps", tag: "domain", Icon: Smartphone },
];

function Tiles({ tiles, variant }: { tiles: Tile[]; variant: 1 | 2 }) {
  return (
    <>
      {[0, 1, 2].map((rep) =>
        tiles.map(({ label, tag, Icon }, i) => (
          <div key={`${rep}-${i}`} className="jk-tile" data-variant={variant} aria-hidden={rep > 0}>
            <Icon className="jk-tile__icon" strokeWidth={1.25} aria-hidden="true" />
            <span className="jk-tile__tag">{tag}</span>
            <span className="jk-tile__label">{label}</span>
          </div>
        ))
      )}
    </>
  );
}

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const x = offset - 200;
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${x}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${-x}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Technologies and selected work"
      className="overflow-hidden pt-24 pb-10 sm:pt-32 md:pt-40"
      style={{ overflowX: "clip" }}
    >
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="jk-marquee-row">
          <Tiles tiles={ROW1} variant={1} />
        </div>
        <div ref={row2Ref} className="jk-marquee-row">
          <Tiles tiles={ROW2} variant={2} />
        </div>
      </div>
    </section>
  );
}
