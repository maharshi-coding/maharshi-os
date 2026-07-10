# PROJECT VICE // MAHARSHI.EXE

An interactive, neon-noir portfolio played like an open-world game.
Built for **Maharshi Barot** — AI Solutions Developer · Full-Stack Engineer.

Loading screen → **Welcome to Vice City** (hero) → Save Files (education) →
Career Mode (experience) → **Missions** (projects) → The Arsenal (skills) →
Player Stats (metrics) → The Payphone (contact). A persistent game HUD tracks
your location, wanted level and XP as you explore.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS ·
Framer Motion · GSAP + ScrollTrigger · Lenis · React Three Fiber / Three.js ·
Web Audio API (in-browser synthwave — no audio files) · Lucide icons.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Deploy

**Vercel** — import the repo, defaults work. Set `NEXT_PUBLIC_SITE_URL` to
your deployed URL (used by sitemap, robots and Open Graph).

**Netlify** — `netlify.toml` is included; the Next.js runtime plugin is
declared. Set the same env var.

## Editing content

Everything the site says lives in **one file**: `src/data/resume.ts`
(identity, education, experience, projects, skills, graph edges, metrics —
plus the game framing: districts, radio stations and cheat codes). Update it
and every section, the minimap, the phone and the quick-travel console pick up
the change. Per-project GitHub links are intentionally omitted; the GitHub
profile is reachable from the in-game phone.

## Controls / easter eggs

- `Ctrl/⌘ + K` — quick-travel + cheat console
- **Phone** (bottom-right) — GitHub, fast-travel apps, radio, stats
- **Minimap** (bottom-left) — click a blip to fast-travel
- **Radio** — in-browser synthwave, off by default (master sound switch)
- Cheats — type `VICE` (six stars), `SUNNY` (daylight), `IDDQD` (star rain),
  or the Konami code `↑↑↓↓←→←→BA` (secret mission)
- Footer "RESPAWN" — WASTED, then reboot

## Structure

```
src/
├── app/          layout, page, 404 (WASTED), robots, sitemap, manifest, icon
├── animations/   shared Framer Motion variants
├── components/
│   ├── sections/ Hero, Education, Experience, Projects, Skills, Metrics, Contact, Footer
│   ├── system/   LoadingScreen, HUD, Minimap, Phone, Radio, CommandPalette, CustomCursor, CheatFX, Providers
│   ├── three/    ViceCity (R3F synthwave scene)
│   └── ui/       Skyline, MagneticButton, SectionShell
├── hooks/        useSynthwave, useSfx, useCheats
├── data/         resume.ts — single source of truth
└── lib/          utilities
```

## Accessibility & performance

Full reduced-motion support (loading art, cursor, 3D scene, radio and graph
all degrade to static / silent), keyboard navigation, ARIA dialogs, skip
link, semantic HTML. Three.js loads dynamically client-side only with a
pure-SVG skyline fallback on mobile / reduced-motion; the skill graph is a
hand-rolled canvas sim (no chart library); all audio is synthesised in-browser
(no assets, off by default).
