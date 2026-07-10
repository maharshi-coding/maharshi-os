"use client";

import { useEffect, useState } from "react";
import { Skull } from "lucide-react";
import { districts, person } from "@/data/resume";

/**
 * Footer — end credits. Time in the city, quick nav, and a "respawn" button
 * that triggers the WASTED sequence.
 */
export function Footer() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(uptime / 3600)).padStart(2, "0");
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Credits readout */}
          <div className="font-mono text-xs leading-6 text-muted">
            <p className="mb-1 flex items-center gap-2 font-display tracking-wider text-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-pink animate-pulse-led" aria-hidden="true" />
              PROJECT VICE // MAHARSHI.EXE
            </p>
            <p>
              time in the city <span className="tabular-nums text-cyan">{hh}:{mm}:{ss}</span>
            </p>
            <p>
              built by {person.name} · hand-coded with Next.js, Three.js &amp; GSAP
            </p>
            <p>© {new Date().getFullYear()} — no page template was harmed in the making</p>
          </div>

          {/* Quick nav */}
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 font-mono text-xs">
              {districts
                .filter((d) => d.id !== "home")
                .map((d) => (
                  <li key={d.id}>
                    <a
                      href={`#${d.id}`}
                      className="text-muted transition-colors hover:text-pink"
                    >
                      → {d.blip.toLowerCase()}
                    </a>
                  </li>
                ))}
              <li>
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-cyan"
                >
                  → github ↗
                </a>
              </li>
            </ul>
          </nav>

          {/* Respawn */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("vice:wasted"))}
            className="group flex items-center gap-2 self-start rounded-full border border-line px-4 py-2.5 font-display text-xs tracking-widest text-muted transition-colors hover:border-[#c0392b] hover:text-[#c0392b]"
            aria-label="Respawn the city (easter egg)"
          >
            <Skull size={13} aria-hidden="true" />
            RESPAWN
          </button>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          press <kbd className="rounded border border-line px-1.5 py-0.5">⌘K</kbd> for quick travel ·
          open the <span className="text-pink">phone</span> · try{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5">↑↑↓↓←→←→BA</kbd>
        </p>
      </div>
    </footer>
  );
}
