"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./Scene.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

/**
 * The single full-screen R3F canvas that hosts the whole experience.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 */
export default function ExperienceCanvas() {
  return (
    <Canvas
      className="r3f"
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 20, position: [-3, 1.5, 6] }}
    >
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
