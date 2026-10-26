"use client";

import { scrollToId } from "../scroll";

/**
 * Primary CTA — a gradient pill (magenta → purple → amber) with an inset glow
 * and an offset white outline. Scrolls to the contact section.
 */
export default function ContactButton({
  className = "",
  label = "Contact Me",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToId("contact")}
      className={
        "contact-btn rounded-full font-medium uppercase tracking-widest text-white " +
        "px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base " +
        className
      }
    >
      {label}
    </button>
  );
}
