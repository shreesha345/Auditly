import { loadFont } from "@remotion/google-fonts/Inter";
import { ArrowRight, TriangleAlert } from "lucide-react";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, LogoMark, Ring } from "./components";
import { C } from "./theme";

// YouTube thumbnail, 1280×720. Render with: npx remotion still Thumbnail out/thumbnail.png
// Keep the bottom-right corner clear: YouTube draws the duration badge there.
const { fontFamily } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin", "latin-ext"] });

const hot: React.CSSProperties = {
  backgroundImage: "linear-gradient(90deg, #ff5d73 0%, #f472b6 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, color: "white", overflow: "hidden" }}>
    <Background tint="mixed" />

    {/* Warm glow behind the score */}
    <div
      style={{
        position: "absolute",
        width: 820,
        height: 820,
        left: 620,
        top: -80,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,63,94,0.32) 0%, transparent 60%)",
      }}
    />

    {/* Brand */}
    <div style={{ position: "absolute", left: 50, top: 38, display: "flex", alignItems: "center", gap: 16 }}>
      <LogoMark size={58} />
      <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5 }}>Auditly</span>
    </div>

    {/* Headline */}
    <div style={{ position: "absolute", left: 46, top: 122, lineHeight: 0.94, letterSpacing: -4.5, fontWeight: 900, fontSize: 110 }}>
      <div>
        COST UP <span style={hot}>28%</span>
      </div>
      <div style={{ marginTop: 4 }}>NO PROOF.</div>
    </div>

    {/* Contract card */}
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 372,
        width: 640,
        padding: "24px 34px 30px",
        borderRadius: 26,
        background: "#ffffff",
        color: C.ink,
        transform: "rotate(-2.5deg)",
        boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2.5, color: C.muted }}>PUBLIC ROAD CONTRACT</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
        <span style={{ fontSize: 44, fontWeight: 600, color: "#9a93b3", textDecoration: "line-through", textDecorationThickness: 4 }}>₹48.2 Cr</span>
        <ArrowRight size={42} color={C.muted} strokeWidth={3} />
        <span style={{ fontSize: 58, fontWeight: 900, color: C.accent, letterSpacing: -1.5 }}>₹61.9 Cr</span>
      </div>
    </div>

    {/* Stamp */}
    <div
      style={{
        position: "absolute",
        left: 318,
        top: 522,
        transform: "rotate(-8deg)",
        border: `8px solid ${C.red}`,
        borderRadius: 16,
        padding: "4px 24px",
        background: "rgba(255,255,255,0.96)",
        color: C.red,
        fontSize: 60,
        fontWeight: 900,
        letterSpacing: 4,
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      }}
    >
      UNVERIFIED
    </div>

    {/* Risk score */}
    <div style={{ position: "absolute", left: 842, top: 118, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ filter: "drop-shadow(0 0 40px rgba(244,63,94,0.55))" }}>
        <Ring value={88} size={360} stroke={32} color="#f43f5e" track="rgba(255,255,255,0.12)">
          <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6 }}>88</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: "rgba(255,255,255,0.75)", marginTop: 10 }}>RISK SCORE</div>
        </Ring>
      </div>
      <div
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 26px",
          borderRadius: 999,
          background: "#f43f5e",
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 1.5,
          boxShadow: "0 16px 40px rgba(244,63,94,0.45)",
        }}
      >
        <TriangleAlert size={30} strokeWidth={3} /> AI FLAGGED
      </div>
    </div>

    {/* Hook line */}
    <div style={{ position: "absolute", left: 62, bottom: 30, fontSize: 30, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: -0.5 }}>
      AI that checks public contracts
    </div>
  </AbsoluteFill>
);
