"use client";

import { useEffect, useState } from "react";
import { useOS } from "./Providers";

/**
 * The "WASTED" easter egg: the screen desaturates and slows, the GTA death
 * banner slams in, then the city reboots. Fired via the `vice:wasted` event
 * (from the quick-travel console).
 */
export function ShutdownFX() {
  const { reboot } = useOS();
  const [stage, setStage] = useState<"idle" | "wasted">("idle");

  useEffect(() => {
    const onWasted = () => {
      setStage("wasted");
      setTimeout(() => {
        setStage("idle");
        reboot();
      }, 2600);
    };
    window.addEventListener("vice:wasted", onWasted);
    return () => window.removeEventListener("vice:wasted", onWasted);
  }, [reboot]);

  if (stage === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[88] flex items-center justify-center bg-black/80 backdrop-grayscale"
      role="status"
      aria-label="Wasted"
    >
      <div className="absolute inset-0 wasted bg-black/40" aria-hidden="true" />
      <div className="relative text-center">
        <p className="font-display text-6xl italic tracking-wide text-[#ff4757] sm:text-8xl" style={{ textShadow: "0 0 18px rgba(255,71,87,0.7)" }}>
          WASTED
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-muted">
          respawning the city…
        </p>
      </div>
    </div>
  );
}
