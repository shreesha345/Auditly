import { CircleCheck, Flag, HardHat, Landmark, Newspaper, Rocket, Shield } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Tone } from "../components";
import { Badge, Body, card, clamp, FadeUp, glass, gradientText, IconCircle, Kicker, LogoMark, progress, Scene, Words } from "../components";
import { C } from "../theme";

const sectionLabel: React.CSSProperties = { fontSize: 19, letterSpacing: 3, fontWeight: 700, color: C.pink, textTransform: "uppercase" };

const WHO = [
  { icon: Landmark, title: "Procurement officers & auditors" },
  { icon: Shield, title: "Watchdogs & oversight bodies" },
  { icon: HardHat, title: "Contractors & SMEs bidding on tenders" },
  { icon: Newspaper, title: "Journalists & civic tech researchers" },
];

const MODEL: { tag: string; tone: Tone; title: string; body: string }[] = [
  { tag: "Government", tone: "primary", title: "Subscription licensing", body: "For agencies and oversight bodies" },
  { tag: "Free", tone: "green", title: "Tender matching", body: "Contractors browse and match at no cost" },
  { tag: "Premium", tone: "accent", title: "Deep eligibility & alerts", body: "Clause-level analysis and deadline reminders" },
  { tag: "Partners", tone: "sky", title: "Data licensing", body: "For research and civic transparency partners" },
];

const IMPACT = [
  "Transparency in public spending",
  "Accountability through evidence-linked audit trails",
  "Access to opportunities for smaller contractors",
  "Evidence-based oversight, not blanket suspicion",
];

