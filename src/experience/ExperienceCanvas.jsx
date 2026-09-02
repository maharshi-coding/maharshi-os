"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import Scene from "./Scene.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

/**
 * The single full-screen R3F canvas that hosts the whole experience.
 * Adaptive DPR keeps the frame-rate smooth (and dragging responsive) on
 * weaker GPUs by lowering resolution when FPS drops.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 */
export default function ExperienceCanvas() {
  const [dpr, setDpr] = useState(1.5);

  // R3F sizes the canvas from a ResizeObserver on its container. Under React 19
  // + Suspense (the canvas mounts from a dynamic import), that first measurement
  // can be missed, leaving the <canvas> stuck at its default 300x150 — i.e. the
  // world renders but is invisibly tiny. Nudge R3F to re-measure once mounted.
  // Belt-and-suspenders: rAF covers the common (visible) case, timers cover a
  // throttled/background first paint, and `load` covers a late layout.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const raf1 = requestAnimationFrame(nudge);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(nudge));
    const timers = [0, 200, 800].map((ms) => setTimeout(nudge, ms));
    window.addEventListener("load", nudge);
    // If the page first mounts in a background tab, R3F skips measuring while
    // hidden — re-measure the moment it becomes visible.
    const onVisible = () => {
      if (!document.hidden) nudge();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", nudge);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <Canvas
      className="r3f"
      dpr={dpr}
      camera={{ fov: 45, near: 0.1, far: 20, position: [-3, 1.5, 6] }}
    >
      <PerformanceMonitor
        onChange={({ factor }) => setDpr(Math.round((1 + factor) * 10) / 10)}
        onFallback={() => setDpr(1)}
        flipflops={3}
      >
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
