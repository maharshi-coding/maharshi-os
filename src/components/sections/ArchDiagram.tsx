"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/resume";

/**
 * ArchDiagram — a self-drawing architecture diagram generated from a
 * project's node/edge list. Nodes are layered by dependency depth;
 * edges animate their stroke as the diagram scrolls into view.
 */

const BOX_W = 168;
const BOX_H = 36;
const COL_GAP = 64;
const ROW_GAP = 22;

export function ArchDiagram({ project }: { project: Project }) {
  const layout = useMemo(() => {
    const { nodes, architecture } = project;

    // Depth = longest path from any root (node with no incoming edge).
    const depth = new Map<string, number>(nodes.map((n) => [n, 0]));
    for (let pass = 0; pass < nodes.length; pass++) {
      for (const e of architecture) {
        const d = (depth.get(e.from) ?? 0) + 1;
        if (d > (depth.get(e.to) ?? 0) && d < nodes.length) depth.set(e.to, d);
      }
    }

    // Group nodes into columns by depth.
    const columns = new Map<number, string[]>();
    for (const n of nodes) {
      const d = depth.get(n) ?? 0;
      columns.set(d, [...(columns.get(d) ?? []), n]);
    }
    const maxDepth = Math.max(...columns.keys());
    const maxRows = Math.max(...[...columns.values()].map((c) => c.length));

    const width = (maxDepth + 1) * BOX_W + maxDepth * COL_GAP + 4;
    const height = maxRows * BOX_H + (maxRows - 1) * ROW_GAP + 4;

    // Position each node, centering shorter columns vertically.
    const pos = new Map<string, { x: number; y: number }>();
    for (const [d, col] of columns) {
      const colHeight = col.length * BOX_H + (col.length - 1) * ROW_GAP;
      const offsetY = (height - colHeight) / 2;
      col.forEach((n, i) => {
        pos.set(n, {
          x: d * (BOX_W + COL_GAP) + 2,
          y: offsetY + i * (BOX_H + ROW_GAP),
        });
      });
    }

    // Edge paths (right edge of source → left edge of target).
    const paths = architecture.map((e) => {
      const a = pos.get(e.from)!;
      const b = pos.get(e.to)!;
      const x1 = a.x + BOX_W;
      const y1 = a.y + BOX_H / 2;
      const x2 = b.x;
      const y2 = b.y + BOX_H / 2;
      const mid = (x1 + x2) / 2;
      return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
    });

    return { pos, paths, width, height };
  }, [project]);

  return (
    <figure aria-label={`${project.name} architecture diagram`} className="w-full">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="h-auto w-full"
        role="img"
      >
        {/* Edges */}
        {layout.paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            strokeOpacity={0.55}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: "easeInOut" }}
          />
        ))}
        {/* Nodes */}
        {[...layout.pos.entries()].map(([name, p], i) => (
          <motion.g
            key={name}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <rect
              x={p.x}
              y={p.y}
              width={BOX_W}
              height={BOX_H}
              rx={7}
              fill="var(--panel-strong)"
              stroke="var(--line)"
            />
            <circle cx={p.x + 13} cy={p.y + BOX_H / 2} r={2.5} fill="var(--cyan)" />
            <text
              x={p.x + 24}
              y={p.y + BOX_H / 2 + 3.5}
              fill="var(--fg)"
              fontSize={10.5}
              fontFamily="var(--font-mono), monospace"
            >
              {name.length > 24 ? name.slice(0, 23) + "…" : name}
            </text>
          </motion.g>
        ))}
      </svg>
      <figcaption className="sr-only">
        Data flow: {project.architecture.map((e) => `${e.from} to ${e.to}`).join("; ")}
      </figcaption>
    </figure>
  );
}
