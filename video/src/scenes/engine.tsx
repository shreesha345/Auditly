import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Cpu,
  Database,
  FileCheck,
  FileText,
  Globe,
  HardHat,
  Landmark,
  LoaderCircle,
  Receipt,
  ScanSearch,
  ScanText,
  Server,
  Sparkles,
  TriangleAlert,
  UserRoundX,
} from "lucide-react";
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Body, card, clamp, FadeUp, glass, IconCircle, Kicker, progress, Ring, Scene, TYPE_TONE, Words } from "../components";
import { C } from "../theme";

// ───────────────────────── Pipeline ─────────────────────────

type PNode = { id: string; x: number; y: number; title: string; sub: string; icon: LucideIcon; at: number; hl?: boolean };
const PW = 236;
const PH = 170;
const PNODES: PNode[] = [
  { id: "data", x: 160, y: 560, title: "Public data", sub: "Procurement portals, tender sites, public records", icon: Globe, at: 30 },
  { id: "ingest", x: 455, y: 560, title: "Ingestion", sub: "Scrapers, OCR and LLM extraction", icon: ScanText, at: 55 },
  { id: "change", x: 760, y: 420, title: "AI Change Engine", sub: "Variation detection, evidence linking", icon: Cpu, at: 80, hl: true },
  { id: "match", x: 760, y: 700, title: "AI Matching Engine", sub: "Contractor profiling, match scoring", icon: Sparkles, at: 92, hl: true },
  { id: "store", x: 1065, y: 560, title: "Storage", sub: "PostgreSQL, vector store, Neo4j graph", icon: Database, at: 118 },
  { id: "api", x: 1370, y: 560, title: "Scoring API", sub: "FastAPI, Investigation Priority Score", icon: Server, at: 142 },
  { id: "gov", x: 1700, y: 420, title: "Government dashboard", sub: "Investigation queue", icon: Landmark, at: 166 },
  { id: "con", x: 1700, y: 700, title: "Contractor portal", sub: "Ranked opportunities", icon: HardHat, at: 176 },
];
const PEDGES = [
  ["data", "ingest"],
  ["ingest", "change"],
  ["ingest", "match"],
  ["change", "store"],
  ["match", "store"],
  ["store", "api"],
  ["api", "gov"],
  ["api", "con"],
];

const bez = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

