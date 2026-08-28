"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The 3D canvas is client-only — never render it on the server.
const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
  loading: () => <BootOverlay />,
});

/**
 * Full-screen boot overlay shown while the canvas chunk downloads.
 */
function BootOverlay() {
  return (
    <div className="viceBoot" role="status" aria-live="polite">
      <div className="viceLoader__ring" />
      <p className="viceLoader__title">BOOTING MAHARSHI.OS</p>
      <p className="viceBoot__sub">streaming Vice City…</p>
    </div>
  );
}

/**
 * A non-blocking hint for small portrait screens — the 3D world is best in
 * landscape. Dismissible so it never traps the visitor.
 */
function RotateHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const small = Math.min(window.innerWidth, window.innerHeight) < 560;
      setShow(portrait && small);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="viceRotate" role="dialog" aria-live="polite">
      <div className="viceRotate__card">
        <p className="viceRotate__emoji" aria-hidden="true">
          ⟳
        </p>
        <h3>Best viewed in landscape</h3>
        <p className="viceRotate__body">Rotate your phone for the full Vice City experience.</p>
        <button type="button" className="viceRotate__btn" onClick={() => setShow(false)}>
          Explore anyway
        </button>
      </div>
    </div>
  );
}

/**
 * Client entry for the interactive 3D portfolio.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 */
export function Experience() {
  return (
    <div className="viceStage">
      <ExperienceCanvas />
      <RotateHint />
      {/* Corner brand + hint, matching the minimal in-world chrome */}
      <div className="viceBrand" aria-hidden="true">
        MAHARSHI<span>.OS</span>
      </div>
      <p className="viceTip" aria-hidden="true">
        drag to look · click the nav to travel
      </p>
    </div>
  );
}

export default Experience;
