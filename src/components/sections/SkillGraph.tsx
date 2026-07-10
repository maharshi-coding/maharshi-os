"use client";

import { useEffect, useRef, useState } from "react";
import { skillCategories, skillEdges, projects } from "@/data/resume";
import { useOS } from "@/components/system/Providers";

/**
 * SkillGraph — a force-directed neural graph of the entire stack.
 * Languages link to frameworks, frameworks to projects, projects to
 * infrastructure. Hover (or tap) a node to light up its connections.
 *
 * Hand-rolled physics on a 2D canvas — no chart library, 60fps.
 */

interface Node {
  id: string;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  degree: number;
}

const GROUP_OF: Record<string, string> = {};
skillCategories.forEach((c) => c.skills.forEach((s) => (GROUP_OF[s] = c.id)));
projects.forEach((p) => (GROUP_OF[p.name] = "project"));

// Neon colour per skill category — the "weapon wheel" palette.
// Purple is lightened (#a56bff) so it stays legible as text/labels (the raw
// --purple #7b2ff7 is only 3.4:1 on the night background).
const GROUP_COLOR: Record<string, string> = {
  ai: "#ff2e97",
  lang: "#05d9e8",
  frontend: "#a56bff",
  backend: "#ffb03a",
  db: "#39ff88",
  cloud: "#ff6b3d",
  project: "#ffffff",
  misc: "#9a8fb0",
};

