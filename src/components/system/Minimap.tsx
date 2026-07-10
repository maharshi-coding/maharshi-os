"use client";

import { districts } from "@/data/resume";
import { useOS } from "./Providers";
import { sfx } from "@/hooks/useSfx";

const COLOR: Record<string, string> = {
  pink: "var(--pink)",
  cyan: "var(--cyan)",
  gold: "var(--gold)",
  purple: "var(--purple)",
};

/**
 * GTA-style minimap: a neon rounded map with a blip per district. The current
 * district glows and the player marker tracks it; clicking any blip fast-
 * travels there. Visited state is driven by the HUD's scroll observer.
 */
export function Minimap() {
  const { district, visited, reducedMotion } = useOS();
  const active = districts.find((d) => d.id === district) ?? districts[0];

  const travel = (id: string) => {
    sfx.play("select");
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="pointer-events-auto relative">
      <div
        className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-line bg-night/85 backdrop-blur-md shadow-neon"
        role="group"
        aria-label="City minimap — fast travel"
      >
        {/* Street grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        {/* Diagonal "highway" */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 46%, rgba(5,217,232,0.35) 48%, rgba(5,217,232,0.35) 50%, transparent 52%)",
          }}
          aria-hidden="true"
        />
        {/* Radar sweep */}
        {!reducedMotion && (
          <div
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,46,151,0.18) 40deg, transparent 60deg)",
              animation: "radar-spin 4s linear infinite",
            }}
            aria-hidden="true"
          />
        )}

        {/* Blips */}
        {districts.map((d) => {
          const isActive = d.id === active.id;
          const seen = visited.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => travel(d.id)}
              onMouseEnter={() => sfx.play("hover")}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              aria-label={`Fast travel to ${d.blip}`}
              title={d.blip}
            >
              <span
                className="block rounded-full transition-transform group-hover:scale-150"
                style={{
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  background: seen ? COLOR[d.color] : "transparent",
                  border: `2px solid ${COLOR[d.color]}`,
                  boxShadow: isActive ? `0 0 12px ${COLOR[d.color]}` : "none",
                }}
              />
              {isActive && !reducedMotion && (
                <span
                  className="absolute inset-0 -z-10 animate-ping rounded-full"
                  style={{ background: COLOR[d.color], opacity: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {active.blip}
      </div>
    </div>
  );
}
