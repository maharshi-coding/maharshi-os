"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { districts, stations } from "@/data/resume";

const TOTAL_DISTRICTS = districts.length;

interface ViceState {
  /** Loading screen finished (or skipped this session). */
  loaded: boolean;
  completeLoad: () => void;
  reboot: () => void;
  reducedMotion: boolean;

  /* ── Audio (muted by default) ─────────────────────────────── */
  radioOn: boolean;
  toggleRadio: () => void;
  station: number;
  cycleStation: () => void;

  /* ── Exploration / progression ────────────────────────────── */
  district: string; // current section id
  setDistrict: (id: string) => void;
  visited: string[];
  markVisited: (id: string) => void;
  explored: number;
  wanted: number; // 0–6 stars
  xp: number;
  level: number;

  /* ── UI surfaces ──────────────────────────────────────────── */
  phoneOpen: boolean;
  setPhoneOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  /* ── Cheats ───────────────────────────────────────────────── */
  daylight: boolean;
  triggerCheat: (id: string) => void;
  cheatToast: string | null;
  starRain: boolean;
  secretUnlocked: boolean;
}

const ViceContext = createContext<ViceState | null>(null);

export function useOS() {
  const ctx = useContext(ViceContext);
  if (!ctx) throw new Error("useOS must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [radioOn, setRadioOn] = useState(false);
  const [station, setStation] = useState(0);

  const [district, setDistrict] = useState("home");
  const [visited, setVisited] = useState<string[]>(["home"]);

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [daylight, setDaylight] = useState(false);
  const [bonusXp, setBonusXp] = useState(0);
  const [sixStars, setSixStars] = useState(false);
  const [cheatToast, setCheatToast] = useState<string | null>(null);
  const [starRain, setStarRain] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rainTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHydrated(true);
    try {
      if (sessionStorage.getItem("vice-loaded") === "1") setLoaded(true);
    } catch {
      /* storage unavailable — load normally */
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const completeLoad = useCallback(() => {
    setLoaded(true);
    try {
      sessionStorage.setItem("vice-loaded", "1");
    } catch {}
  }, []);

  const reboot = useCallback(() => {
    try {
      sessionStorage.removeItem("vice-loaded");
    } catch {}
    window.scrollTo({ top: 0, behavior: "auto" });
    setLoaded(false);
  }, []);

  const toggleRadio = useCallback(() => setRadioOn((v) => !v), []);
  const cycleStation = useCallback(() => setStation((s) => (s + 1) % stations.length), []);

  const markVisited = useCallback((id: string) => {
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const flashToast = useCallback((label: string) => {
    setCheatToast(label);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setCheatToast(null), 2600);
  }, []);

  const triggerCheat = useCallback(
    (id: string) => {
      switch (id) {
        case "wanted":
          setSixStars(true);
          flashToast("★★★★★★  SIX STARS — WANTED LEVEL MAXED");
          break;
        case "daylight":
          setDaylight((d) => {
            const next = !d;
            document.documentElement.classList.toggle("daylight", next);
            return next;
          });
          flashToast("DAYLIGHT — CITY LIGHTING TOGGLED");
          break;
        case "godmode":
          setBonusXp((x) => x + 5000);
          setStarRain(true);
          if (rainTimer.current) clearTimeout(rainTimer.current);
          rainTimer.current = setTimeout(() => setStarRain(false), 5200);
          flashToast("IDDQD — STAR RAIN + 5000 XP");
          break;
        case "secret":
          setSecretUnlocked(true);
          setBonusXp((x) => x + 2500);
          flashToast("SECRET MISSION UNLOCKED — CHECK MISSION ROW");
          break;
        default:
          break;
      }
    },
    [flashToast]
  );

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (rainTimer.current) clearTimeout(rainTimer.current);
    },
    []
  );

  const explored = visited.length;
  const wanted = sixStars ? 6 : Math.min(5, Math.round((explored / TOTAL_DISTRICTS) * 5));
  const xp = explored * 300 + bonusXp;
  const level = Math.floor(xp / 1200) + 1;

  const value = useMemo<ViceState>(
    () => ({
      loaded: hydrated ? loaded : true, // avoid SSR overlay flash
      completeLoad,
      reboot,
      reducedMotion,
      radioOn,
      toggleRadio,
      station,
      cycleStation,
      district,
      setDistrict,
      visited,
      markVisited,
      explored,
      wanted,
      xp,
      level,
      phoneOpen,
      setPhoneOpen,
      paletteOpen,
      setPaletteOpen,
      daylight,
      triggerCheat,
      cheatToast,
      starRain,
      secretUnlocked,
    }),
    [
      hydrated,
      loaded,
      completeLoad,
      reboot,
      reducedMotion,
      radioOn,
      toggleRadio,
      station,
      cycleStation,
      district,
      visited,
      markVisited,
      explored,
      wanted,
      xp,
      level,
      phoneOpen,
      paletteOpen,
      daylight,
      triggerCheat,
      cheatToast,
      starRain,
      secretUnlocked,
    ]
  );

  return <ViceContext.Provider value={value}>{children}</ViceContext.Provider>;
}
