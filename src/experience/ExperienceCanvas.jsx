"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Suspense, useState } from "react";
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
