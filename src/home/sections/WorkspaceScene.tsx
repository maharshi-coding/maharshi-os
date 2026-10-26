"use client";

import { useEffect, useRef, useState } from "react";
import { currentProject } from "@/data/currentProject";
import { openSourceContributions } from "@/data/openSource";
import { projects } from "@/data/resume";

/**
 * The hero centrepiece: a lifelike, softly-lit developer workspace rendered as a
 * single responsive SVG. A developer (shown from behind, headphones on) sits at
 * a desk between two glowing monitors — the left screen types a live build feed
 * drawn from real data, the right screen cycles through shipped projects. Steam
 * rises from the mug, the ambient light breathes, and on capable desktops the
 * layers parallax gently toward the pointer.
 *
 * Everything is deterministic SVG + CSS (no WebGL), so it's crisp, light and
 * stable. All motion pauses under `prefers-reduced-motion` and when the tab is
 * hidden, and pointer-events stay off so it never interferes with scrolling.
 */

// A short, truthful "build feed" derived from the real current work + PRs.
const nav2 = openSourceContributions.find((c) => c.repo === "navigation2");
const moveit = openSourceContributions.find((c) => c.repo === "moveit2");

const FEED: string[] = [
  "~/ros2_ws $ git fetch upstream",
  "$ colcon build --symlink-install",
  nav2 ? `● nav2 · PR #${nav2.pr} — merged ✓` : "● nav2 — merged ✓",
  moveit ? `● moveit2 · PR #${moveit.pr} — review` : "● moveit2 — in review",
  "$ ros2 launch nav2_bringup",
  "// upstreaming ROS 2 fixes",
  "$ git commit -m \"cancel race\"",
];

const MAX_LINES = 5;

