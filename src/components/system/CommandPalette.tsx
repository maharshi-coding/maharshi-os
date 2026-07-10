"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Github,
  MapPin,
  Radio as RadioIcon,
  Search,
  Skull,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { cheats, districts, person } from "@/data/resume";
import { useOS } from "./Providers";
import { sfx } from "@/hooks/useSfx";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
}

/**
 * Quick-travel + cheat console (Ctrl/⌘+K): fast-travel between districts,
 * open the phone, toggle the radio, punch in cheat codes, copy the email or
 * respawn the city.
 */
export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    setPhoneOpen,
    toggleRadio,
    triggerCheat,
    reducedMotion,
  } = useOS();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setPaletteOpen(false);
    setQuery("");
    setIndex(0);
  }, [setPaletteOpen]);

  const goTo = useCallback(
    (id: string) => {
      close();
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    },
    [close, reducedMotion]
  );

  const commands = useMemo<CommandItem[]>(
    () => [
      ...districts.map((d) => ({
        id: `nav-${d.id}`,
        label: `Fast travel · ${d.location}`,
        hint: d.blip,
        group: "TRAVEL",
        icon: <MapPin size={14} />,
        run: () => {
          sfx.play("select");
          goTo(d.id);
        },
      })),
      {
        id: "phone",
        label: "Open phone",
        hint: "apps + github",
        group: "SYSTEM",
        icon: <Smartphone size={14} />,
        run: () => {
          close();
          setPhoneOpen(true);
        },
      },
      {
        id: "radio",
        label: "Toggle radio",
        hint: "synthwave",
        group: "SYSTEM",
        icon: <RadioIcon size={14} />,
        run: () => {
          toggleRadio();
          close();
        },
      },
      {
        id: "email",
        label: copied ? "Copied!" : "Copy email address",
        hint: person.email,
        group: "SYSTEM",
        icon: <Copy size={14} />,
        run: () => {
          navigator.clipboard?.writeText(person.email).then(() => {
            setCopied(true);
            sfx.play("success");
            setTimeout(() => {
              setCopied(false);
              close();
            }, 900);
          });
        },
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: person.handle,
        group: "SYSTEM",
        icon: <Github size={14} />,
        run: () => {
          window.open(person.github, "_blank", "noopener,noreferrer");
          close();
        },
      },
      ...cheats.map((c) => ({
        id: `cheat-${c.id}`,
        label: `Cheat · ${c.label}`,
        hint: c.code === "KONAMI" ? c.hint : c.code,
        group: "CHEATS",
        icon: <Sparkles size={14} />,
        run: () => {
          triggerCheat(c.id);
          close();
        },
      })),
      {
        id: "wasted",
        label: "Respawn the city",
        hint: "wasted → reboot",
        group: "CHEATS",
        icon: <Skull size={14} />,
        run: () => {
          close();
          window.dispatchEvent(new CustomEvent("vice:wasted"));
        },
      },
    ],
    [goTo, close, setPhoneOpen, toggleRadio, triggerCheat, copied]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 30);
  }, [paletteOpen]);

  useEffect(() => setIndex(0), [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && filtered[index]) filtered[index].run();
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[78] flex items-start justify-center bg-black/60 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Quick travel and cheats"
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-night"
            style={{ boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 30px var(--accent-dim)" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={15} className="text-pink" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Fast travel, cheats, system…"
                className="h-12 w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-muted"
                aria-label="Search commands"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-xs text-muted">
                  no such street: {query}
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li key={cmd.id} role="option" aria-selected={i === index}>
                  <button
                    onClick={cmd.run}
                    onMouseEnter={() => {
                      setIndex(i);
                      sfx.play("hover");
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                      i === index ? "bg-pink/12 text-pink" : "text-fg"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={i === index ? "text-pink" : "text-muted"}>{cmd.icon}</span>
                      {cmd.label}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="hidden text-[9px] uppercase tracking-widest text-muted sm:inline">
                        {cmd.group}
                      </span>
                      <span className="max-w-[38%] truncate text-[11px] text-muted">{cmd.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
