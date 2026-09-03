"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { person } from "@/data/resume";
import { heroNodes, roleWords } from "../content";
import { scrollToId } from "../SmoothScroll";

const DigitalCore = dynamic(() => import("../DigitalCore"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

function Line({ text, outline, delay }: { text: string; outline?: boolean; delay: number }) {
  return (
    <span className={outline ? "is-outline" : undefined} style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} className="hx-charmask">
          <span className="hx-char" style={{ animationDelay: `${delay + i * 0.035}s` }}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

function RoleSwitcher({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % roleWords.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <span className="hx-roles">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="hx-roles__item"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {roleWords[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [use3D, setUse3D] = useState(false);
  const energy = active ? 1 : 0;

  useEffect(() => {
    // Only run the WebGL core on capable desktops — mobile/touch stays light.
    setUse3D(window.matchMedia("(min-width: 768px) and (pointer: fine)").matches);
  }, []);

  return (
    <header id="top" className="hx-hero">
      {use3D && (
        <div className="hx-hero__canvas" aria-hidden="true">
          <DigitalCore energy={energy} />
        </div>
      )}

      <div className="hx-container hx-hero__inner">
        <motion.p
          className="hx-eyebrow hx-hero__eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          AI Solutions Developer · Full-Stack Engineer
        </motion.p>

        <h1 className="hx-hero__name">
          <Line text="MAHARSHI" delay={0.15} />
          <Line text="BAROT" outline delay={0.4} />
        </h1>

        <motion.div
          className="hx-hero__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <span className="hx-hero__build">I build</span>
          <RoleSwitcher reduced={reduced} />
        </motion.div>

        <motion.p
          className="hx-hero__tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.05 }}
        >
          {person.tagline} I turn ideas into intelligent products and ship them end-to-end —
          from prompt to production.
        </motion.p>

        <div className="hx-hero__cta">
          <button type="button" className="hx-btn hx-btn--primary" onClick={() => scrollToId("work")}>
            View my work
            <ArrowRight size={15} strokeWidth={2} />
          </button>
          <button type="button" className="hx-btn" onClick={() => scrollToId("contact")}>
            Get in touch
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="hx-nodes" onMouseLeave={() => setActive(null)}>
          {heroNodes.map((node) => (
            <div
              key={node.id}
              className="hx-node"
              data-active={active === node.id}
              tabIndex={0}
              onMouseEnter={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
            >
              {node.label}
              <div className="hx-node__pop" role="tooltip">
                <h4>{node.blurb}</h4>
                <ul>
                  {node.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
