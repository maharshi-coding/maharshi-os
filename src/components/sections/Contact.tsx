"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Github, Mail, PhoneCall } from "lucide-react";
import { person } from "@/data/resume";
import { SectionShell } from "@/components/ui/SectionShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useOS } from "@/components/system/Providers";
import { sfx } from "@/hooks/useSfx";

type Phase = "idle" | "live" | "done";

/** The three questions the payphone asks, in order. */
const STEPS = [
  { key: "name", label: "Name", prompt: "Who's calling?", placeholder: "Your name" },
  { key: "email", label: "Email", prompt: "Where can I reach you back?", placeholder: "you@example.com" },
  {
    key: "message",
    label: "Message",
    prompt: "What's the message?",
    placeholder: "Say hi, pitch a role, or ask me anything…",
  },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact — "The Payphone". Not a form: a guided, three-question call.
 *
 * The section rests *on the hook* — it shows only the payphone's top bar until
 * the visitor chooses to pick up. It never auto-focuses on mount (a focused
 * input would yank the page down into this section on load), and once the call
 * is live it focuses with `preventScroll` so the viewport never jumps. When the
 * last answer is sent, the visitor's own mail client takes the call — no backend.
 */
export function Contact() {
  const { reducedMotion } = useOS();
  const [phase, setPhase] = useState<Phase>("idle");
  const [i, setI] = useState(0);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const active = STEPS[i];

  // Focus the current field without ever stealing scroll — preventScroll stops
  // the browser yanking the page down (the reason this section used to "open"
  // itself on load). Called on each step change and once the call connects.
  const focusActive = () => {
    const el = active.key === "message" ? areaRef.current : inputRef.current;
    el?.focus({ preventScroll: true });
  };

  // Re-focus when advancing between steps (the live panel is already mounted, so
  // the ref is available here). The very first focus, on pick-up, is handled by
  // the panel's onAnimationComplete — mode="wait" delays its mount past this.
  useEffect(() => {
    if (phase === "live") focusActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // A live call timer, purely for flavour, ticks while the line is open.
  useEffect(() => {
    if (phase !== "live") {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const pickUp = () => {
    sfx.play("select");
    setError(null);
    setI(0);
    setPhase("live");
  };

  const submitStep = () => {
    const v = input.trim();
    setError(null);

    if (active.key === "name") {
      if (v.length < 2) return fail("Need at least 2 characters.");
      setValues((s) => ({ ...s, name: v }));
      setInput("");
      setI(1);
    } else if (active.key === "email") {
      if (!EMAIL_RE.test(v)) return fail("That doesn't look like an email address.");
      setValues((s) => ({ ...s, email: v }));
      setInput("");
      setI(2);
    } else {
      if (v.length < 4) return fail("A little more than that — say something.");
      const message = v;
      setValues((s) => ({ ...s, message }));
      setPhase("done");
      sfx.play("success");
      // Compose the mail in the visitor's own client.
      const subject = encodeURIComponent(`Payphone call from ${values.name} — via PROJECT VICE`);
      const body = encodeURIComponent(`${message}\n\n— ${values.name} (${values.email})`);
      window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
    }
  };

  const fail = (msg: string) => {
    sfx.play("error");
    setError(msg);
  };

  const goBack = () => {
    setError(null);
    if (i === 0) {
      setPhase("idle");
      return;
    }
    const prev = STEPS[i - 1];
    setInput(values[prev.key]);
    setI(i - 1);
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setInput("");
    setI(0);
    setError(null);
    setPhase("idle");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !(active.key === "message" && e.shiftKey)) {
      e.preventDefault();
      submitStep();
    }
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(person.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const status =
    phase === "idle"
      ? { dot: "bg-muted", text: "on the hook", cls: "text-muted" }
      : phase === "live"
        ? { dot: "bg-cyan animate-pulse-led", text: `connected · ${mmss}`, cls: "text-cyan" }
        : { dot: "bg-neon", text: "call ended", cls: "text-neon" };

  return (
    <SectionShell
      id="contact"
      module="comms"
      title="The Payphone"
      intro="No boring contact form — pick up the payphone instead. Three quick questions and your mail client takes the call."
    >
      <div className="grid gap-10 lg:grid-cols-5">
        {/* ── The payphone ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-line bg-panel backdrop-blur-sm lg:col-span-3"
        >
          {/* Top bar — always visible; the section rests here until pick-up */}
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="font-mono text-xs text-muted">payphone · vice city</span>
            <span
              className={`ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest tabular-nums ${status.cls}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
              {status.text}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Idle: on the hook. Just the top bar + an invitation ── */}
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex min-h-[360px] flex-col items-center justify-center gap-6 p-8 text-center sm:p-10"
              >
                <div className="relative grid h-16 w-16 place-items-center">
                  {!reducedMotion &&
                    [0, 0.6].map((delay) => (
                      <motion.span
                        key={delay}
                        className="absolute inset-0 rounded-full border border-pink/40"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.9, opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
                        aria-hidden="true"
                      />
                    ))}
                  <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-pink/40 bg-pink/10 text-pink shadow-neon">
                    <PhoneCall size={26} aria-hidden="true" />
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-fg sm:text-3xl">The line is open</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    No forms, no spam. Pick up the payphone — three quick questions, then it hands the
                    call straight to your own email app.
                  </p>
                </div>

                <button
                  onClick={pickUp}
                  onMouseEnter={() => sfx.play("hover")}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-pink px-7 py-3 font-mono text-sm font-semibold text-night shadow-neon transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <PhoneCall size={16} aria-hidden="true" className="transition-transform group-hover:rotate-12" />
                  Pick up the payphone
                </button>

                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                  3 questions · about 20 seconds
                </p>
              </motion.div>
            )}

            {/* ── Live: the guided call ──────────────────────────────── */}
            {phase === "live" && (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onAnimationComplete={() => phase === "live" && focusActive()}
                className="min-h-[360px] p-6 sm:p-8"
              >
                {/* Step progress */}
                <ol className="flex items-center gap-2 sm:gap-3">
                  {STEPS.map((s, idx) => {
                    const state = idx < i ? "done" : idx === i ? "current" : "todo";
                    return (
                      <li key={s.key} className="flex items-center gap-2 sm:gap-3">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-xs transition-colors ${
                            state === "done"
                              ? "border-neon/40 bg-neon/15 text-neon"
                              : state === "current"
                                ? "border-pink bg-pink text-night"
                                : "border-line text-muted"
                          }`}
                        >
                          {state === "done" ? <Check size={13} aria-hidden="true" /> : idx + 1}
                        </span>
                        <span
                          className={`hidden font-mono text-[11px] uppercase tracking-widest sm:inline ${
                            state === "todo" ? "text-muted" : "text-fg"
                          }`}
                        >
                          {s.label}
                        </span>
                        {idx < STEPS.length - 1 && (
                          <span className="h-px w-5 bg-line sm:w-8" aria-hidden="true" />
                        )}
                      </li>
                    );
                  })}
                </ol>

                {/* Answers captured so far */}
                {i > 0 && (
                  <dl className="mt-6 space-y-1.5 font-mono text-sm">
                    <Answer label="name" value={values.name} />
                    {i > 1 && <Answer label="email" value={values.email} />}
                  </dl>
                )}

                {/* Current question */}
                <div className="mt-6">
                  <label htmlFor="payphone-input" className="block font-mono text-sm text-cyan">
                    {active.prompt}
                  </label>
                  {active.key === "message" ? (
                    <textarea
                      ref={areaRef}
                      id="payphone-input"
                      rows={4}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKey}
                      className="mt-2 w-full resize-none rounded-lg border border-line bg-night/50 px-4 py-3 text-base text-fg outline-none transition-colors focus:border-cyan"
                      placeholder={active.placeholder}
                      aria-describedby={error ? "payphone-error" : undefined}
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      id="payphone-input"
                      type={active.key === "email" ? "email" : "text"}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKey}
                      className="mt-2 w-full rounded-lg border border-line bg-night/50 px-4 py-3 text-base text-fg outline-none transition-colors focus:border-cyan"
                      placeholder={active.placeholder}
                      aria-describedby={error ? "payphone-error" : undefined}
                      autoComplete={active.key === "email" ? "email" : "name"}
                    />
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        id="payphone-error"
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-sm text-[#ff5f57]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 font-mono text-sm text-muted transition-colors hover:border-fg/40 hover:text-fg"
                    >
                      <ArrowLeft size={15} aria-hidden="true" />
                      {i === 0 ? "Hang up" : "Back"}
                    </button>
                    <button
                      onClick={submitStep}
                      onMouseEnter={() => sfx.play("hover")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-pink px-5 py-2.5 font-mono text-sm font-semibold text-night shadow-neon transition-transform hover:scale-[1.02] active:scale-95 sm:flex-none"
                    >
                      {i < STEPS.length - 1 ? "Continue" : "Send message"}
                      <span aria-hidden="true">↵</span>
                    </button>
                  </div>
                  <p className="mt-3 font-mono text-[11px] text-muted">
                    Press Enter to continue
                    {active.key === "message" ? " · Shift + Enter for a new line" : ""}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Done: the call was handed off ──────────────────────── */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex min-h-[360px] flex-col items-center justify-center gap-6 p-8 text-center sm:p-10"
              >
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="grid h-16 w-16 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon"
                >
                  <Check size={28} aria-hidden="true" />
                </motion.span>

                <div>
                  <h3 className="font-display text-2xl text-fg sm:text-3xl">Call connected</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Your message is waiting in your email app — just hit send. Nothing opened? Copy my
                    address below and reach out directly.
                  </p>
                  <p className="mt-3 font-mono text-sm text-cyan">{person.email}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={reset}
                    onMouseEnter={() => sfx.play("hover")}
                    className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 font-mono text-sm font-semibold text-night shadow-neon transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    <PhoneCall size={15} aria-hidden="true" /> Make another call
                  </button>
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                    {copied ? "copied" : "copy email"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Direct lines ─────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center gap-4 lg:col-span-2"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            prefer a direct line?
          </p>
          <MagneticButton
            href={`mailto:${person.email}`}
            variant="outline"
            className="w-full justify-between"
            ariaLabel={`Email ${person.email}`}
          >
            <span className="flex items-center gap-2.5">
              <Mail size={15} aria-hidden="true" /> {person.email}
            </span>
          </MagneticButton>
          <MagneticButton
            href={person.github}
            external
            variant="outline"
            className="w-full justify-between"
            ariaLabel="GitHub profile (opens in new tab)"
          >
            <span className="flex items-center gap-2.5">
              <Github size={15} aria-hidden="true" /> github.com/{person.handle}
            </span>
          </MagneticButton>
          <button
            onClick={copyEmail}
            className="flex items-center gap-2.5 rounded-lg border border-dashed border-line px-5 py-3 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "copied to clipboard" : "copy email address"}
          </button>
        </motion.aside>
      </div>
    </SectionShell>
  );
}

/** One captured answer, echoed back with a neon check. */
function Answer({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <Check size={16} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
      <dt className="text-muted">{label}:</dt>
      <dd className="min-w-0 flex-1 truncate text-fg">{value}</dd>
    </div>
  );
}