export const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byId = Object.fromEntries(PNODES.map((n) => [n.id, n]));
  const flow = interpolate(frame, [190, 205], [0, 1], clamp);

  return (
    <Scene tint="violet">
      <div style={{ position: "absolute", left: 120, top: 70 }}>
        <Kicker label="How it works" />
        <Words text="From public records to action, end to end." size={62} delay={4} highlight={["action,"]} style={{ marginTop: 18 }} />
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {PEDGES.map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          const x1 = A.x + PW / 2;
          const x2 = B.x - PW / 2;
          const mx = (x1 + x2) / 2;
          const p = progress(frame, B.at - 12, 16);
          return (
            <g key={a + b}>
              <path
                d={`M ${x1} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${x2} ${B.y}`}
                fill="none"
                stroke="rgba(196,181,253,0.55)"
                strokeWidth={2.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
              {[0, 0.5].map((off) => {
                const t = (Math.max(0, frame - 190) / 45 + off + i * 0.11) % 1;
                return <circle key={off} cx={bez(t, x1, mx, mx, x2)} cy={bez(t, A.y, A.y, B.y, B.y)} r={5} fill={C.pink} opacity={flow} />;
              })}
            </g>
          );
        })}
      </svg>

      {PNODES.map((n) => {
        const s = spring({ frame: frame - n.at, fps, config: { damping: 14 } });
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x - PW / 2,
              top: n.y - PH / 2,
              width: PW,
              height: PH,
              borderRadius: 20,
              padding: 20,
              background: n.hl ? "linear-gradient(160deg, rgba(139,92,246,0.32), rgba(181,23,107,0.26))" : "rgba(255,255,255,0.06)",
              border: `1.5px solid ${n.hl ? "rgba(244,114,182,0.6)" : "rgba(255,255,255,0.15)"}`,
              opacity: Math.min(1, s),
              transform: `scale(${0.7 + 0.3 * s})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconCircle icon={n.icon} size={44} bg={n.hl ? C.accent : "rgba(255,255,255,0.14)"} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>{n.title}</div>
            </div>
            <div style={{ fontSize: 17, color: "rgba(255,255,255,0.68)", marginTop: 14, lineHeight: 1.35 }}>{n.sub}</div>
          </div>
        );
      })}

      <div style={{ position: "absolute", top: 860, left: 200, right: 200, textAlign: "center" }}>
        <Body delay={196} size={28}>
          Public data is ingested and parsed, run through AI change detection and matching, stored across three purpose-built stores, then served through one scoring API
          into both apps.
        </Body>
      </div>
    </Scene>
  );
};

// ───────────────────────── 01 Change Detector ─────────────────────────

const DIFF = [
  { label: "Contract value", type: "Cost", before: "₹48.20 Cr", after: "₹61.90 Cr", chip: "+₹13.7 Cr (+28.4%) since award" },
  { label: "Completion", type: "Timeline", before: "30 Jun 2026", after: "31 Jan 2027", chip: "+215 days late" },
  { label: "Scope", type: "Scope", before: "6 culverts", after: "9 culverts, +1.1 km drain", chip: "3 extra culverts, drain realignment" },
  { label: "Materials", type: "Materials", before: "VG-30 bitumen, 40 mm", after: "VG-40 bitumen, 50 mm", chip: "Bitumen grade and layer changed" },
  { label: "Subcontractors", type: "Subcontractor", before: "1 declared at bid", after: "2 on site", chip: "34% of work sub-let to a new firm" },
] as const;

export const ChangeDetector: React.FC = () => {
  const frame = useCurrentFrame();
  const BEAM = 85;
  const STEP = 28;
  const ROW_H = 100;
  const reveal = (i: number) => BEAM + (i + 0.5) * STEP;
  const beamP = interpolate(frame, [BEAM, BEAM + 5 * STEP], [0, 1], clamp);
  const beamO = interpolate(frame, [BEAM - 8, BEAM, BEAM + 5 * STEP, BEAM + 5 * STEP + 12], [0, 1, 1, 0], clamp);
  const value = interpolate(frame, [reveal(0), reveal(0) + 22], [48.2, 61.9], clamp);
  const cardIn = progress(frame, 18, 26);
  const banner = progress(frame, 250, 20);

  return (
    <Scene tint="violet">
      <div style={{ position: "absolute", left: 110, top: 130, width: 630 }}>
        <Kicker index="01" label="Contract Change Detector" />
        <Words text="Catch every change after the award." size={60} delay={6} highlight={["change"]} style={{ marginTop: 22 }} />
        <Body delay={36} size={26} style={{ marginTop: 22 }}>
          Auditly continuously compares the awarded contract against amendments, progress reports and payments, and flags deviations the moment they appear.
        </Body>
        <div style={{ marginTop: 34 }}>
          {DIFF.map((d, i) => (
            <FadeUp key={d.label} delay={reveal(i) + 8} distance={14}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <Badge tone={TYPE_TONE[d.type]} size={19}>
                  {d.type}
                </Badge>
                <span style={{ fontSize: 23, color: "rgba(255,255,255,0.88)" }}>{d.chip}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <div style={{ ...card, position: "absolute", left: 800, top: 150, width: 1010, overflow: "hidden", opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)` }}>
        <div style={{ padding: "26px 36px", background: C.surface, borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 17, letterSpacing: 2, color: C.muted, fontWeight: 600 }}>KA-PWD-2025-0142 · ROADS</div>
          <div style={{ fontSize: 31, fontWeight: 700, marginTop: 6 }}>NH-66 service road widening, Mangaluru–Udupi</div>
          <div style={{ fontSize: 19, color: C.muted, marginTop: 4 }}>Karnataka PWD · Awarded to Sahyadri Roadways Ltd</div>
        </div>
        <div style={{ display: "flex", padding: "14px 36px", fontSize: 15, letterSpacing: 1.5, color: C.muted, fontWeight: 700, borderBottom: `1px solid ${C.line}` }}>
          <div style={{ width: 200 }}>FIELD</div>
          <div style={{ width: 280 }}>AT AWARD</div>
          <div>CURRENT (DETECTED)</div>
        </div>
        <div style={{ position: "relative" }}>
          {DIFF.map((d, i) => {
            const p = progress(frame, reveal(i), 14);
            return (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: ROW_H,
                  padding: "0 36px",
                  borderBottom: i < DIFF.length - 1 ? `1px solid ${C.line}` : "none",
                  background: `rgba(181,23,107,${p * 0.06})`,
                }}
              >
                <div style={{ width: 200, fontSize: 21, fontWeight: 600 }}>{d.label}</div>
                <div style={{ width: 280, fontSize: 21, color: C.muted }}>{d.before}</div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>{i === 0 ? `₹${value.toFixed(2)} Cr` : d.after}</span>
                  <Badge tone={TYPE_TONE[d.type]} size={15}>
                    {d.type}
                  </Badge>
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: beamP * DIFF.length * ROW_H - 2,
              height: 4,
              background: "linear-gradient(90deg, transparent, #f472b6, #8b5cf6, transparent)",
              boxShadow: "0 0 24px 6px rgba(244,114,182,0.45)",
              opacity: beamO,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 36px", background: C.primary, color: "white", fontSize: 22, fontWeight: 600, opacity: banner }}>
          <ScanSearch size={26} /> 5 deviations flagged <ArrowRight size={22} /> sent to the Evidence Linker for verification
        </div>
      </div>
    </Scene>
  );
};

// ───────────────────────── 02 Evidence Linker ─────────────────────────

const STATUS = {
  verified: { text: "Verified", color: "#047857", bg: "#ecfdf5", icon: CircleCheck },
  partial: { text: "Partially verified", color: "#b45309", bg: "#fffbeb", icon: TriangleAlert },
  missing: { text: "Missing", color: "#b91c1c", bg: "#fef2f2", icon: CircleX },
  mismatch: { text: "Contradicts billing", color: "#b45309", bg: "#fffbeb", icon: TriangleAlert },
} as const;

const EVIDENCE = [
  { label: "Approval", icon: FileCheck, status: "missing", note: "Never approved by the design wing" },
  { label: "Change order", icon: FileText, status: "missing", note: "Not covered by any change order" },
  { label: "Inspection report", icon: ClipboardCheck, status: "mismatch", note: "Core samples show 42 mm, not 50 mm" },
  { label: "Invoice", icon: Receipt, status: "missing", note: "Bitumen purchase invoices never submitted" },
] as const;

const OTHER = [
  { title: "Completion extended by 7 months", type: "Timeline", status: "verified", note: "Signed extension order, site diary confirms delay" },
  { title: "Bill of quantities revised", type: "Cost", status: "partial", note: "Estimate approved, ₹9.4 Cr not in any change order" },
] as const;

const LEGEND = [
  { icon: CircleCheck, color: C.green, title: "Verified", body: "Every relevant document checks out" },
  { icon: TriangleAlert, color: C.amber, title: "Partially verified", body: "Some evidence is missing or contradicts billing" },
  { icon: CircleX, color: C.red, title: "Unverified", body: "Nothing on record supports the change" },
];

const StatusPill: React.FC<{ status: keyof typeof STATUS; scale?: number }> = ({ status, scale = 1 }) => {
  const st = STATUS[status];
  const Icon = st.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: st.bg,
        color: st.color,
        borderRadius: 999,
        padding: "5px 14px",
        fontSize: 18,
        fontWeight: 700,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      <Icon size={18} /> {st.text}
    </span>
  );
};

