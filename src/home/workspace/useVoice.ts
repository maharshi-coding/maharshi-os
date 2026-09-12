"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin, safe wrapper over the Web Speech API (SpeechRecognition).
 *
 * Design rules (from the brief):
 *  - Never auto-requests the mic. Recognition only starts when the user
 *    explicitly calls `toggle()` (a user gesture), which triggers the browser's
 *    permission prompt.
 *  - If unsupported or permission is denied, everything degrades gracefully —
 *    `supported`/`error` let the UI hide or explain, and the rest of the
 *    experience keeps working via clicks.
 *
 * When "closed", a wake phrase ("hey maharshi") fires `onWake`.
 * When "open", a section keyword fires `onCommand(id)`.
 */
export function useVoice({
  onWake,
  onCommand,
  getContext,
}: {
  onWake: () => void;
  onCommand?: (id: string) => void;
  getContext?: () => "open" | "closed";
}) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<unknown>(null);
  const enabledRef = useRef(false);
  const onWakeRef = useRef(onWake);
  const onCommandRef = useRef(onCommand);
  const ctxRef = useRef(getContext);
  onWakeRef.current = onWake;
  onCommandRef.current = onCommand;
  ctxRef.current = getContext;

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const stop = useCallback(() => {
    enabledRef.current = false;
    setEnabled(false);
    setListening(false);
    try {
      (recRef.current as { stop?: () => void } | null)?.stop?.();
    } catch {
      /* noop */
    }
    recRef.current = null;
  }, []);

  const start = useCallback(() => {
    const w = window as unknown as Record<string, unknown>;
    const SR = (w.SpeechRecognition || w.webkitSpeechRecognition) as
      | (new () => Record<string, unknown>)
      | undefined;
    if (!SR) return;
    setError(null);

    const rec = new SR() as Record<string, unknown> & { start: () => void; stop: () => void };
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onerror = (e: { error?: string }) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("Microphone access was blocked — the guide still works by tapping.");
        stop();
      } else if (e.error !== "no-speech" && e.error !== "aborted") {
        setError("Voice recognition hit a snag — tapping still works.");
      }
    };
    rec.onend = () => {
      setListening(false);
      // Chrome ends recognition after pauses; keep it alive while enabled.
      if (enabledRef.current) {
        try {
          rec.start();
        } catch {
          /* noop */
        }
      }
    };
    rec.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => {
      const t = Array.from(e.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ")
        .toLowerCase()
        .trim();
      if (!t) return;
      setHeard(t);
      const ctx = ctxRef.current?.() ?? "closed";
      if (ctx === "closed") {
        if (/\b(hey\s+)?mah?arshi\b/.test(t) || t.includes("maharshi")) onWakeRef.current();
      } else {
        const cmd = matchCommand(t);
        if (cmd) onCommandRef.current?.(cmd);
        else if (t.includes("maharshi")) onWakeRef.current();
      }
    };

    recRef.current = rec;
    enabledRef.current = true;
    setEnabled(true);
    try {
      rec.start();
    } catch {
      /* start throws if already started — safe to ignore */
    }
  }, [stop]);

  const toggle = useCallback(() => {
    if (enabledRef.current) stop();
    else start();
  }, [start, stop]);

  useEffect(
    () => () => {
      enabledRef.current = false;
      try {
        (recRef.current as { stop?: () => void } | null)?.stop?.();
      } catch {
        /* noop */
      }
    },
    []
  );

  return { supported, enabled, listening, heard, error, toggle, stop };
}

/** Map a spoken phrase to a guide-choice id. */
function matchCommand(t: string): string | null {
  if (/(open\s?source|contribution|contribute|upstream)/.test(t)) return "opensource";
  if (/(my work|projects?|what.*built|show.*work)/.test(t)) return "work";
  if (/(experience|journey|background|work history|education)/.test(t)) return "journey";
  if (/(skills?|tech stack|toolkit|technolog)/.test(t)) return "skills";
  if (/(currently building|current project|building now|working on)/.test(t)) return "currentproject";
  if (/(contact|reach you|email|hire|get in touch)/.test(t)) return "contact";
  if (/(github|git hub)/.test(t)) return "github";
  return null;
}
