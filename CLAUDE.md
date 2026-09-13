# Auditly

AI-powered public procurement intelligence platform. Built for **Manipal Hackathon 2026**, track **Smart Governance & Compliance**.

- **Problem statement:** Unverified Post-Award Subcontractor Variations
- **Solution title:** Auditly, an AI Powered Public Procurement Intelligence Platform
- **Team:** Shreesha Aithal, Pranav S Salian, Jnandeep Rai, Shetty Akash Sadashiv
- **Source of truth for the pitch:** `Auditly_UnverifiedPostAwardSubcontractorVariations.pdf` (repo root)

---

## 1. The problem (two audiences, one broken system)

| Audience | Pain |
|---|---|
| **Governments / auditors** | They lose the thread. Contractors, scopes and costs shift quietly after award, and the evidence is scattered across systems (approvals, change orders, inspection reports, invoices). |
| **Contractors / SMEs** | They can't find tenders that fit them. Tenders are scattered across portals, and eligibility rules are buried in dense documents. |

Auditly connects both sides through **one shared intelligence layer**.

## 2. Core modules

1. **Contract Change Detector:** continuously compares the awarded contract against amendments, progress reports and payments. It flags deviations in **cost, scope, materials, timeline or subcontractors**.
2. **Evidence Linker:** checks every flagged change against **approvals, change orders, inspection reports and invoices**, and marks it **verified / partially verified / unverified**.
3. **Investigation Priority Score:** ranks flagged contracts using **financial variation, evidence gaps and relationship signals** (plus timeline slippage), with a **plain-language reason for every score**.
4. **AI Tender Matching Engine:** profiles contractor capability, scores fit against open tenders, and explains the **match, gaps and deadlines** in plain language.

## 3. Architecture (target system)

```
Public procurement data          Ingestion layer             AI Change Engine            Storage layer              API & scoring layer        Apps
(portals, tender sites,   ──▶    (scrapers, OCR,     ──┬──▶  (variation detection, ──┐   PostgreSQL          ──▶    FastAPI,            ──┬──▶ Government dashboard
 public records)                  LLM extraction)       │     evidence linking)       ├─▶ Vector store                Investigation         │     (investigation queue)
                                                        └──▶  AI Matching Engine    ──┘   Neo4j (relationships)       Priority Score        └──▶ Contractor portal
                                                              (contractor profiling,                                                               (ranked opportunities)
                                                               match scoring)
```

- **PostgreSQL** holds contracts, variations, evidence, tenders and contractor profiles.
- **Vector store** holds document embeddings for matching and semantic search.
- **Neo4j** holds the relationship graph (agency ↔ officials ↔ contractors ↔ subcontractors ↔ directors/owners).
- **Scrapers are modular, one adapter per portal**, so a new agency, state or country is a new adapter, not a core rebuild.

### Tech stack
Python · FastAPI · React · Node.js · PostgreSQL · Neo4j · Docker · TypeScript · OpenRouter (LLM access)

The **frontend is Next.js** (React + TypeScript, App Router).

## 4. 36-hour build plan (Round 2)

| Hours | Work |
|---|---|
| 0 – 8 | Ingestion and document parsing on sample data |
| 8 – 20 | Change detection, evidence linking and matching engines |
| 20 – 30 | Government and contractor facing dashboards |
| 30 – 36 | End-to-end integration, testing and demo polish |

## 5. Feasibility

- **Technical:** tender portals and contract documents are digitized well enough for LLM extraction. Mature diff and embedding models make change detection tractable.
- **Data:** most government procurement portals already publish tenders, awards and amendments openly, so no new disclosure laws are needed.
- **Scalability:** a cloud-native pipeline with a modular scraper per portal.
- **Team:** full stack, NLP document parsing, and graph-based relationship modelling.

## 6. Business strategy

**Who it serves:** government procurement officers and auditors; corruption watchdogs and oversight bodies; contractors and SMEs bidding on public tenders; journalists and civic tech researchers.