export const EvidenceLinker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = progress(frame, 14, 24);
  const stamp = spring({ frame: frame - 205, fps, config: { damping: 11, mass: 0.9 } });

  return (
    <Scene tint="pink">
      <div style={{ position: "absolute", left: 110, top: 130, width: 620 }}>
        <Kicker index="02" label="Evidence Linker" />
        <Words text="Every change, checked against the paper trail." size={58} delay={6} highlight={["paper", "trail."]} style={{ marginTop: 22 }} />
        <Body delay={36} size={26} style={{ marginTop: 22 }}>
          Each flagged change is matched against approvals, change orders, inspection reports and invoices, then marked verified, partially verified or unverified.
        </Body>
        <div style={{ marginTop: 38 }}>
          {LEGEND.map((l, i) => (
            <FadeUp key={l.title} delay={235 + i * 14} distance={14}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <IconCircle icon={l.icon} size={46} bg={l.color} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{l.title}</div>
                  <div style={{ fontSize: 20, color: "rgba(255,255,255,0.65)" }}>{l.body}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 800, top: 110, width: 1010, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)` }}>
        <div style={{ ...card, padding: "26px 34px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Badge tone="amber" size={17}>
              Materials
            </Badge>
            <span style={{ fontSize: 19, color: C.muted }}>Flagged 10 Mar 2026</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 12 }}>Bitumen grade and layer thickness changed</div>
          <div style={{ display: "flex", gap: 16, marginTop: 18, alignItems: "center" }}>
            <div style={{ flex: 1, background: C.surface, borderRadius: 14, padding: "12px 18px" }}>
              <div style={{ fontSize: 14, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>BEFORE</div>
              <div style={{ fontSize: 23, fontWeight: 600 }}>VG-30 bitumen, 40 mm layer</div>
            </div>
            <ArrowRight size={26} color={C.muted} />
            <div style={{ flex: 1, background: C.accentSoft, borderRadius: 14, padding: "12px 18px" }}>
              <div style={{ fontSize: 14, letterSpacing: 1.5, color: C.muted, fontWeight: 700 }}>AFTER</div>
              <div style={{ fontSize: 23, fontWeight: 700, color: C.accent }}>VG-40 bitumen, 50 mm layer</div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 24,
              top: 12,
              opacity: Math.min(1, stamp * 1.5),
              transform: `rotate(-9deg) scale(${2.2 - 1.2 * stamp})`,
              border: `5px solid ${C.red}`,
              color: C.red,
              borderRadius: 12,
              padding: "2px 18px",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 4,
              background: "rgba(255,255,255,0.94)",
            }}
          >
            UNVERIFIED
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          {EVIDENCE.map((e, i) => {
            const at = 55 + i * 34;
            const resolved = at + 28;
            const p = progress(frame, at, 16);
            const r = progress(frame, resolved, 12);
            return (
              <div key={e.label} style={{ ...card, padding: "20px 26px", height: 186, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconCircle icon={e.icon} size={46} bg={C.primarySoft} color={C.primary} />
                  <span style={{ fontSize: 24, fontWeight: 700 }}>{e.label}</span>
                </div>
                <div style={{ marginTop: 12, height: 34, display: "flex", alignItems: "center" }}>
                  {frame < resolved ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: C.muted }}>
                      <LoaderCircle size={20} style={{ transform: `rotate(${frame * 14}deg)` }} /> Searching records…
                    </span>
                  ) : (
                    <StatusPill status={e.status} scale={0.85 + 0.15 * r} />
                  )}
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.4, color: "#4b4563", marginTop: 10, opacity: r }}>{e.note}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          {OTHER.map((o, i) => {
            const p = progress(frame, 265 + i * 16, 20);
            return (
              <div key={o.title} style={{ ...glass, padding: "18px 24px", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ fontSize: 15, letterSpacing: 1.5, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>OTHER CHANGES ON THIS CONTRACT</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{o.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <StatusPill status={o.status} />
                  <Badge tone={TYPE_TONE[o.type]} size={15}>
                    {o.type}
                  </Badge>
                </div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>{o.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

// ───────────────────────── 03 Priority Score ─────────────────────────

const FACTORS = [
  { label: "Financial variation", weight: 35, value: 88, detail: "Cost up 28.4%, in the top 5% for road works in the district" },
  { label: "Evidence gaps", weight: 30, value: 92, detail: "3 of 4 changes lack approvals or contradict billing" },
  { label: "Relationship signals", weight: 25, value: 95, detail: "New subcontractor shares a director with the prime contractor" },
  { label: "Timeline slippage", weight: 10, value: 60, detail: "+215 days, but a signed extension order exists" },
];

const REASON =
  "Cost is up 28% since award with no change order covering ₹9.4 Cr of it, and surfacing work was sub-let to a firm that shares a director with the prime contractor.";

export const PriorityScore: React.FC = () => {
  const frame = useCurrentFrame();
  const fills = FACTORS.map((_, i) => progress(frame, 55 + i * 28, 34));
  const score = FACTORS.reduce((sum, f, i) => sum + ((f.value * f.weight) / 100) * fills[i], 0);
  const ringColor = score >= 75 ? C.red : score >= 50 ? C.amber : C.green;
  const done = progress(frame, 180, 18);
  const typed = REASON.slice(0, Math.max(0, Math.floor((frame - 205) * 2.4)));
  const cursor = frame > 205 && Math.floor(frame / 8) % 2 === 0;

  return (
    <Scene tint="mixed">
      <div style={{ position: "absolute", left: 120, top: 60, width: 1680 }}>
        <Kicker index="03" label="Investigation Priority Score" />
        <Words text="Know exactly where to look first." size={62} delay={6} highlight={["first."]} style={{ marginTop: 18 }} />
        <Body delay={30} size={26} style={{ marginTop: 8, maxWidth: 1500 }}>
          Flagged contracts are ranked by financial variation, evidence gaps, relationship signals and timeline slippage, with a plain-language reason behind every
          score.
        </Body>
      </div>

      <FadeUp delay={20} style={{ position: "absolute", left: 120, top: 320 }}>
        <div style={{ ...card, width: 560, height: 650, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 36px" }}>
          <div style={{ fontSize: 17, letterSpacing: 2, color: C.muted, fontWeight: 700 }}>KA-PWD-2025-0142</div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>NH-66 service road widening</div>
          <div style={{ marginTop: 30 }}>
            <Ring value={score} size={300} stroke={24} color={ringColor}>
              <div style={{ fontSize: 110, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{Math.round(score)}</div>
              <div style={{ fontSize: 20, color: C.muted, marginTop: 6 }}>out of 100</div>
            </Ring>
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 12, opacity: done, transform: `scale(${0.9 + 0.1 * done})` }}>
            <Badge tone="red" size={22}>
              High priority
            </Badge>
            <Badge tone="primary" size={22}>
              #1 in queue
            </Badge>
          </div>
          <div style={{ marginTop: 24, fontSize: 19, color: C.muted, textAlign: "center", lineHeight: 1.45, opacity: progress(frame, 285, 20) }}>
            Scores rank where to look first. They are not a finding of wrongdoing.
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={30} style={{ position: "absolute", left: 720, top: 320 }}>
        <div style={{ ...card, width: 1080, padding: "12px 36px" }}>
          {FACTORS.map((f, i) => (
            <div key={f.label} style={{ padding: "13px 0", borderBottom: i < FACTORS.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 25, fontWeight: 700 }}>
                  {f.label} <span style={{ fontSize: 18, fontWeight: 500, color: C.muted }}>· weight {f.weight}%</span>
                </div>
                <div style={{ fontSize: 20, color: C.muted }}>
                  <b style={{ color: C.ink }}>{Math.round(f.value * fills[i])}</b>/100 → adds <b style={{ color: C.ink }}>{(((f.value * f.weight) / 100) * fills[i]).toFixed(1)}</b>
                </div>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: C.primarySoft, marginTop: 10, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${f.value * fills[i]}%`,
                    borderRadius: 6,
                    background: f.value >= 75 ? "linear-gradient(90deg, #f87171, #dc2626)" : "linear-gradient(90deg, #fbbf24, #d97706)",
                  }}
                />
              </div>
              <div style={{ fontSize: 18, color: "#57506e", marginTop: 8 }}>{f.detail}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      <div
        style={{
          ...card,
          position: "absolute",
          left: 720,
          top: 815,
          width: 1080,
          height: 155,
          padding: "20px 36px",
          background: C.primarySoft,
          border: "1px solid #d8cff0",
          opacity: progress(frame, 195, 16),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 700, color: C.primary, letterSpacing: 1.5 }}>
          <Sparkles size={20} /> WHY IT IS RANKED #1
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.ink, marginTop: 8 }}>
          {typed}
          <span style={{ opacity: cursor ? 1 : 0, color: C.accent }}>|</span>
        </div>
      </div>
    </Scene>
  );
};

