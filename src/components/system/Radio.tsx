"use client";

import { useEffect, useRef } from "react";
import { Power, SkipForward } from "lucide-react";
import { stations } from "@/data/resume";
import { useOS } from "./Providers";
import { useSynthwave } from "@/hooks/useSynthwave";
import { sfx } from "@/hooks/useSfx";

const BAR_COUNT = 14;

/**
 * The car-stereo radio widget. Hosts the single in-browser synthwave engine
 * and keeps the UI-sound engine in sync with the power state (sound is off by
 * default — this is the master switch). The phone's "Radio" app just calls the
 * same context actions, so there's only ever one audio engine.
 */
export function Radio() {
  const { radioOn, toggleRadio, station, cycleStation } = useOS();
  const current = stations[station];
  const bars = useSynthwave(radioOn, current.bpm);
  const barsWrapRef = useRef<HTMLDivElement>(null);

  // UI blips follow the radio power state.
  useEffect(() => {
    sfx.setEnabled(radioOn);
  }, [radioOn]);

  // Drive the equaliser bars from the analyser while playing.
  useEffect(() => {
    if (!radioOn) return;
    let raf = 0;
    const tick = () => {
      const levels = bars.current(BAR_COUNT);
      const wrap = barsWrapRef.current;
      if (wrap) {
        const children = wrap.children;
        for (let i = 0; i < children.length; i++) {
          const h = 12 + (levels[i] ?? 0) * 88;
          (children[i] as HTMLElement).style.height = `${h}%`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radioOn, bars]);

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-line bg-night/80 p-2 backdrop-blur-md shadow-neon">
      <button
        onClick={() => {
          toggleRadio();
          sfx.play("toggle");
        }}
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors ${
          radioOn
            ? "border-pink bg-pink/15 text-pink"
            : "border-line text-muted hover:text-fg"
        }`}
        aria-label={radioOn ? "Turn radio off" : "Turn radio on"}
        aria-pressed={radioOn}
        title={radioOn ? "Radio: on" : "Radio: off (click to play synthwave)"}
      >
        <Power size={15} />
      </button>

      <div className="hidden min-w-[128px] flex-col justify-center xl:flex">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-xs tracking-wider text-fg">{current.name}</span>
          <span className="font-mono text-[10px] text-cyan">{current.dial}</span>
        </div>
        {/* Equaliser */}
        <div
          ref={barsWrapRef}
          className="mt-1 flex h-4 items-end gap-[2px]"
          aria-hidden="true"
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span
              key={i}
              className={`w-full rounded-sm ${radioOn ? "" : "animate-pulse-led"}`}
              style={{
                height: radioOn ? "12%" : `${20 + ((i * 37) % 60)}%`,
                background:
                  i % 2 ? "var(--cyan)" : "var(--pink)",
                opacity: radioOn ? 1 : 0.35,
                transition: "height 80ms linear",
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          cycleStation();
          sfx.play("click");
        }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line text-muted transition-colors hover:text-cyan"
        aria-label="Next station"
        title={`Next station (now: ${current.genre})`}
      >
        <SkipForward size={15} />
      </button>
    </div>
  );
}
