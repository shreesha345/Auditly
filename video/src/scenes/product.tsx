import { Award, CircleCheck, CircleX, Factory, IndianRupee, Lightbulb, MapPin, Route, Sparkles, TriangleAlert } from "lucide-react";
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Body, BrowserFrame, card, clamp, IconCircle, Kicker, progress, Ring, Scene, Words } from "../components";
import { C } from "../theme";

type Shot = { src: string; url: string; title: string; caption: string; scrollTo: number };

const ProductMontage: React.FC<{ kicker: string; title: string; color: string; tint: "violet" | "pink"; shots: Shot[]; per: number }> = ({
  kicker,
  title,
  color,
  tint,
  shots,
  per,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = Math.min(shots.length - 1, Math.floor(frame / per));
  const enter = spring({ frame: frame - 6, fps, config: { damping: 20 } });
  const W = 1330;
  const H = 800;

  return (
    <Scene tint={tint}>
      <div style={{ position: "absolute", left: 90, top: 60 }}>
        <Kicker label={kicker} color={color} />
        <Words text={title} size={52} delay={4} style={{ marginTop: 14 }} />
      </div>

      <div style={{ position: "absolute", left: 90, top: 250, width: 370 }}>
        {shots.map((s, i) => {
          const on = i === active;
          const p = progress(frame, i * per + 4, 16);
          return (
            <div key={s.title} style={{ borderLeft: `4px solid ${on ? color : "rgba(255,255,255,0.14)"}`, padding: "8px 0 8px 22px", marginBottom: 18, opacity: on ? 1 : 0.45 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: on ? color : "rgba(255,255,255,0.6)" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>{s.title}</div>
              {on && <div style={{ fontSize: 21, lineHeight: 1.45, color: "rgba(255,255,255,0.78)", marginTop: 8, opacity: p }}>{s.caption}</div>}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 500,
          top: 190,
          width: W,
          height: H,
          opacity: Math.min(1, enter),
          transform: `perspective(2200px) rotateY(${(1 - enter) * -12}deg) translateX(${(1 - enter) * 80}px)`,
        }}
      >
        {shots.map((s, i) => {
          const start = i * per;
          if (frame < start || frame > start + per + 18) return null;
          const local = frame - start;
          const fade = i === 0 ? 1 : progress(local, 0, 16);
          const zoom = 1.035 - 0.035 * progress(local, 0, 30);
          const scroll = interpolate(local, [14, per + 10], [0, s.scrollTo], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          return (
            <div key={s.src} style={{ position: "absolute", inset: 0, opacity: fade, transform: `scale(${zoom})` }}>
              <BrowserFrame src={s.src} url={s.url} width={W} height={H} scroll={scroll} />
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

const GOV_SHOTS: Shot[] = [
  {
    src: "shots/gov-dashboard.png",
    url: "auditly.app/gov",
    title: "Oversight dashboard",
    caption: "Contracts monitored, flagged changes, the value of unverified changes and six-month trends at a glance.",
    scrollTo: 0.6,
  },
  {
    src: "shots/gov-queue.png",
    url: "auditly.app/gov/queue",
    title: "Investigation queue",
    caption: "Every flagged contract ranked by priority score, with a one-line reason, change types and evidence gaps.",
    scrollTo: 0.35,
  },
  {
    src: "shots/gov-contract.png",
    url: "auditly.app/gov/contracts/KA-PWD-2025-0142",
    title: "Contract deep-dive",
    caption: "Awarded vs current terms, change timeline, evidence checklist, score breakdown and relationship graph.",
    scrollTo: 0.55,
  },
  {
    src: "shots/gov-alerts.png",
    url: "auditly.app/gov/alerts",
    title: "Detected changes feed",
    caption: "Every new variation as it is found, newest first, with its verification status.",
    scrollTo: 0.35,
  },
];

const CONTRACTOR_SHOTS: Shot[] = [
  {
    src: "shots/contractor-home.png",
    url: "auditly.app/contractor",
    title: "Contractor overview",
    caption: "Matched tenders, average fit, deadlines closing soon and what to add to the profile.",
    scrollTo: 0.5,
  },
  {
    src: "shots/contractor-tenders.png",
    url: "auditly.app/contractor/tenders",
    title: "Matched tenders",
    caption: "Open tenders from every portal, ranked by fit and filterable by category, fit and deadline.",
    scrollTo: 0.45,
  },
  {
    src: "shots/contractor-tender.png",
    url: "auditly.app/contractor/tenders/KPPP-PWD-UDP-2026-118",
    title: "Tender detail",
    caption: "Why it matches, the eligibility checklist, gaps with fixes, key dates and premium deep analysis.",
    scrollTo: 0.55,
  },
  {
    src: "shots/contractor-profile.png",
    url: "auditly.app/contractor/profile",
    title: "Capability profile",
    caption: "Turnover, certifications, plant, regions and past projects, extracted from uploaded documents.",
    scrollTo: 0.5,
  },
];

export const GovProduct: React.FC = () => (
  <ProductMontage kicker="The product · Government app" title="Built for governments & auditors" color="#a78bfa" tint="violet" per={100} shots={GOV_SHOTS} />
);

export const ContractorProduct: React.FC = () => (
  <ProductMontage kicker="The product · Contractor app" title="Built for contractors & SMEs" color={C.pink} tint="pink" per={88} shots={CONTRACTOR_SHOTS} />
);

// ───────────────────────── 04 Tender Matching ─────────────────────────

const CAPS = [
  { icon: IndianRupee, text: "₹21.6 Cr average turnover", ok: true },
  { icon: Route, text: "3 state highway resurfacing works", ok: true },
  { icon: Factory, text: "Hot-mix plant at Mulki", ok: true },
  { icon: Award, text: "ISO 9001 · ISO 14001", ok: true },
  { icon: MapPin, text: "Active in 4 coastal districts", ok: true },
  { icon: TriangleAlert, text: "ISO 45001 expired Jun 2026", ok: false },
];

const ELIG = [
  { c: "Contractor class: Class I (PWD)", yours: "Class I (PWD)", met: true },
  { c: "Average turnover ≥ ₹8 Cr", yours: "₹21.6 Cr", met: true },
  { c: "1 similar work ≥ ₹6 Cr", yours: "3 works, largest ₹14.2 Cr", met: true },
  { c: "Hot-mix plant within 60 km", yours: "Mulki, 38 km", met: true },
  { c: "ISO 45001 safety certificate", yours: "Expired Jun 2026", met: false },
];

export const TenderMatching: React.FC = () => {
  const frame = useCurrentFrame();
  const fit = interpolate(frame, [110, 170], [0, 92], { ...clamp, easing: Easing.out(Easing.cubic) });
  const profileIn = progress(frame, 16, 22);
  const tenderIn = progress(frame, 40, 22);
  const flow = interpolate(frame, [80, 95, 175, 195], [0, 1, 1, 0], clamp);
  const hub = progress(frame, 80, 16);
  const gap = progress(frame, 272, 18);

  return (
    <Scene tint="pink">
      <div style={{ position: "absolute", left: 110, top: 55, width: 1700 }}>
        <Kicker index="04" label="AI Tender Matching Engine" />
        <Words text="The right tenders, for the right contractors." size={56} delay={6} highlight={["right"]} style={{ marginTop: 16 }} />
        <Body delay={30} size={25} style={{ marginTop: 6, maxWidth: 1550 }}>
          Auditly profiles each contractor&apos;s capability, scores it against open tenders from every portal, and explains the match, the gaps and the deadlines in
          plain language.
        </Body>
      </div>

      <div style={{ ...card, position: "absolute", left: 110, top: 300, width: 500, height: 510, padding: "28px 30px", opacity: profileIn, transform: `translateX(${(1 - profileIn) * -40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: C.accent, color: "white", fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            KI
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Karavali Infra Builders</div>
            <div style={{ fontSize: 18, color: C.muted }}>PWD Class I · Mangaluru</div>
          </div>
        </div>
        <div style={{ fontSize: 15, letterSpacing: 2, fontWeight: 700, color: C.muted, marginTop: 22 }}>CAPABILITY PROFILE · EXTRACTED BY AI</div>
        <div style={{ marginTop: 8 }}>
          {CAPS.map((c, i) => {
            const p = progress(frame, 34 + i * 9, 16);
            return (
              <div
                key={c.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  height: 52,
                  borderBottom: i < CAPS.length - 1 ? `1px solid ${C.line}` : "none",
                  opacity: p,
                  transform: `translateX(${(1 - p) * -16}px)`,
                }}
              >
                <IconCircle icon={c.icon} size={40} bg={c.ok ? C.primarySoft : "#fef2f2"} color={c.ok ? C.primary : C.red} />
                <span style={{ fontSize: 21, fontWeight: 500, color: c.ok ? C.ink : "#b91c1c" }}>{c.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: flow }}>
        {[0, 1, 2].map((k) => {
          const y1 = 520 + k * 120;
          const y2 = 610 + k * 30;
          return (
            <g key={k}>
              <line x1={612} y1={y1} x2={788} y2={y2} stroke="rgba(244,114,182,0.35)" strokeWidth={2} strokeDasharray="4 6" />
              {[0, 0.5].map((o) => {
                const t = (frame / 24 + o + k * 0.2) % 1;
                return <circle key={o} cx={612 + 176 * t} cy={y1 + (y2 - y1) * t} r={5} fill={C.pink} />;
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 700 - 36, top: 640 - 36, transform: `scale(${hub * (0.93 + 0.07 * Math.sin(frame / 6))})` }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            background: "linear-gradient(135deg, #8b5cf6, #b5176b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(244,114,182,0.6)",
          }}
        >
          <Sparkles size={34} color="white" />
        </div>
      </div>

      <div style={{ ...card, position: "absolute", left: 790, top: 300, width: 1020, height: 690, padding: "28px 36px", opacity: tenderIn, transform: `translateX(${(1 - tenderIn) * 40}px)` }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ opacity: progress(frame, 295, 16), height: 30 }}>
              <Badge tone="accent" size={16}>
                Ranked #1 of 8 matches today
              </Badge>
            </div>
            <div style={{ fontSize: 29, fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>Resurfacing of Karkala–Moodbidri SH-37 (18 km)</div>
            <div style={{ fontSize: 19, color: C.muted, marginTop: 6 }}>Karnataka PWD, Udupi · KPPP portal</div>
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <Badge tone="primary" size={17}>
                Roads
              </Badge>
              <Badge tone="gray" size={17}>
                ₹12.40 Cr
              </Badge>
              <Badge tone="gray" size={17}>
                Karkala, Udupi
              </Badge>
              <Badge tone="red" size={17}>
                11 days left
              </Badge>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Ring value={fit} size={150} stroke={14} color={C.green}>
              <div style={{ fontSize: 42, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{Math.round(fit)}%</div>
              <div style={{ fontSize: 15, color: C.muted }}>fit</div>
            </Ring>
            <div style={{ marginTop: 8, opacity: progress(frame, 172, 14) }}>
              <Badge tone="green" size={16}>
                Strong match
              </Badge>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: C.line, margin: "18px 0 14px" }} />
        <div style={{ fontSize: 15, letterSpacing: 2, fontWeight: 700, color: C.muted, opacity: progress(frame, 172, 14) }}>
          ELIGIBILITY CHECKLIST · 4 OF 5 MET · EXTRACTED FROM THE TENDER DOCUMENT
        </div>
        <div style={{ marginTop: 4 }}>
          {ELIG.map((e, i) => {
            const p = progress(frame, 182 + i * 16, 12);
            const Icon = e.met ? CircleCheck : CircleX;
            return (
              <div
                key={e.c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  height: 48,
                  padding: "0 8px",
                  borderBottom: i < ELIG.length - 1 ? `1px solid ${C.line}` : "none",
                  opacity: p,
                  background: e.met ? "transparent" : `rgba(254,226,226,${0.7 * p})`,
                }}
              >
                <Icon size={26} color={e.met ? C.green : C.red} style={{ transform: `scale(${0.5 + 0.5 * p})` }} />
                <span style={{ flex: 1, fontSize: 21, fontWeight: 500 }}>{e.c}</span>
                <span style={{ fontSize: 20, color: e.met ? "#4b4563" : "#b91c1c", fontWeight: e.met ? 500 : 700 }}>{e.yours}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, borderRadius: 14, background: "#fffbeb", border: "1px solid #fcd34d", padding: "14px 20px", opacity: gap, transform: `translateY(${(1 - gap) * 16}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700, color: "#92400e" }}>
            <TriangleAlert size={22} /> Gap: the ISO 45001 safety certificate expired in June 2026
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, color: "#4b4563", marginTop: 6 }}>
            <Lightbulb size={22} color={C.accent} /> Fix: upload the renewed certificate before the 24 Sep bid deadline
          </div>
        </div>
      </div>
    </Scene>
  );
};