// ───────────────────────── Relationship graph ─────────────────────────

const PANEL = { left: 700, top: 140, width: 1120, height: 580 };
const NODE_W = 190;
const NODE_H = 72;

const KIND_STYLE = {
  Agency: { bg: C.primary, border: "#6d5bb5", color: "#ffffff" },
  Official: { bg: C.primarySoft, border: "#c9bfe6", color: C.primary },
  Person: { bg: C.accentSoft, border: "#eab2cf", color: "#8a1152" },
  "Prime contractor": { bg: "#ffffff", border: C.primary, color: C.ink },
  Subcontractor: { bg: "#ffffff", border: "#c9bfe6", color: C.ink },
} as const;

const GNODES = [
  { id: "ag", label: "Karnataka PWD", kind: "Agency", x: 120, y: 290, at: 20 },
  { id: "o1", label: "Engineer R. Shenoy", kind: "Official", x: 425, y: 150, at: 55 },
  { id: "p1", label: "Director K. Hegde", kind: "Person", x: 425, y: 430, at: 112 },
  { id: "c", label: "Sahyadri Roadways", kind: "Prime contractor", x: 720, y: 290, at: 36 },
  { id: "s2", label: "Netravati Earthmovers", kind: "Subcontractor", x: 990, y: 150, at: 72 },
  { id: "s1", label: "Coastal Aggregates", kind: "Subcontractor", x: 990, y: 430, at: 90 },
] as const;

