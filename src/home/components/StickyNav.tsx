"use client";

import { useEffect, useState } from "react";
import { scrollToId } from "../scroll";

const NAV = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Open Source", id: "opensource" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

/**
 * Persistent navigation. The hero has its own inline nav (Jack-style); this bar
 * slides in once you've scrolled past the hero so navigation stays available
 * through the whole (long) page. Tracks the active section with an observer.
 */
export default function StickyNav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="jk-stickynav" data-show={show} aria-hidden={!show}>
      <button
        type="button"
        className="jk-stickynav__brand"
        onClick={() => scrollToId("top")}
        tabIndex={show ? 0 : -1}
      >
        Maharshi Barot
      </button>
      <nav className="jk-stickynav__links">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            className="jk-stickynav__link"
            data-active={active === n.id}
            onClick={() => scrollToId(n.id)}
            tabIndex={show ? 0 : -1}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
