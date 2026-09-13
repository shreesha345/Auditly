import type { LucideIcon } from "lucide-react";
import { Lock, ShieldCheck } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 over [start, start + duration], eased and clamped. */
export function progress(frame: number, start: number, duration: number, easing: (t: number) => number = easeOut) {
  return interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });
}

export const gradientText: React.CSSProperties = {
  backgroundImage: "linear-gradient(90deg, #c4b5fd 0%, #f472b6 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const card: React.CSSProperties = {
  background: "#ffffff",
  color: C.ink,
  borderRadius: 24,
  border: `1px solid ${C.line}`,
  boxShadow: "0 30px 90px rgba(0,0,0,0.42)",
};

export const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 22,
};

export const Background: React.FC<{ tint?: "violet" | "pink" | "mixed" }> = ({ tint = "mixed" }) => {
  const t = useCurrentFrame() / 30;
  const a = tint === "pink" ? "#b5176b" : "#6d28d9";
  const b = tint === "violet" ? "#4c1d95" : "#b5176b";
  const grid = "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)";
  const mask = "radial-gradient(ellipse at center, black 25%, transparent 78%)";
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          left: -380 + Math.sin(t * 0.4) * 90,
          top: -560 + Math.cos(t * 0.3) * 70,
          background: `radial-gradient(circle, ${a}66 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          right: -480 + Math.cos(t * 0.35) * 90,
          bottom: -700 + Math.sin(t * 0.25) * 80,
          background: `radial-gradient(circle, ${b}55 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill style={{ backgroundImage: grid, backgroundSize: "64px 64px", maskImage: mask, WebkitMaskImage: mask }} />
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{ tint?: "violet" | "pink" | "mixed"; children: React.ReactNode }> = ({ tint, children }) => (
  <AbsoluteFill style={{ fontFamily, color: "white" }}>
    <Background tint={tint} />
    {children}
  </AbsoluteFill>
);

export const FadeUp: React.FC<{ delay?: number; distance?: number; duration?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  delay = 0,
  distance = 28,
  duration = 20,
  style,
  children,
}) => {
  const p = progress(useCurrentFrame(), delay, duration);
  return <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * distance}px)` }}>{children}</div>;
};

/** Headline that reveals word by word; words in `highlight` get the brand gradient. */
export const Words: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  highlight?: string[];
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 3, size = 64, weight = 800, highlight = [], style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontSize: size, fontWeight: weight, lineHeight: 1.12, letterSpacing: -size * 0.025, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = progress(frame, delay + i * stagger, 18);
        const hl = highlight.includes(w);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.45}px)`,
              marginRight: size * 0.25,
              paddingBottom: size * 0.06,
              ...(hl ? gradientText : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{ index?: string; label: string; color?: string; delay?: number; style?: React.CSSProperties }> = ({
  index,
  label,
  color = C.pink,
  delay = 0,
  style,
}) => {
  const p = progress(useCurrentFrame(), delay, 18);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -24}px)`, ...style }}>
      {index && (
        <span style={{ fontSize: 19, fontWeight: 700, color: "white", background: color, borderRadius: 999, padding: "5px 14px" }}>{index}</span>
      )}
      <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color }}>{label}</span>
    </div>
  );
};

export const Body: React.FC<{ delay?: number; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ delay = 0, size = 28, style, children }) => (
  <FadeUp delay={delay} distance={18}>
    <p style={{ margin: 0, fontSize: size, lineHeight: 1.5, color: "rgba(255,255,255,0.72)", fontWeight: 400, ...style }}>{children}</p>
  </FadeUp>
);

const TONES = {
  green: ["#ecfdf5", "#047857"],
  red: ["#fef2f2", "#b91c1c"],
  amber: ["#fffbeb", "#92400e"],
  sky: ["#f0f9ff", "#0369a1"],
  violet: ["#f5f3ff", "#6d28d9"],
  primary: ["#ede8f8", "#2e1a6b"],
  accent: ["#fbe7f1", "#b5176b"],
  gray: ["#f3f4f6", "#374151"],
} as const;
export type Tone = keyof typeof TONES;

export const TYPE_TONE = { Cost: "accent", Scope: "primary", Materials: "amber", Timeline: "sky", Subcontractor: "violet" } as const;

export const Badge: React.FC<{ tone?: Tone; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ tone = "gray", size = 18, style, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.35,
      background: TONES[tone][0],
      color: TONES[tone][1],
      borderRadius: 999,
      padding: `${size * 0.28}px ${size * 0.65}px`,
      fontSize: size,
      fontWeight: 600,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

export const IconCircle: React.FC<{ icon: LucideIcon; size: number; bg: string; color?: string; radius?: string | number }> = ({ icon: Icon, size, bg, color = "white", radius = "50%" }) => (
  <div style={{ width: size, height: size, borderRadius: radius, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon size={size * 0.5} color={color} strokeWidth={2} />
  </div>
);

export const LogoMark: React.FC<{ size: number; glow?: boolean }> = ({ size, glow = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: "linear-gradient(135deg, #8b5cf6, #b5176b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: glow ? `0 0 ${size * 0.7}px rgba(181,23,107,0.5)` : undefined,
      flexShrink: 0,
    }}
  >
    <ShieldCheck size={size * 0.56} color="white" strokeWidth={2} />
  </div>
);

export const Ring: React.FC<{ value: number; size: number; stroke: number; color: string; track?: string; children?: React.ReactNode }> = ({
  value,
  size,
  stroke,
  color,
  track = C.primarySoft,
  children,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, value) / 100)}
          opacity={value < 0.5 ? 0 : 1}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

/** Browser window showing a screenshot; `scroll` 0 → 1 pans from top to bottom of the page. */
export const BrowserFrame: React.FC<{ src: string; url: string; width: number; height: number; scroll: number }> = ({ src, url, width, height, scroll }) => (
  <div style={{ width, height, borderRadius: 18, overflow: "hidden", background: "#ffffff", boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)" }}>
    <div style={{ height: 52, background: "#1b1238", display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      <div
        style={{
          marginLeft: 22,
          width: 620,
          height: 32,
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.75)",
          fontSize: 17,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}
      >
        <Lock size={14} /> {url}
      </div>
    </div>
    <Img src={staticFile(src)} style={{ width, height: height - 52, objectFit: "cover", objectPosition: `50% ${scroll * 100}%`, display: "block" }} />
  </div>
);