export default function WorkspaceScene({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // ---- Live typed build-feed (left monitor) --------------------------------
  const [lines, setLines] = useState<string[]>(() =>
    reduced ? FEED.slice(0, MAX_LINES) : [FEED[0]]
  );
  const [typing, setTyping] = useState<string>("");

  useEffect(() => {
    if (reduced) return;
    let feedIndex = 1;
    let charIndex = 0;
    let timer: number;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (document.hidden) {
        timer = window.setTimeout(tick, 400);
        return;
      }
      const target = FEED[feedIndex % FEED.length];
      charIndex += 1;
      if (charIndex <= target.length) {
        setTyping(target.slice(0, charIndex));
        timer = window.setTimeout(tick, 34 + Math.random() * 46);
      } else {
        // Line finished — commit it and move on after a brief pause.
        setLines((prev) => [...prev, target].slice(-MAX_LINES));
        setTyping("");
        feedIndex += 1;
        charIndex = 0;
        timer = window.setTimeout(tick, 900);
      }
    };
    timer = window.setTimeout(tick, 1100);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduced]);

  // ---- Cycling project preview (right monitor) -----------------------------
  const [pIndex, setPIndex] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setPIndex((v) => (v + 1) % projects.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);
  const preview = projects[pIndex];

  // ---- Pointer parallax (desktop, fine pointer only) -----------------------
  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 880px) and (pointer: fine)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      target.y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      target.x = Math.max(-1, Math.min(1, target.x));
      target.y = Math.max(-1, Math.min(1, target.y));
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      root.style.setProperty("--px", cur.x.toFixed(3));
      root.style.setProperty("--py", cur.y.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const shown = typing ? [...lines, typing].slice(-MAX_LINES) : lines;

  return (
    <div className="hx-scene" ref={rootRef} aria-hidden="true">
      <svg
        className="hx-scene__svg"
        viewBox="0 0 560 440"
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hxsAmbient" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#7621b0" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#b600a8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#b600a8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hxsWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101018" />
            <stop offset="100%" stopColor="#08080d" />
          </linearGradient>
          <linearGradient id="hxsDesk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26222f" />
            <stop offset="100%" stopColor="#131119" />
          </linearGradient>
          <linearGradient id="hxsScreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1430" />
            <stop offset="100%" stopColor="#0a0c1c" />
          </linearGradient>
          <linearGradient id="hxsFigure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1726" />
            <stop offset="100%" stopColor="#0c0b14" />
          </linearGradient>
          <linearGradient id="hxsLamp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffb03a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hxsScreenGlowL" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#b600a8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b600a8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hxsScreenGlowR" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7621b0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7621b0" stopOpacity="0" />
          </radialGradient>
          <clipPath id="hxsClipL">
            <rect x="80" y="180" width="192" height="102" rx="4" />
          </clipPath>
          <clipPath id="hxsClipR">
            <rect x="320" y="206" width="152" height="74" rx="4" />
          </clipPath>
        </defs>

        {/* Room backdrop */}
        <rect x="0" y="0" width="560" height="440" fill="url(#hxsWall)" />

        {/* Far parallax layer: ambient glow, window, wall art */}
        <g className="hx-scene__far">
          <rect x="60" y="28" width="440" height="300" rx="20" fill="url(#hxsAmbient)" />

          {/* Window with cool night glow + faint city lights */}
          <g opacity="0.8">
            <rect x="392" y="40" width="118" height="150" rx="8" fill="#0b1222" stroke="rgba(118,33,176,0.25)" />
            <line x1="451" y1="40" x2="451" y2="190" stroke="rgba(118,33,176,0.18)" />
            <line x1="392" y1="115" x2="510" y2="115" stroke="rgba(118,33,176,0.18)" />
            <g className="hx-scene__city" fill="#b600a8">
              <rect x="404" y="150" width="5" height="5" rx="1" opacity="0.8" />
              <rect x="418" y="160" width="5" height="5" rx="1" opacity="0.5" />
              <rect x="462" y="146" width="5" height="5" rx="1" opacity="0.7" />
              <rect x="480" y="164" width="5" height="5" rx="1" opacity="0.45" />
              <rect x="440" y="168" width="5" height="5" rx="1" opacity="0.6" />
            </g>
          </g>

          {/* Wall art frames */}
          <rect x="58" y="54" width="72" height="54" rx="5" fill="none" stroke="rgba(255,255,255,0.08)" />
          <rect x="58" y="120" width="72" height="40" rx="5" fill="none" stroke="rgba(255,255,255,0.06)" />
        </g>

        {/* Desk */}
        <g className="hx-scene__desk">
          <path d="M44 356 L516 356 L560 408 L0 408 Z" fill="url(#hxsDesk)" />
          <path d="M44 356 L516 356 L516 360 L44 360 Z" fill="rgba(182,0,168,0.22)" />
        </g>

        {/* Monitors layer (mid parallax) */}
        <g className="hx-scene__mid">
          {/* Left monitor — live build feed */}
          <g className="hx-scene__monL">
            <ellipse cx="176" cy="250" rx="150" ry="60" fill="url(#hxsScreenGlowL)" className="hx-scene__screenglow" />
            <rect x="70" y="150" width="212" height="142" rx="10" fill="#05060c" stroke="rgba(118,33,176,0.35)" strokeWidth="1.5" />
            <rect x="78" y="158" width="196" height="126" rx="6" fill="url(#hxsScreen)" />
            {/* title bar */}
            <g>
              <circle cx="90" cy="170" r="3" fill="#ff5f57" />
              <circle cx="101" cy="170" r="3" fill="#febc2e" />
              <circle cx="112" cy="170" r="3" fill="#28c840" />
              <text x="126" y="173" className="hx-scene__winlabel">build · ros2_ws</text>
            </g>
            {/* typed feed (clipped to the screen like a real terminal) */}
            <g clipPath="url(#hxsClipL)">
              <g className="hx-scene__feed">
                {shown.map((l, i) => {
                  const isLast = i === shown.length - 1 && !!typing;
                  return (
                    <text key={i} x="88" y={193 + i * 16} className="hx-scene__code">
                      {l}
                      {isLast && <tspan className="hx-scene__caret">▋</tspan>}
                    </text>
                  );
                })}
              </g>
            </g>
            {/* stand */}
            <rect x="168" y="292" width="16" height="26" fill="#1b1922" />
            <rect x="146" y="316" width="60" height="7" rx="3" fill="#211e2a" />
          </g>

          {/* Right monitor — cycling project preview */}
          <g className="hx-scene__monR">
            <ellipse cx="398" cy="246" rx="120" ry="52" fill="url(#hxsScreenGlowR)" className="hx-scene__screenglow" />
            <rect x="312" y="168" width="168" height="120" rx="9" fill="#05060c" stroke="rgba(182,0,168,0.4)" strokeWidth="1.5" />
            <rect x="319" y="175" width="154" height="106" rx="5" fill="url(#hxsScreen)" />
            <text x="329" y="196" className="hx-scene__winlabel">~/projects</text>
            <line x1="329" y1="203" x2="463" y2="203" stroke="rgba(255,255,255,0.08)" />
            <g clipPath="url(#hxsClipR)">
              <g key={pIndex} className="hx-scene__preview">
                <text x="329" y="224" className="hx-scene__pkind">{preview.kind.toUpperCase()}</text>
                <text x="329" y="244" className="hx-scene__pname">
                  {preview.name.length > 21 ? preview.name.slice(0, 20) + "…" : preview.name}
                </text>
                {/* little activity bars */}
                <g>
                  <rect x="329" y="256" width="20" height="16" rx="2" className="hx-scene__bar" fill="#7621b0" />
                  <rect x="353" y="250" width="20" height="22" rx="2" className="hx-scene__bar" fill="#b600a8" />
                  <rect x="377" y="260" width="20" height="12" rx="2" className="hx-scene__bar" fill="#7621b0" opacity="0.7" />
                  <rect x="401" y="246" width="20" height="26" rx="2" className="hx-scene__bar" fill="#b600a8" opacity="0.85" />
                </g>
              </g>
            </g>
            {/* stand */}
            <rect x="388" y="288" width="14" height="22" fill="#1b1922" />
            <rect x="368" y="308" width="52" height="6" rx="3" fill="#211e2a" />
          </g>

          {/* Desk lamp + warm light cone */}
          <g className="hx-scene__lamp">
            <path d="M512 150 L560 120 L560 330 L516 330 Z" fill="url(#hxsLamp)" opacity="0.7" />
            <line x1="506" y1="356" x2="506" y2="214" stroke="#2a2733" strokeWidth="5" strokeLinecap="round" />
            <line x1="506" y1="214" x2="530" y2="176" stroke="#2a2733" strokeWidth="5" strokeLinecap="round" />
            <circle cx="533" cy="172" r="9" fill="#ffca7a" className="hx-scene__bulb" />
          </g>
        </g>

        {/* Seated developer (from behind) — near parallax */}
        <g className="hx-scene__figure">
          {/* chair back */}
          <rect x="214" y="300" width="132" height="120" rx="26" fill="#14121b" />
          {/* shoulders / hoodie */}
          <path
            d="M212 420 Q212 338 280 330 Q348 338 348 420 Z"
            fill="url(#hxsFigure)"
            stroke="rgba(182,0,168,0.35)"
            strokeWidth="1.5"
          />
          {/* rim light on shoulders */}
          <path d="M214 404 Q220 344 280 336 Q340 344 346 404" fill="none" stroke="rgba(118,33,176,0.25)" strokeWidth="2" />
          {/* head */}
          <circle cx="280" cy="300" r="40" fill="url(#hxsFigure)" stroke="rgba(182,0,168,0.4)" strokeWidth="1.5" />
          {/* hair sheen */}
          <path d="M250 288 Q280 262 310 288 Q300 276 280 275 Q260 276 250 288 Z" fill="rgba(118,33,176,0.12)" />
          {/* headphones */}
          <path d="M242 300 Q242 258 280 258 Q318 258 318 300" fill="none" stroke="#17151e" strokeWidth="8" strokeLinecap="round" />
          <rect x="234" y="292" width="16" height="30" rx="7" fill="#17151e" />
          <rect x="310" y="292" width="16" height="30" rx="7" fill="#17151e" />
          <rect x="237" y="298" width="9" height="18" rx="4" fill="#7621b0" opacity="0.85" />
          <rect x="314" y="298" width="9" height="18" rx="4" fill="#b600a8" opacity="0.85" />
        </g>

        {/* Desk items (front parallax) */}
        <g className="hx-scene__front">
          {/* keyboard */}
          <g transform="translate(196 372)">
            <rect x="0" y="0" width="168" height="30" rx="6" fill="#1c1a24" stroke="rgba(255,255,255,0.05)" />
            <g fill="rgba(255,255,255,0.10)">
              <rect x="8" y="6" width="14" height="8" rx="2" />
              <rect x="26" y="6" width="14" height="8" rx="2" />
              <rect x="44" y="6" width="14" height="8" rx="2" />
              <rect x="62" y="6" width="14" height="8" rx="2" />
              <rect x="80" y="6" width="14" height="8" rx="2" />
              <rect x="98" y="6" width="14" height="8" rx="2" />
              <rect x="116" y="6" width="14" height="8" rx="2" />
              <rect x="134" y="6" width="26" height="8" rx="2" />
              <rect x="30" y="18" width="108" height="7" rx="2" />
            </g>
          </g>
          {/* mouse */}
          <rect x="378" y="378" width="26" height="38" rx="13" fill="#1c1a24" stroke="rgba(255,255,255,0.05)" />

          {/* coffee mug + steam */}
          <g transform="translate(120 352)">
            <g className="hx-scene__steam" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" fill="none" strokeLinecap="round">
              <path className="hx-scene__steam1" d="M6 -6 q-6 -10 0 -20 q6 -10 0 -20" />
              <path className="hx-scene__steam2" d="M16 -6 q6 -10 0 -20 q-6 -10 0 -20" />
            </g>
            <path d="M0 0 h24 v18 a12 12 0 0 1 -24 0 Z" fill="#211e2a" />
            <path d="M24 3 q10 0 10 8 q0 8 -10 8" fill="none" stroke="#211e2a" strokeWidth="3" />
          </g>

          {/* potted plant */}
          <g transform="translate(470 336)">
            <path d="M10 20 q-14 -20 -6 -34" fill="none" stroke="#3f8f6b" strokeWidth="4" strokeLinecap="round" />
            <path d="M12 20 q2 -24 0 -38" fill="none" stroke="#4fae82" strokeWidth="4" strokeLinecap="round" />
            <path d="M14 20 q14 -18 8 -34" fill="none" stroke="#3f8f6b" strokeWidth="4" strokeLinecap="round" />
            <path d="M-2 20 h28 l-4 22 h-20 Z" fill="#2a2733" />
          </g>
        </g>

        {/* Foreground vignette */}
        <rect x="0" y="0" width="560" height="440" fill="url(#hxsVignette)" pointerEvents="none" />
        <defs>
          <radialGradient id="hxsVignette" cx="50%" cy="46%" r="70%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#060608" stopOpacity="0.55" />
          </radialGradient>
        </defs>
      </svg>

      {/* Live status chip anchored to the scene */}
      <div className="hx-scene__status">
        <span className="hx-scene__statusdot" />
        Actively building
      </div>
    </div>
  );
}
