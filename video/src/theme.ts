import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

// Palette mirrors the Auditly prototype (frontend/src/app/globals.css).
export const C = {
  bg: "#0c0720",
  ink: "#1b1238",
  primary: "#2e1a6b",
  primarySoft: "#ede8f8",
  violet: "#7c3aed",
  violetLight: "#c4b5fd",
  accent: "#b5176b",
  accentSoft: "#fbe7f1",
  pink: "#f472b6",
  surface: "#f7f5fc",
  line: "#e6e1f2",
  muted: "#6b6485",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
};

export const FPS = 30;
