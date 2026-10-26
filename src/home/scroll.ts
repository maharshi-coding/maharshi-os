/**
 * Native, reliable in-page scrolling used by the nav, hero CTAs and footer.
 *
 * We deliberately use the browser's own scrolling (no smooth-scroll library) so
 * the wheel, trackpad, keyboard and touch all behave exactly as the user's OS
 * expects, on every machine. Smoothness comes from the native `smooth`
 * behaviour, which is automatically skipped when the visitor prefers reduced
 * motion. Sections carry `scroll-margin-top` so the fixed nav never overlaps a
 * heading after a jump.
 */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Scroll back to the very top of the page. */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
