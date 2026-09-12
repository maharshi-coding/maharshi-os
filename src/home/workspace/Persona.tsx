"use client";

import { useEffect, useState } from "react";
import type { CharacterState } from "./characterState";

const BARS = [0, 1, 2, 3, 4, 5, 6];

/**
 * A bespoke, on-brand "digital persona" — Maharshi's guide, drawn in SVG/CSS.
 * Idles with a soft breathe + natural blink; on greet/talk its eyes focus and
 * a voice waveform animates. Deterministic (no WebGL), so it's crisp,
 * glitch-free, and fully controllable. `state` mirrors the guide's dialogue.
 */
export default function Persona({
  state,
  onInteract,
  reduced,
}: {
  state: CharacterState;
  onInteract: () => void;
  reduced: boolean;
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let t: number;
    const loop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 150);
      t = window.setTimeout(loop, 2400 + Math.random() * 2800);
    };
    t = window.setTimeout(loop, 1600);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <button
      type="button"
      className="hx-persona"
      data-state={state}
      data-blink={blink}
      onClick={onInteract}
      aria-label="Talk to Maharshi's guide"
    >
      <span className="hx-persona__glow" aria-hidden="true" />
      <svg viewBox="0 0 360 360" className="hx-persona__svg" aria-hidden="true">
        <defs>
          <radialGradient id="hxp-face" cx="42%" cy="36%" r="72%">
            <stop offset="0%" stopColor="#413b86" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#191932" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#0a0a16" stopOpacity="0.96" />
          </radialGradient>
          <linearGradient id="hxp-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7d6dff" />
            <stop offset="100%" stopColor="#4d9fff" />
          </linearGradient>
          <linearGradient id="hxp-eye" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7b6ff" />
            <stop offset="100%" stopColor="#4d9fff" />
          </linearGradient>
        </defs>

        <g className="hx-persona__orbit">
          <ellipse cx="180" cy="182" rx="152" ry="56" fill="none" stroke="rgba(125,109,255,0.30)" strokeWidth="1" />
          <ellipse
            cx="180"
            cy="180"
            rx="104"
            ry="150"
            transform="rotate(22 180 180)"
            fill="none"
            stroke="rgba(77,159,255,0.22)"
            strokeWidth="1"
          />
          <circle className="hx-persona__node" cx="332" cy="176" r="4.5" fill="#8ea2ff" />
          <circle className="hx-persona__node" cx="60" cy="150" r="3.5" fill="#7d6dff" />
          <circle className="hx-persona__node" cx="256" cy="44" r="3" fill="#4d9fff" />
        </g>

        <g className="hx-persona__head">
          <circle className="hx-persona__aura" cx="180" cy="172" r="86" fill="none" stroke="rgba(77,159,255,0.30)" strokeWidth="1" />
          <circle cx="180" cy="172" r="72" fill="url(#hxp-face)" stroke="url(#hxp-rim)" strokeWidth="1.6" />

          <g className="hx-persona__eyes">
            <rect x="144" y="150" width="15" height="30" rx="7.5" fill="url(#hxp-eye)" />
            <rect x="201" y="150" width="15" height="30" rx="7.5" fill="url(#hxp-eye)" />
          </g>

          <g className="hx-persona__mouth">
            {BARS.map((i) => (
              <rect
                key={i}
                x={149 + i * 10}
                y="196"
                width="5"
                height="12"
                rx="2.5"
                fill="#8296ff"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </g>
        </g>
      </svg>
    </button>
  );
}
