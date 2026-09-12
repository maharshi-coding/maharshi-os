"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Mic, MicOff, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import {
  characterDialogue,
  guideChoices,
  type GuideChoice,
} from "@/data/characterDialogue";
import { currentProject } from "@/data/currentProject";
import { scrollToId } from "../SmoothScroll";
import DialogueUI from "./DialogueUI";
import Persona from "./Persona";
import { useVoice } from "./useVoice";
import type { CharacterState } from "./characterState";

/**
 * Opt-in interactive workspace guide. The launcher button is lightweight; the
 * heavy 3D scene is code-split and only mounts on open, so the scrolling site
 * stays fast. The site remains fully usable if this is never opened.
 */
export default function WorkspaceOverlay() {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const [charState, setCharState] = useState<CharacterState>("idle");
  const [line, setLine] = useState<string>(characterDialogue.welcome);
  const [muted, setMuted] = useState(true); // narration is OFF by default
  const closeTimer = useRef<number | undefined>(undefined);
  const overlayRef = useRef<HTMLDivElement>(null);

  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string) => {
      if (muted || !ttsSupported) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.03;
        window.speechSynthesis.speak(u);
      } catch {
        /* speech is best-effort */
      }
    },
    [muted, ttsSupported]
  );

  const greet = useCallback(() => {
    setLine(characterDialogue.welcome);
    setCharState("greet");
    speak(characterDialogue.welcome);
  }, [speak]);

  const openGuide = useCallback(() => {
    setOpen(true);
    greet();
  }, [greet]);

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    if (ttsSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    }
    setOpen(false);
    setCharState("idle");
  }, [ttsSupported]);

  const choose = useCallback(
    (c: GuideChoice) => {
      const intro = characterDialogue.intros[c.id] ?? "";
      setLine(intro);
      setCharState("talk");
      speak(intro);
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(
        () => {
          if (c.external) {
            window.open(c.target, "_blank", "noopener,noreferrer");
            close();
          } else {
            close();
            scrollToId(c.target);
          }
        },
        reduced ? 300 : 1300
      );
    },
    [close, reduced, speak]
  );

  const chooseById = useCallback(
    (id: string) => {
      const c = guideChoices.find((x) => x.id === id);
      if (c) choose(c);
    },
    [choose]
  );

  // Optional "Hey Maharshi" voice — explicit opt-in; clicks always work too.
  const voice = useVoice({
    onWake: openGuide,
    onCommand: chooseById,
    getContext: () => (open ? "open" : "closed"),
  });

  // Escape closes; focus moves into the overlay for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    overlayRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {!open && (
        <div className="hx-ws-dock">
          <button
            type="button"
            className="hx-ws-launch"
            onClick={openGuide}
            aria-haspopup="dialog"
          >
            <Sparkles size={16} strokeWidth={2} />
            Meet Maharshi
          </button>

          {voice.supported && (
            <button
              type="button"
              className="hx-ws-mic"
              data-on={voice.enabled}
              data-listening={voice.listening}
              onClick={voice.toggle}
              aria-pressed={voice.enabled}
              aria-label={
                voice.enabled ? "Turn off voice" : "Turn on voice, then say Hey Maharshi"
              }
            >
              {voice.enabled ? <Mic size={15} /> : <MicOff size={15} />}
              {voice.enabled ? (voice.listening ? "Listening…" : "Voice on") : "Voice"}
            </button>
          )}

          {voice.enabled && (
            <p className="hx-ws-voicehint" aria-live="polite">
              Say <b>&ldquo;Hey Maharshi&rdquo;</b>
              {voice.heard ? ` · heard: “${voice.heard}”` : ""}
            </p>
          )}
          {voice.error && (
            <p className="hx-ws-voiceerr" role="status">
              {voice.error}
            </p>
          )}
        </div>
      )}

      {open && (
        <div
          ref={overlayRef}
          className="hx-ws-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Maharshi's interactive workspace"
          tabIndex={-1}
        >
          <div className="hx-ws-topbar">
            <span className="hx-ws-topbar__title">
              <span className="hx-ws-topbar__dot" /> Maharshi&apos;s workspace
            </span>
            <div className="hx-ws-topbar__controls">
              {voice.supported && (
                <button
                  type="button"
                  className="hx-ws-icon"
                  data-on={voice.enabled}
                  data-listening={voice.listening}
                  onClick={voice.toggle}
                  aria-pressed={voice.enabled}
                  aria-label={voice.enabled ? "Turn off voice" : "Turn on voice"}
                >
                  {voice.enabled ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              )}
              {ttsSupported && (
                <button
                  type="button"
                  className="hx-ws-icon"
                  onClick={() => setMuted((m) => !m)}
                  aria-pressed={!muted}
                  aria-label={muted ? "Enable voice narration" : "Mute voice narration"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}
              <button
                type="button"
                className="hx-ws-icon"
                onClick={close}
                aria-label="Close workspace"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="hx-ws-stage">
            <Persona state={charState} reduced={reduced} onInteract={greet} />

            {/* "Currently Building" readout — the monitor's content, as reliable DOM */}
            <a
              className="hx-ws-monitor"
              href={currentProject.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hx-ws-monitor__eyebrow">
                <span className="hx-ws-monitor__blink" /> Currently Building
              </p>
              <p className="hx-ws-monitor__name">{currentProject.name}</p>
              <p className="hx-ws-monitor__desc">{currentProject.description}</p>
              <p className="hx-ws-monitor__row">
                <span className="hx-ws-monitor__status">{currentProject.status}</span>
                <span className="hx-ws-monitor__tech">{currentProject.tech.join(" · ")}</span>
              </p>
            </a>

            <p className="hx-ws-hint" aria-hidden="true">
              Tap the character to talk
            </p>
          </div>

          {voice.enabled && (
            <p className="hx-ws-voicecap" aria-live="polite">
              {voice.listening ? "● Listening" : "Voice on"}
              {voice.heard ? ` · “${voice.heard}”` : " · say a section name"}
            </p>
          )}
          <DialogueUI line={line} onChoose={choose} />
        </div>
      )}
    </>
  );
}