const GEDGES = [
  { a: "ag", b: "c", label: "Awarded ₹48.2 Cr", at: 48, bad: false },
  { a: "ag", b: "o1", label: "Oversees", at: 64, bad: false },
  { a: "c", b: "s2", label: "Sub-let 12%", at: 84, bad: false },
  { a: "c", b: "s1", label: "Sub-let 34%", at: 100, bad: true },
  { a: "p1", b: "c", label: "Director", at: 126, bad: false },
  { a: "p1", b: "s1", label: "Director", at: 146, bad: true },
];

export const Relationships: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byId = Object.fromEntries(GNODES.map((n) => [n.id, n])) as Record<string, (typeof GNODES)[number]>;
  const panelIn = progress(frame, 8, 22);
  const alarm = progress(frame, 160, 20);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
  const callout = progress(frame, 185, 22);

  return (
    <Scene tint="pink">
      <div style={{ position: "absolute", left: 110, top: 150, width: 540 }}>
        <Kicker label="Relationship signals" />
        <Words text="Surface the links hidden between parties." size={58} delay={6} highlight={["hidden"]} style={{ marginTop: 22 }} />
        <Body delay={34} size={25} style={{ marginTop: 22 }}>
          Award records, company registries and site documents are joined into a graph that reveals shared directors, related owners and newly formed subcontractors.
        </Body>
        <FadeUp delay={170} style={{ marginTop: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 21, color: "rgba(255,255,255,0.8)" }}>
            <span style={{ width: 48, borderTop: "3px solid #c4b5fd" }} /> Known relationship
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 21, color: "rgba(255,255,255,0.8)", marginTop: 14 }}>
            <span style={{ width: 48, borderTop: `3px dashed ${C.red}` }} /> Flagged link, feeds the priority score
          </div>
        </FadeUp>
      </div>

      <div style={{ ...glass, position: "absolute", ...PANEL, opacity: panelIn, overflow: "hidden" }}>
        <svg width={PANEL.width} height={PANEL.height} style={{ position: "absolute", inset: 0 }}>
          {GEDGES.map((e) => {
            const A = byId[e.a];
            const B = byId[e.b];
            const x1 = A.x + NODE_W / 2;
            const x2 = B.x - NODE_W / 2;
            const mx = (x1 + x2) / 2;
            const d = `M ${x1} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${x2} ${B.y}`;
            const p = progress(frame, e.at, 16);
            return (
              <g key={e.a + e.b}>
                {e.bad ? (
                  <path d={d} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="10 7" strokeDashoffset={-frame * 0.9} opacity={p * (0.75 + 0.25 * pulse * alarm)} />
                ) : (
                  <path d={d} fill="none" stroke="rgba(196,181,253,0.75)" strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                )}
                <text
                  x={mx}
                  y={(A.y + B.y) / 2 - 10}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={600}
                  fill={e.bad ? "#fca5a5" : "rgba(255,255,255,0.75)"}
                  stroke="#1a1030"
                  strokeWidth={5}
                  style={{ paintOrder: "stroke" }}
                  opacity={progress(frame, e.at + 10, 12)}
                >
                  {e.label}
                </text>
              </g>
            );
          })}
        </svg>
        {GNODES.map((n) => {
          const s = spring({ frame: frame - n.at, fps, config: { damping: 14 } });
          const st = KIND_STYLE[n.kind];
          const bad = n.id === "s1" || n.id === "p1";
          return (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: n.x - NODE_W / 2,
                top: n.y - NODE_H / 2,
                width: NODE_W,
                height: NODE_H,
                borderRadius: 14,
                background: st.bg,
                border: `2px solid ${bad && alarm > 0.05 ? C.red : st.border}`,
                color: st.color,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                opacity: Math.min(1, s),
                transform: `scale(${0.6 + 0.4 * s})`,
                boxShadow: bad ? `0 0 ${alarm * (18 + 14 * pulse)}px rgba(220,38,38,${0.75 * alarm})` : "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, padding: "0 8px" }}>{n.label}</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 3 }}>{n.kind}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...card,
          position: "absolute",
          left: 700,
          top: 755,
          width: 1120,
          padding: "26px 34px",
          display: "flex",
          gap: 24,
          borderLeft: `8px solid ${C.red}`,
          opacity: callout,
          transform: `translateY(${(1 - callout) * 30}px)`,
        }}
      >
        <IconCircle icon={UserRoundX} size={64} bg="#fef2f2" color={C.red} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Shared director detected</div>
          <div style={{ fontSize: 22, lineHeight: 1.5, color: "#4b4563", marginTop: 6 }}>
            K. Hegde is a director of both the prime contractor and its new subcontractor, Coastal Aggregates & Paving, a firm incorporated 5 months after the contract
            was awarded.
          </div>
        </div>
      </div>
    </Scene>
  );
};