**Business model:**
- Subscription licensing for government agencies and oversight bodies
- Freemium tender matching for contractors (free to browse and match)
- Premium tier for deep eligibility analysis and deadline alerts
- Data licensing for research and civic transparency partners

**Impact (UN SDG 16):** transparency in public spending across the contract lifecycle; accountability through evidence-linked audit trails; access to opportunities for smaller legitimate contractors; evidence-based oversight in place of blanket suspicion.

**Roadmap:**
- **MVP:** change detector + evidence linker on sample data
- **V2:** priority scoring + relationship graph
- **V3:** contractor-facing tender matching engine
- **Pilot:** live pilot with a state procurement portal

---

## 7. Current phase: UI/UX prototype (frontend only)

**Scope right now:** a clickable prototype of both apps with **realistic mock data and no backend**. There are no API calls, no auth and no database. Every number on screen comes from `frontend/src/lib/data.ts`.

### Run
```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build
```

### Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · `lucide-react` icons · `recharts` charts.

> Next.js 16 has breaking changes versus older versions. Read `frontend/AGENTS.md` and the docs in `frontend/node_modules/next/dist/docs/` before writing Next-specific code. Example: dynamic route `params` is a **Promise** and must be awaited.

### Routes
| Route | Screen |
|---|---|
| `/` | Landing page and role picker (Government / Auditor vs Contractor) |
| `/gov` | Oversight dashboard: KPIs, variation trend, deviations by type, top priority contracts, latest detections |
| `/gov/queue` | Investigation queue: contracts ranked by priority score, with search, filters, sort and a plain-language reason per row |
| `/gov/contracts/[id]` | Contract detail tabs: **Overview** (awarded vs current), **Changes** (variation timeline), **Evidence** (Evidence Linker checklist), **Priority score** (factor breakdown), **Relationships** (graph + signals) |
| `/gov/alerts` | Feed of detected variations with verification status |
| `/contractor` | Contractor overview: match stats, top matches, upcoming deadlines, profile completeness |
| `/contractor/tenders` | AI-matched tenders ranked by fit, with filters and save |
| `/contractor/tenders/[id]` | Tender detail: why it matches, eligibility checklist, gaps with fixes, key dates, locked premium analysis |
| `/contractor/saved` | Saved tenders, deadline calendar, premium deadline-alerts upsell |
| `/contractor/profile` | Capability profile: company facts, turnover, categories, certifications, plant, regions, past projects, document upload |

### Folder layout
```
frontend/src/
  app/                    routes (see table above); gov/ and contractor/ each have a layout.tsx wrapping AppShell
  components/
    app-shell.tsx         client: sidebar + topbar + mobile drawer, role-aware nav
    ui.tsx                server-safe primitives: Card, CardHeader, PageHeader, Badge, StatCard, ProgressBar, ScoreRing, VerificationBadge, EvidenceIcon
    charts.tsx            client: recharts wrappers
    tabs.tsx              client: tab switcher (panels rendered on the server)
    queue-table.tsx       client: investigation queue with filters
    relationship-graph.tsx SVG relationship graph (column layout by node kind)
    review-actions.tsx    client: escalate / clear / export with toast (UI only)
    tender-card.tsx       server-safe tender card + DeadlineBadge
    tender-list.tsx       client: tender filters + save toggles
    save-button.tsx       client: bookmark toggle
  lib/
    data.ts               ALL mock data + derived helpers (verification status, priority score, alerts)
    utils.ts              cn, inr (₹ Cr/L formatting), date helpers pinned to a fixed "today"
```

### Domain rules encoded in the mock layer (keep these when wiring the real backend)
- A **variation** has a type (`Cost | Scope | Materials | Timeline | Subcontractor`) and four evidence slots: `approval`, `changeOrder`, `inspection`, `invoice`. Each slot is `verified | missing | mismatch | na`.
- **Verification status** is derived. All relevant slots verified gives `verified`; at least one verified gives `partial`; otherwise `unverified`.
- **Priority score** = weighted sum of factors: Financial variation 35%, Evidence gaps 30%, Relationship signals 25%, Timeline slippage 10%. Every score ships with a plain-language `reason`.
- **Tender fit** is 0–100, with `reasons`, `gaps` (each with a suggested `fix`) and an `eligibility` checklist (required vs yours, met or not).
- A fixed `TODAY = 2026-09-13` in `utils.ts` keeps "days left" deterministic and avoids hydration mismatches.

