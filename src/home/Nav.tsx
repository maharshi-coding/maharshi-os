"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { navItems, resumeHref } from "./content";
import { scrollToId } from "./SmoothScroll";

/**
 * Minimal floating nav — transparent over the hero, condensing into a compact
 * glass bar after scroll. Active section is tracked with IntersectionObserver.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="hx-nav" data-scrolled={scrolled}>
      <button
        type="button"
        className="hx-nav__brand"
        onClick={() => scrollToId("top")}
        aria-label="Back to top"
      >
        MAHARSHI<b> BAROT</b>
      </button>

      <div className="hx-nav__links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="hx-nav__link"
            data-active={active === item.id}
            onClick={() => scrollToId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <a className="hx-nav__cta" href={resumeHref} target="_blank" rel="noopener noreferrer">
        Résumé
        <ArrowUpRight size={14} strokeWidth={2} />
      </a>
    </nav>
  );
}