export function SkillGraph() {
  const { reducedMotion } = useOS();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hovered;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Build graph ─────────────────────────────────────────────
    const ids = new Set<string>();
    skillEdges.forEach(([a, b]) => {
      ids.add(a);
      ids.add(b);
    });
    // Include unlinked skills too — they float free.
    skillCategories.forEach((c) => c.skills.forEach((s) => ids.add(s)));

    const degree = new Map<string, number>();
    skillEdges.forEach(([a, b]) => {
      degree.set(a, (degree.get(a) ?? 0) + 1);
      degree.set(b, (degree.get(b) ?? 0) + 1);
    });

    let W = wrap.clientWidth;
    let H = Math.max(460, Math.min(640, W * 0.62));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: Node[] = [...ids].map((id, i) => {
      const deg = degree.get(id) ?? 0;
      const angle = (i / ids.size) * Math.PI * 2;
      const rad = Math.min(W, H) * 0.32 * (0.6 + ((i * 37) % 40) / 100);
      return {
        id,
        group: GROUP_OF[id] ?? "misc",
        x: W / 2 + Math.cos(angle) * rad,
        y: H / 2 + Math.sin(angle) * rad,
        vx: 0,
        vy: 0,
        r: id.length, // temp; set below
        degree: deg,
      };
    });
    nodes.forEach((n) => (n.r = 3 + Math.min(6, n.degree * 1.15)));

    const byId = new Map(nodes.map((n) => [n.id, n]));
    const links = skillEdges
      .filter(([a, b]) => byId.has(a) && byId.has(b))
      .map(([a, b]) => ({ a: byId.get(a)!, b: byId.get(b)! }));

    const neighbors = new Map<string, Set<string>>();
    links.forEach(({ a, b }) => {
      if (!neighbors.has(a.id)) neighbors.set(a.id, new Set());
      if (!neighbors.has(b.id)) neighbors.set(b.id, new Set());
      neighbors.get(a.id)!.add(b.id);
      neighbors.get(b.id)!.add(a.id);
    });

    const resize = () => {
      W = wrap.clientWidth;
      H = Math.max(460, Math.min(640, W * 0.62));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ── Interaction ─────────────────────────────────────────────
    let redraw: (() => void) | null = null; // set once render() exists
    const pointer = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      let found: string | null = null;
      for (const n of nodes) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        if (dx * dx + dy * dy < (n.r + 14) * (n.r + 14)) {
          found = n.id;
          break;
        }
      }
      setHovered(found);
      hoveredRef.current = found;
      if (reducedMotion) redraw?.();
      canvas.style.touchAction = "pan-y";
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      setHovered(null);
      hoveredRef.current = null;
      if (reducedMotion) redraw?.();
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    // ── Simulation + render ─────────────────────────────────────
    const accent = "#05d9e8"; // lit links + labels
    const dim = "rgba(154,143,176,";
    const fg = "#fdf0ff";
    const colorOf = (group: string) => GROUP_COLOR[group] ?? GROUP_COLOR.misc;

    let raf = 0;
    let alpha = 1; // simulation heat — cools over time

    const physicsStep = () => {
      if (alpha <= 0.02) return;
      alpha *= 0.995;
      // Repulsion (O(n²) is fine at ~45 nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) d2 = 1;
          if (d2 < 26000) {
            const f = (900 * alpha) / d2;
            const d = Math.sqrt(d2);
            dx /= d;
            dy /= d;
            a.vx += dx * f;
            a.vy += dy * f;
            b.vx -= dx * f;
            b.vy -= dy * f;
          }
        }
      }
      // Springs
      for (const { a, b } of links) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const f = ((d - 92) / d) * 0.018 * alpha * 10;
        a.vx += dx * f;
        a.vy += dy * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
      }
      // Centering + integrate
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.0016 * alpha * 8;
        n.vy += (H / 2 - n.y) * 0.0024 * alpha * 8;
        n.vx *= 0.86;
        n.vy *= 0.86;
        n.x += n.vx;
        n.y += n.vy;
        const pad = 26;
        if (n.x < pad) n.x = pad;
        if (n.x > W - pad) n.x = W - pad;
        if (n.y < pad) n.y = pad;
        if (n.y > H - pad) n.y = H - pad;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      const hov = hoveredRef.current;
      const hovSet = hov ? (neighbors.get(hov) ?? new Set()) : null;

      for (const { a, b } of links) {
        const lit = hov && (a.id === hov || b.id === hov);
        ctx.strokeStyle = lit ? accent : `${dim}${hov ? 0.06 : 0.16})`;
        ctx.lineWidth = lit ? 1.4 : 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const n of nodes) {
        const isHov = n.id === hov;
        const isNeighbor = hovSet?.has(n.id) ?? false;
        const faded = hov && !isHov && !isNeighbor;
        const isProject = n.group === "project";

        const nodeColor = colorOf(n.group);
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHov ? n.r + 2 : n.r, 0, Math.PI * 2);
        if (isProject) {
          ctx.fillStyle = faded ? `${dim}0.25)` : "#ffffff";
          ctx.globalAlpha = faded ? 0.4 : 1;
          ctx.shadowBlur = faded ? 0 : 12;
          ctx.shadowColor = "#ff2e97";
          ctx.fill();
        } else {
          ctx.fillStyle = faded ? `${dim}0.2)` : nodeColor;
          ctx.globalAlpha = faded ? 1 : isHov || isNeighbor ? 1 : 0.85;
          ctx.shadowBlur = faded ? 0 : isHov || isNeighbor ? 14 : 6;
          ctx.shadowColor = nodeColor;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (isHov || isNeighbor || isProject || n.degree >= 3) {
          ctx.font = `${isHov ? 12 : 10.5}px var(--font-mono), monospace`;
          ctx.fillStyle = faded ? `${dim}0.3)` : isHov ? accent : fg;
          ctx.textAlign = "center";
          ctx.fillText(n.id, n.x, n.y - n.r - 7);
        }
      }
    };

    redraw = render;

    const tick = () => {
      physicsStep();
      render();
      raf = requestAnimationFrame(tick);
    };

    if (reducedMotion) {
      // Settle the layout invisibly, then draw a single static frame.
      for (let i = 0; i < 400; i++) physicsStep();
      render();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive graph of skills: languages connect to frameworks, frameworks connect to projects, projects connect to tools."
        className="w-full rounded-xl border border-line bg-panel"
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
      >
        {hovered ?? "hover a node to trace its connections"}
      </p>
    </div>
  );
}
