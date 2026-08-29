/**
 * Vice City neon palette shared across the 3D experience.
 * Kept in sync with the CSS tokens in src/app/globals.css.
 */
export const VICE = {
  pink: "#ff2e97",
  cyan: "#05d9e8",
  purple: "#7b2ff7",
  gold: "#ffb03a",
  green: "#39ff88",
  white: "#fdf0ff",
  fog: "#160a26", // deep neon-night haze the whole world fades into
};

// Neon accent cycled per project — used for the portal's spotlight glow.
export const PROJECT_PALETTE = [
  "#ff2e97", // pink
  "#05d9e8", // cyan
  "#7b2ff7", // purple
  "#ffb03a", // gold
  "#39ff88", // green
  "#ff6b3d", // sunset orange
];

// Dark, hue-tinted backdrop the 3D text sits on — kept dark on purpose so the
// light matcap title/description stay high-contrast and readable.
export const PROJECT_BACKDROP = [
  "#2e0a1c", // deep magenta
  "#062028", // deep teal
  "#180a30", // deep purple
  "#2e2208", // deep amber
  "#08281a", // deep green
  "#2e1109", // deep rust
];
