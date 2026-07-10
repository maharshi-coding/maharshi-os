"use client";

import { useEffect, type ReactNode } from "react";
import { useOS } from "./Providers";
import { LoadingScreen } from "./LoadingScreen";
import { HUD } from "./HUD";
import { CustomCursor } from "./CustomCursor";
import { CommandPalette } from "./CommandPalette";
import { Phone } from "./Phone";
import { CheatFX } from "./CheatFX";
import { ShutdownFX } from "./ShutdownFX";
import { ScrollProgress } from "./ScrollProgress";
import { SmoothScroll } from "./SmoothScroll";
import { useCheats } from "@/hooks/useCheats";

/**
 * The chrome of PROJECT VICE: loading screen, game HUD, reticle cursor,
 * quick-travel console, phone, cheats and ambient effects wrap every page.
 */
export function OSShell({ children }: { children: ReactNode }) {
  const { loaded, setPaletteOpen, reducedMotion } = useOS();

  // Cheat-code listener (Konami + typed codes).
  useCheats();

  // ⌘K / Ctrl+K opens quick travel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  // Pointer-following ambient glow.
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--glow-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--glow-y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  return (
    <SmoothScroll>
      <div className="ambient-glow" aria-hidden="true" />
      {!loaded && <LoadingScreen />}
      <ScrollProgress />
      <HUD />
      <CustomCursor />
      <CommandPalette />
      <Phone />
      <CheatFX />
      <ShutdownFX />
      <div
        id="os-root"
        className={loaded ? "opacity-100 transition-opacity duration-700" : "opacity-0"}
      >
        {children}
      </div>
    </SmoothScroll>
  );
}
