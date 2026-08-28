import { Html, useProgress } from "@react-three/drei";

/**
 * In-canvas loading screen shown (via Suspense) while the 3D assets stream in.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio, reskinned neon.
 */
export default function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="viceLoader">
        <div className="viceLoader__ring" />
        <p className="viceLoader__title">ENTERING VICE CITY</p>
        <p className="viceLoader__pct">{Math.floor(progress)}%</p>
      </div>
    </Html>
  );
}
