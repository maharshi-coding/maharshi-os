"use client";

import { useEffect } from "react";
import { cheats } from "@/data/resume";
import { useOS } from "@/components/system/Providers";

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

// Word cheats typed on the keyboard, mapped to cheat ids from the data.
const WORD_CHEATS = cheats
  .filter((c) => c.code !== "KONAMI")
  .map((c) => ({ id: c.id, code: c.code.toLowerCase() }));

const MAX_LEN = Math.max(KONAMI.length, ...WORD_CHEATS.map((c) => c.code.length));

/**
 * useCheats — listens for the Konami sequence and typed word codes (VICE,
 * SUNNY, IDDQD…) and fires the matching cheat. Ignores keystrokes while the
 * visitor is typing into a field.
 */
export function useCheats() {
  const { triggerCheat } = useOS();

  useEffect(() => {
    const keys: string[] = [];
    const letters: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Konami — arrow/letter sequence.
      keys.push(key);
      if (keys.length > KONAMI.length) keys.shift();
      if (keys.length === KONAMI.length && KONAMI.every((k, i) => k === keys[i])) {
        triggerCheat("secret");
        keys.length = 0;
      }

      // Typed word cheats.
      if (/^[a-z]$/.test(key)) {
        letters.push(key);
        if (letters.length > MAX_LEN) letters.shift();
        const buf = letters.join("");
        for (const c of WORD_CHEATS) {
          if (buf.endsWith(c.code)) {
            triggerCheat(c.id);
            letters.length = 0;
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerCheat]);
}