### Design language
Colors come from the pitch deck and are defined as Tailwind v4 theme tokens in `src/app/globals.css`:
- `ink #1b1238` sidebar / headings · `primary #2e1a6b` government side · `accent #b5176b` contractor side
- `surface #f7f5fc` page background · `line #e6e1f2` borders · `muted #6b6485` secondary text
- Status: emerald = verified/good, amber = partial/soon, red = unverified/high risk
- Rounded-2xl white cards on a lavender surface, Geist font, responsive down to ~400px (sidebar becomes a drawer)

### Conventions
- Server Components by default; add `"use client"` only for state or interactivity (tabs, filters, toggles, charts, shell).
- Keep mock data in `lib/data.ts` only, so it can later be swapped for FastAPI calls without touching components.
- All data is fictional sample data. The UI labels it "Sample data". Don't use real company or official names.

## 8. Launch video (`video/`, Remotion)

A ~2.5 min, 1920×1080 @ 30 fps product-launch motion graphics video that explains the problem, all four modules and both apps.

```bash
cd video
npm install
npm run dev      # Remotion Studio preview
npm run render   # → out/auditly-launch.mp4
```

- `src/Video.tsx` holds the scene order and durations (a `TransitionSeries` with 15-frame fades/slides), plus the watermark and progress-bar overlay.
- `src/scenes/opening.tsx`: Intro, Problem, Audiences, Introducing.
- `src/scenes/engine.tsx`: Pipeline, 01 Change Detector, 02 Evidence Linker, 03 Priority Score, Relationship graph.
- `src/scenes/product.tsx`: Government app montage, 04 Tender Matching, Contractor app montage.
- `src/scenes/closing.tsx`: Business & impact, Roadmap + 36-hour plan, Tech stack, Outro.
- `src/components.tsx` has the shared animation primitives (`progress`, `FadeUp`, `Words`, `Kicker`, `Ring`, `BrowserFrame`). `src/theme.ts` holds the palette and the Inter font.
- `public/shots/*.png` are real screenshots of the prototype (1440px wide at 1.5x). Recapture them after UI changes; wait for Recharts animations to finish before capturing the dashboard.
- Scene data mirrors `frontend/src/lib/data.ts` (contract KA-PWD-2025-0142, tender KPPP-PWD-UDP-2026-118). Keep them in sync.
- The video has no audio. Add music with `<Audio src={staticFile("music.mp3")} />` in `AuditlyLaunch`.
- **Voiceover:** `SCRIPT.md` has the four-voice script, with every line timed to the rendered video. The speakers, in order, are Shreesha, Pranav, Jnandeep and Akash; line 34 is said by all four. `voiceover.srt` has the same cues for editors. If you change a scene duration, re-time every line from that scene onward.
- **Face-cam version:** the `AuditlyLaunchWithFace` composition (`npm run render:face` → `out/auditly-launch-face.mp4`) adds the presenter as a 200px circle bottom-left, with their voice as the soundtrack. The source is `video.mp4` in the repo root (a portrait phone recording). `public/facecam.mp4` was made from it with ffmpeg: 4.56 s trimmed off the start (the offset that lines the speech up with `SCRIPT.md`; no speed change, drift is under 0.1 s per 100 s), cropped to head and shoulders (`crop=720:720:190:450`), 400×400, loudness normalised to −16 LUFS. Keep the bottom-left corner (x < 250, y > 840) clear of scene content.
- **Per-speaker takes** are listed in `TAKES` in `FaceCam` (`src/Video.tsx`); the main face-cam is muted over each window.
- **Pranav's section:** during lines 7–14 (frames 1062–2070, i.e. 0:35.4 → 1:09.0) the circle and voice come from `public/facecam-pranav.mp4`, made from `pranav_video (2).mp4` (repo root; a portrait take pillarboxed in 1280×720 at ~14 fps with a clideo.com watermark on the right bar): `fps=30,crop=640:640:268:60`, 400×400, last frame held 3 s so it runs to Jnandeep's cut. His audio was very quiet (−28.8 LUFS), so it is high-passed at 70 Hz and loudness-normalised to −15 LUFS (measures −14.8), slightly louder than the others. His take starts at 35.4 s on the timeline (offset 0 into the clip); every line starts within 0.55 s of its script cue.
- **Akash's section:** from line 24 to the end (frames 3105–end, i.e. 1:43.5 → 2:25.6, including the all-four sign-off, which he recorded) the circle and voice come from `public/facecam-akash.mp4`, made from `Akash.mp4` (repo root; already square, 368×368 at ~25 fps, head small near the top): `fps=30,crop=260:260:60:15`, 400×400, last frame held 2 s. His audio (−21 LUFS) gets a 70 Hz high-pass, +6 dB and a limiter at −1.5 dBFS (the peaks were too high for a linear loudnorm). His take sits 100.1 s behind the video timeline (trimBefore 102 frames); lines 24–32 and 34 start 0.1–0.45 s after their script cues, line 33 about 0.7 s early but still inside its window.
- **Jnandeep's section:** during lines 15–23 (frames 2070–3105, i.e. 1:09.0 → 1:43.5, both cuts in silent handovers) the circle and voice switch to `public/facecam-jnandeep.mp4`, made from `IMG_8151.MOV` (repo root, portrait iPhone take of just his lines): `crop=720:720:190:640`, 400×400, first audio stream loudness-normalised to −16 LUFS. His take sits 61.86 s behind the video timeline (matched on the speech onsets of all nine lines, ±0.2 s), applied as `trimBefore` in `FaceCam`; the main face-cam is muted over that window.
- **Faster cut:** `out/auditly-launch-face-1.2x.mp4` (2:01) is the face-cam render sped up 1.2× with ffmpeg: `setpts=(PTS-STARTPTS)/1.2,fps=30` for video and `atempo=1.2` for pitch-preserved voice. Video and voice are scaled together, so sync holds. `voiceover-1.2x.srt` has the cues scaled to match. `SCRIPT.md` and the teleprompter stay timed at 1× for recording.
- **Tight cut (pauses removed):** `out/auditly-launch-face-tight.mp4` (about 1:45) is the 1.2× cut with 19 voice pauses removed (16.2 s total; re-cut after Pranav's, Jnandeep's and Akash's takes went in, with pauses of at least 0.2 s cut). A stretch was cut only when the voice was silent (−38 dB) *and* the screen was nearly still (frame-difference YAVG < 0.5, face circle masked), keeping 0.15 s after speech and 0.12 s before it. Pauses that play over animations (card reveals, fades, count-ups) were kept so nothing jumps. Picture and sound are trimmed at identical frame boundaries (`trim`/`atrim` + `concat`). `voiceover-tight.srt` has cues re-timed through the cuts.
- **YouTube:** `YOUTUBE.md` has the title options. The thumbnail is the `Thumbnail` still in `src/Thumbnail.tsx` (`npx remotion still Thumbnail out/thumbnail.png`, 1280×720). It has no presenter face (the presenter asked not to use it): a "Cost up 28%, no proof" headline, the contract card with the UNVERIFIED stamp, and an 88 risk score ring. Keep the bottom-right corner clear for YouTube's duration badge.
- Remotion's renderer defaults to port 3000. If the Next dev server is running, pass `--port=3330`.

## 9. Next steps (after the prototype)
1. `backend/`: FastAPI service with PostgreSQL models mirroring the `lib/data.ts` types.
2. Ingestion: portal scraper adapters, OCR, LLM extraction via OpenRouter.
3. Change engine and Evidence Linker; priority scoring endpoint.
4. Neo4j relationship graph (directors, owners, addresses) feeding relationship signals.
5. Matching engine: contractor profile extraction, embeddings, fit scoring and explanations.
6. `docker-compose` for api + postgres + neo4j + frontend; replace mock imports with API fetches.
