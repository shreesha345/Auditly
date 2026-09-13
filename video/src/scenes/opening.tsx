import { ClipboardCheck, FileCheck, FileText, Gauge, Handshake, HardHat, Landmark, Link2, Receipt, ScanSearch } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Body, card, clamp, FadeUp, glass, gradientText, IconCircle, Kicker, LogoMark, progress, Scene, Words } from "../components";
import { C } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 12, mass: 0.8 } });
  const ringScale = interpolate(frame, [8, 55], [0.9, 2.4], clamp);
  const ringOpacity = interpolate(frame, [8, 20, 55], [0, 0.8, 0], clamp);

  return (
    <Scene tint="mixed">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", transform: `scale(${logo}) rotate(${(1 - logo) * -25}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 48, border: `3px solid ${C.pink}`, transform: `scale(${ringScale})`, opacity: ringOpacity }} />
          <LogoMark size={170} />
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 168, fontWeight: 800, letterSpacing: -6 }}>
          {"Auditly".split("").map((ch, i) => {
            const s = spring({ frame: frame - 22 - i * 3, fps, config: { damping: 14 } });
            return (
              <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 70}px)`, filter: `blur(${Math.max(0, 1 - s) * 8}px)` }}>
                {ch}
              </span>
            );
          })}
        </div>
        <FadeUp delay={58}>
          <div style={{ fontSize: 46, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>AI-powered public procurement intelligence</div>
        </FadeUp>
        <FadeUp delay={88}>
          <div style={{ marginTop: 36, fontSize: 22, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", color: C.pink }}>
            Manipal Hackathon 2026 · Smart Governance & Compliance
          </div>
        </FadeUp>
      </AbsoluteFill>
    </Scene>
  );
};

const CHANGE_LINES = [
  { text: "Costs rise.", color: "#f87171", at: 50 },
  { text: "Scopes shift.", color: "#c4b5fd", at: 72 },
  { text: "Materials get swapped.", color: "#fbbf24", at: 94 },
  { text: "Timelines slip.", color: "#7dd3fc", at: 116 },
  { text: "Subcontractors quietly appear.", color: "#f472b6", at: 138 },
];

const DOCS = [
  { icon: FileCheck, title: "Approvals", where: "Engineering wing", x: -630, y: 30, r: -9 },
  { icon: FileText, title: "Change orders", where: "Project office", x: -210, y: 120, r: 6 },
  { icon: ClipboardCheck, title: "Inspection reports", where: "Site logs", x: 210, y: 10, r: -5 },
  { icon: Receipt, title: "Invoices", where: "Treasury", x: 630, y: 110, r: 8 },
];

const ContractRow: React.FC<{ frame: number; label: string; before: string; after: string; at: number; badge?: React.ReactNode; last?: boolean }> = ({
  frame,
  label,
  before,
  after,
  at,
  badge,
  last,
}) => {
  const p = progress(frame, at, 14);
  const flash = interpolate(frame, [at, at + 6, at + 45], [0, 1, 0.45], clamp);
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "24px 36px", borderBottom: last ? "none" : `1px solid ${C.line}`, background: `rgba(181,23,107,${flash * 0.1})` }}>
      <div style={{ width: 240, fontSize: 23, color: C.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ position: "relative", flex: 1, height: 36 }}>
        <div style={{ position: "absolute", fontSize: 27, fontWeight: 600, color: C.ink, opacity: 1 - p, transform: `translateY(${-p * 16}px)` }}>{before}</div>
        <div
          style={{
            position: "absolute",
            fontSize: 27,
            fontWeight: 700,
            color: C.accent,
            opacity: p,
            transform: `translateY(${(1 - p) * 16}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {after}
          {badge}
        </div>
      </div>
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phaseA = interpolate(frame, [178, 196], [1, 0], clamp);
  const phaseB = interpolate(frame, [192, 210], [0, 1], clamp);
  const value = interpolate(frame, [50, 72], [48.2, 61.9], clamp);

  return (
    <Scene tint="pink">
      <AbsoluteFill style={{ opacity: phaseA }}>
        <div style={{ position: "absolute", left: 120, top: 200, width: 800 }}>
          <Kicker label="The problem" />
          <Words text="After a public contract is awarded…" size={62} delay={4} style={{ marginTop: 22 }} />
          <div style={{ marginTop: 36 }}>
            {CHANGE_LINES.map((l) => (
              <FadeUp key={l.text} delay={l.at} distance={20}>
                <div style={{ fontSize: 50, fontWeight: 700, color: l.color, lineHeight: 1.32 }}>{l.text}</div>
              </FadeUp>
            ))}
          </div>
        </div>
        <FadeUp delay={14} style={{ position: "absolute", left: 990, top: 250 }}>
          <div style={{ ...card, width: 810, overflow: "hidden" }}>
            <div style={{ padding: "28px 36px", borderBottom: `1px solid ${C.line}`, background: C.surface }}>
              <div style={{ fontSize: 17, letterSpacing: 2, color: C.muted, fontWeight: 600 }}>AWARDED CONTRACT · KA-PWD-2025-0142</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 6 }}>NH-66 service road widening</div>
            </div>
            <ContractRow frame={frame} label="Contract value" before="₹48.20 Cr" after={`₹${value.toFixed(2)} Cr`} at={50} badge={<Badge tone="red">+28.4%</Badge>} />
            <ContractRow frame={frame} label="Scope" before="6 culverts" after="9 culverts + drain" at={72} />
            <ContractRow frame={frame} label="Materials" before="VG-30 · 40 mm" after="VG-40 · 50 mm" at={94} />
            <ContractRow frame={frame} label="Completion" before="30 Jun 2026" after="31 Jan 2027" at={116} />
            <ContractRow frame={frame} label="Subcontractors" before="1 declared" after="2 on site" at={138} last badge={<Badge tone="violet">NEW</Badge>} />
          </div>
        </FadeUp>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: phaseB }}>
        <div style={{ position: "absolute", top: 170, left: 160, right: 160, textAlign: "center" }}>
          <Words text="And the evidence to check it is scattered." size={76} delay={196} highlight={["scattered."]} />
        </div>
        {DOCS.map((d, i) => {
          const s = spring({ frame: frame - 214 - i * 4, fps, config: { damping: 13 } });
          return (
            <div
              key={d.title}
              style={{
                position: "absolute",
                left: 960 - 185,
                top: 500,
                width: 370,
                transform: `translate(${d.x * s}px, ${d.y * s}px) rotate(${d.r * s}deg)`,
                opacity: interpolate(frame, [206, 216], [0, 1], clamp),
              }}
            >
              <div style={{ ...card, padding: 26, display: "flex", alignItems: "center", gap: 18 }}>
                <IconCircle icon={d.icon} size={64} bg={C.primary} />
                <div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{d.title}</div>
                  <div style={{ fontSize: 19, color: C.muted, marginTop: 2 }}>{d.where}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", top: 800, left: 260, right: 260, textAlign: "center" }}>
          <Body delay={245} size={31}>
            Approvals, change orders, inspection reports and invoices live in different systems. Nobody connects them, so unverified changes slip through.
          </Body>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

const SIDES = [
  {
    icon: Landmark,
    color: "#a78bfa",
    solid: C.violet,
    title: "Governments lose the thread",
    body: "Contractors, scopes and costs shift quietly after award, with evidence scattered across systems.",
    points: ["Subcontractors swapped after award", "Costs and scope change without approval", "No single audit trail to follow"],
    from: -1,
    at: 34,
  },
  {
    icon: HardHat,
    color: C.pink,
    solid: C.accent,
    title: "Contractors can't find their fit",
    body: "Tenders are scattered across portals, with eligibility rules buried in dense documents.",
    points: ["Tenders spread across many portals", "Eligibility hidden in long PDFs", "Smaller firms miss deadlines"],
    from: 1,
    at: 62,
  },
];

export const Audiences: React.FC = () => {
  const frame = useCurrentFrame();
  const divider = progress(frame, 40, 30);
  return (
    <Scene tint="mixed">
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center" }}>
        <Kicker label="Who is affected" />
        <Words text="Two audiences. One broken system." size={74} delay={6} highlight={["broken"]} style={{ marginTop: 18 }} />
      </div>
      {SIDES.map((s, i) => {
        const p = progress(frame, s.at, 26);
        return (
          <div key={s.title} style={{ position: "absolute", top: 340, left: i === 0 ? 150 : 1030, width: 760, opacity: p, transform: `translateX(${(1 - p) * 90 * s.from}px)` }}>
            <IconCircle icon={s.icon} size={100} bg={s.solid} />
            <div style={{ fontSize: 50, fontWeight: 800, marginTop: 30, letterSpacing: -1 }}>{s.title}</div>
            <div style={{ fontSize: 29, lineHeight: 1.5, color: "rgba(255,255,255,0.7)", marginTop: 14, width: 700 }}>{s.body}</div>
            <div style={{ marginTop: 34 }}>
              {s.points.map((pt, j) => (
                <FadeUp key={pt} delay={s.at + 34 + j * 14} distance={14}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 27, color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 6, background: s.color, flexShrink: 0 }} />
                    {pt}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 959,
          top: 350,
          width: 2,
          height: 580 * divider,
          background: "linear-gradient(transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />
    </Scene>
  );
};

const MODULES = [
  { n: "01", icon: ScanSearch, title: "Contract Change Detector", color: C.violet },
  { n: "02", icon: Link2, title: "Evidence Linker", color: C.accent },
  { n: "03", icon: Gauge, title: "Investigation Priority Score", color: C.violet },
  { n: "04", icon: Handshake, title: "AI Tender Matching Engine", color: C.accent },
];

export const Introducing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = spring({ frame: frame - 12, fps, config: { damping: 13 } });
  return (
    <Scene tint="violet">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <FadeUp>
          <div style={{ fontSize: 30, letterSpacing: 10, textTransform: "uppercase", color: C.pink, fontWeight: 600 }}>Introducing</div>
        </FadeUp>
        <div
          style={{
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -7,
            lineHeight: 1.08,
            paddingRight: 12,
            marginTop: 4,
            opacity: brand,
            transform: `scale(${0.85 + 0.15 * brand})`,
            ...gradientText,
          }}
        >
          Auditly
        </div>
        <Words text="One shared intelligence layer that connects both sides." size={44} weight={500} delay={40} style={{ marginTop: 14, color: "rgba(255,255,255,0.88)", textAlign: "center" }} />
        <div style={{ display: "flex", gap: 24, marginTop: 90 }}>
          {MODULES.map((m, i) => {
            const s = spring({ frame: frame - 80 - i * 12, fps, config: { damping: 14 } });
            return (
              <div key={m.n} style={{ ...glass, width: 380, padding: 28, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <IconCircle icon={m.icon} size={64} bg={m.color} />
                  <span style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{m.n}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 22, lineHeight: 1.2 }}>{m.title}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
