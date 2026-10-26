import { ArrowUpRight } from "lucide-react";

/**
 * Ghost / outline pill button used on project cards. Renders as a link.
 */
export default function LiveProjectButton({
  href,
  label = "Live Project",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "live-btn inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] " +
        "text-[#D7E2EA] font-medium uppercase tracking-widest " +
        "px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm " +
        className
      }
    >
      {label}
      <ArrowUpRight size={16} strokeWidth={2} />
    </a>
  );
}
