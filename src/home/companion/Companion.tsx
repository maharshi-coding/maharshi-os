"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// @remotion/player is browser-only — never render it on the server.
const CompanionPlayer = dynamic(() => import("./CompanionPlayer"), { ssr: false });

const DISMISS_KEY = "hx-companion-dismissed";

/**
 * A small floating, dismissible avatar companion (bottom-right). Desktop-only,
 * eases in after the page settles, and stays dismissed via localStorage.
 */
export default function Companion() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    if (dismissed || !desktop) return;
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="hx-companion" role="complementary" aria-label="Maharshi avatar">
      <p className="hx-companion__bubble" aria-hidden="true">
        Hey — I&apos;m Maharshi. Thanks for scrolling by! <span>👋</span>
      </p>
      <div className="hx-companion__avatar">
        <CompanionPlayer />
        <button
          type="button"
          className="hx-companion__close"
          onClick={dismiss}
          aria-label="Dismiss avatar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