export const Business: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sdg = progress(frame, 200, 24);

  return (
    <Scene tint="violet">
      <div style={{ position: "absolute", left: 120, top: 60, width: 1680 }}>
        <Kicker label="Business & impact" />
        <Words text="Built for everyone who keeps public money honest." size={56} delay={4} highlight={["honest."]} style={{ marginTop: 16 }} />
      </div>

      <div style={{ position: "absolute", left: 120, top: 232, width: 1680 }}>
        <FadeUp delay={24}>
          <div style={sectionLabel}>Who it serves</div>
        </FadeUp>
        <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
          {WHO.map((w, i) => {
            const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={w.title} style={{ ...glass, flex: 1, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 40}px)` }}>
                <IconCircle icon={w.icon} size={60} bg={i === 2 ? C.accent : C.violet} />
                <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>{w.title}</div>
              </div>
            );
          })}
        </div>

        <FadeUp delay={105} style={{ marginTop: 40 }}>
          <div style={sectionLabel}>Business model</div>
        </FadeUp>
        <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
          {MODEL.map((m, i) => {
            const s = spring({ frame: frame - 115 - i * 12, fps, config: { damping: 14 } });
            return (
              <div key={m.title} style={{ ...card, flex: 1, padding: "24px 26px", opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 40}px)` }}>
                <Badge tone={m.tone} size={16}>
                  {m.tag}
                </Badge>
                <div style={{ fontSize: 26, fontWeight: 700, marginTop: 14 }}>{m.title}</div>
                <div style={{ fontSize: 20, color: C.muted, marginTop: 6, lineHeight: 1.4 }}>{m.body}</div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            borderRadius: 24,
            padding: "28px 36px",
            display: "flex",
            gap: 36,
            alignItems: "center",
            background: "linear-gradient(110deg, rgba(124,58,237,0.55), rgba(181,23,107,0.55))",
            border: "1px solid rgba(255,255,255,0.18)",
            opacity: sdg,
            transform: `translateY(${(1 - sdg) * 30}px)`,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 20,
              background: "white",
              color: C.primary,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>UN SDG</div>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>16</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>Peace, Justice & Strong Institutions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 30px", marginTop: 14 }}>
              {IMPACT.map((t, i) => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 21, opacity: progress(frame, 220 + i * 10, 16) }}>
                  <CircleCheck size={22} color="#f9a8d4" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
};

const MILESTONES = [
  { tag: "MVP", text: "Change detector + evidence linker on sample data", icon: Rocket },
  { tag: "V2", text: "Priority scoring + relationship graph", icon: Rocket },
  { tag: "V3", text: "Contractor-facing tender matching engine", icon: Rocket },
  { tag: "Pilot", text: "Live pilot with a state procurement portal", icon: Flag },
];

const BUILD = [
  { h: 8, range: "Hours 0–8", label: "Ingestion & parsing" },
  { h: 12, range: "Hours 8–20", label: "Change, evidence & matching engines" },
  { h: 10, range: "Hours 20–30", label: "Both dashboards" },
  { h: 6, range: "Hours 30–36", label: "Integration & polish" },
];

export const Roadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = progress(frame, 18, 95, Easing.inOut(Easing.cubic));

  return (
    <Scene tint="violet">
      <div style={{ position: "absolute", left: 120, top: 90 }}>
        <Kicker label="Roadmap" />
        <Words text="Where Auditly goes next." size={68} delay={6} highlight={["next."]} style={{ marginTop: 18 }} />
      </div>

      <div style={{ position: "absolute", left: 300, top: 468, width: 1320, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", left: 300, top: 468, width: 1320 * line, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #8b5cf6, #f472b6)" }} />

      {MILESTONES.map((m, i) => {
        const x = 300 + i * 440;
        const at = 18 + i * 31;
        const s = spring({ frame: frame - at, fps, config: { damping: 12 } });
        const last = i === MILESTONES.length - 1;
        return (
          <React.Fragment key={m.tag}>
            <div style={{ position: "absolute", left: x - 42, top: 470 - 42, transform: `scale(${s})` }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  background: last ? C.accent : C.violet,
                  border: `5px solid ${C.bg}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 40px ${last ? "rgba(244,114,182,0.6)" : "rgba(139,92,246,0.6)"}`,
                }}
              >
                <m.icon size={36} color="white" />
              </div>
            </div>
            <FadeUp delay={at + 8} style={{ position: "absolute", left: x - 195, top: 548, width: 390, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: last ? C.pink : C.violetLight }}>{m.tag}</div>
              <div style={{ fontSize: 26, lineHeight: 1.4, color: "rgba(255,255,255,0.86)", marginTop: 8 }}>{m.text}</div>
            </FadeUp>
          </React.Fragment>
        );
      })}

      <div style={{ position: "absolute", left: 300, top: 790, width: 1500 }}>
        <FadeUp delay={135}>
          <div style={sectionLabel}>36-hour build plan · Round 2</div>
        </FadeUp>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {BUILD.map((b, i) => {
            const p = progress(frame, 148 + i * 12, 18);
            return (
              <div
                key={b.range}
                style={{
                  width: (b.h / 36) * 1500 - 7.5,
                  height: 100,
                  borderRadius: 16,
                  padding: "16px 22px",
                  background: i % 2 ? "rgba(181,23,107,0.35)" : "rgba(124,58,237,0.35)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  opacity: p,
                  transform: `scaleX(${0.6 + 0.4 * p})`,
                  transformOrigin: "left",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{b.range}</div>
                <div style={{ fontSize: 21, fontWeight: 700, marginTop: 4 }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

const STACK = [
  { name: "Python", color: "#3776ab" },
  { name: "FastAPI", color: "#009688" },
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Node.js", color: "#5fa04e" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "PostgreSQL", color: "#4169e1" },
  { name: "Vector store", color: "#c4b5fd" },
  { name: "Neo4j", color: "#018bff" },
  { name: "Docker", color: "#2496ed" },
  { name: "OpenRouter LLMs", color: "#f472b6" },
];

export const TechStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene tint="mixed">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 180 }}>
        <Kicker label="Under the hood" />
        <Words text="Built on a proven, open stack." size={70} delay={6} style={{ marginTop: 18, textAlign: "center" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 1500, marginTop: 70 }}>
          {STACK.map((t, i) => {
            const s = spring({ frame: frame - 26 - i * 5, fps, config: { damping: 12 } });
            return (
              <div
                key={t.name}
                style={{
                  ...glass,
                  borderRadius: 999,
                  padding: "18px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 32,
                  fontWeight: 700,
                  opacity: Math.min(1, s),
                  transform: `scale(${0.5 + 0.5 * s})`,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: 7, background: t.color }} />
                {t.name}
              </div>
            );
          })}
        </div>
        <Body delay={95} size={28} style={{ marginTop: 70, textAlign: "center", maxWidth: 1300 }}>
          A modular scraper for each portal means adding a new agency, state or country is a plug-in adapter, not a rebuild.
        </Body>
      </AbsoluteFill>
    </Scene>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 2, fps, config: { damping: 12 } });
  const black = interpolate(frame, [205, 240], [0, 1], clamp);

  return (
    <Scene tint="mixed">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${logo})` }}>
          <LogoMark size={130} />
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -5, marginTop: 24, paddingRight: 10, lineHeight: 1.1, opacity: progress(frame, 10, 20), ...gradientText }}>
          Auditly
        </div>
        <Words text="Follow every rupee after the contract is awarded." size={50} weight={600} delay={30} style={{ textAlign: "center", marginTop: 6 }} />
        <FadeUp delay={80} style={{ marginTop: 70, textAlign: "center" }}>
          <div style={{ fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: C.pink, fontWeight: 700 }}>Team Auditly</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.88)", marginTop: 12 }}>
            Shreesha Aithal · Pranav S Salian · Jnandeep Rai · Shetty Akash Sadashiv
          </div>
        </FadeUp>
        <FadeUp delay={110} style={{ marginTop: 34 }}>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)" }}>Manipal Hackathon 2026 · Smart Governance & Compliance</div>
        </FadeUp>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "black", opacity: black }} />
    </Scene>
  );
};
