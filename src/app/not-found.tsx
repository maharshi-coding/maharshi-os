import Link from "next/link";

/** Custom 404 — GTA "WASTED" screen. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "var(--sunset)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-night/70" aria-hidden="true" />
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-cyan">
          route not found
        </p>
        <h1 className="mt-4 font-display text-7xl text-fg neon sm:text-9xl">WASTED</h1>
        <p className="mx-auto mt-6 max-w-md font-mono text-sm leading-6 text-muted">
          You wandered off the map. This street doesn&apos;t exist in Vice City —
          respawn back downtown and keep exploring.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-pink px-7 py-3 font-display text-sm tracking-widest text-[#0a0512] shadow-neon transition-transform hover:scale-[1.04]"
        >
          RESPAWN → DOWNTOWN
        </Link>
      </div>
    </main>
  );
}
