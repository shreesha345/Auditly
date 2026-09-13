# Auditly

**AI-powered public procurement intelligence platform.**
Auditly follows every rupee of public money after a contract is awarded, and helps smaller contractors find tenders they can actually win.

Built for **Manipal Hackathon 2026**, track **Smart Governance & Compliance**, problem statement **Unverified Post-Award Subcontractor Variations**.

> **Status:** clickable UI prototype with realistic sample data. There is no backend yet. All companies, officials and contracts on screen are fictional.

---

## The problem

Public procurement is broken on both sides:

| Who | What goes wrong |
|---|---|
| **Governments and auditors** | After a contract is signed, costs, scope and subcontractors change quietly. The proof (approvals, change orders, inspection reports, invoices) is scattered across systems, so no one checks it. |
| **Contractors and SMEs** | Tenders are spread across many portals, and eligibility rules are buried in dense documents. Small firms can't find work that fits them. |

Auditly connects both sides through one shared intelligence layer.

## What it does

1. **Contract Change Detector:** compares the awarded contract with amendments, progress reports and payments, and flags changes in cost, scope, materials, timeline or subcontractors.
2. **Evidence Linker:** checks every flagged change against approvals, change orders, inspection reports and invoices, and marks it **verified**, **partially verified** or **unverified**.
3. **Investigation Priority Score:** ranks contracts by financial variation (35%), evidence gaps (30%), relationship signals (25%) and timeline slippage (10%), with a plain-language reason for every score.
4. **AI Tender Matching Engine:** profiles a contractor's capability, scores their fit against open tenders (0–100), and explains the match, the gaps with suggested fixes, and the deadlines.

A relationship graph links agencies, officials, contractors, subcontractors and their directors, so hidden connections (for example, one person running two bidding companies) show up as signals.

## Two apps

### Government / auditor dashboard

| Route | Screen |
|---|---|
| `/gov` | Oversight dashboard: KPIs, variation trend, deviations by type, top priority contracts, latest detections |
| `/gov/queue` | Investigation queue ranked by priority score, with search, filters and a reason per contract |
| `/gov/contracts/[id]` | Contract detail: awarded vs current, change timeline, evidence checklist, score breakdown, relationship graph |
| `/gov/alerts` | Feed of detected changes with verification status |

### Contractor portal

| Route | Screen |
|---|---|
| `/contractor` | Overview: match stats, top matches, upcoming deadlines, profile completeness |
| `/contractor/tenders` | AI-matched tenders ranked by fit, with filters and save |
| `/contractor/tenders/[id]` | Why it matches, eligibility checklist, gaps with fixes, key dates |
| `/contractor/saved` | Saved tenders and deadline calendar |
| `/contractor/profile` | Capability profile: turnover, categories, certifications, equipment, regions, past projects |

The landing page (`/`) lets you pick a role.

---

## Run it locally

### Prerequisites

- **Node.js 20 or newer** (tested on Node 24) and npm
- **Git LFS**, only if you want the video files (see [Cloning](#cloning))

### Web prototype (`frontend/`)

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # type-check and production build
npm run start      # serve the production build
npm run lint       # ESLint
```

No environment variables, API keys or database are needed. All data comes from `frontend/src/lib/data.ts`.

### Launch video (`video/`)

A 2.5-minute product video made with [Remotion](https://www.remotion.dev).

```bash
cd video
npm install
npm run dev            # Remotion Studio preview
npm run render         # out/auditly-launch.mp4 (no face cam)
npm run render:face    # out/auditly-launch-face.mp4 (presenter face cam and voice)
```

If the web prototype is already running on port 3000, add `-- --port=3330` to the render command.

The rendered videos are already in `video/out/`:

| File | Length | Notes |
|---|---|---|
| `auditly-launch.mp4` | 2:25 | Motion graphics only, no audio |
| `auditly-launch-face.mp4` | 2:25 | With each presenter's face cam and voice |
| `auditly-launch-face-1.2x.mp4` | 2:01 | Face-cam version at 1.2× speed |
| `auditly-launch-face-tight.mp4` | 1:45 | 1.2× with pauses removed |

The voiceover script is in `video/SCRIPT.md`, with subtitle files `video/voiceover*.srt`.

### Cloning

Videos (`*.mp4`, `*.mov`) are stored with Git LFS.

```bash
git lfs install
git clone https://github.com/shreesha345/Auditly.git
```

To get only the code, skip the video downloads:

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/shreesha345/Auditly.git
```

---

## Tech stack

**Prototype (this repo):** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Recharts · lucide-react · Remotion

**Target system:** Python · FastAPI · PostgreSQL · Neo4j · vector store · Docker · OpenRouter (LLM access)

## Architecture (target)

```
Public procurement data  →  Ingestion layer        →  AI engines                  →  Storage             →  API & scoring        →  Apps
(portals, tender sites,     (scrapers per portal,     Change Engine                   PostgreSQL             FastAPI                 Government dashboard
 public records)             OCR, LLM extraction)     (variation detection,           Vector store           Investigation           Contractor portal
                                                       evidence linking)              Neo4j (relationships)  Priority Score
                                                      Matching Engine
                                                      (contractor profiling,
                                                       fit scoring)
```

Scrapers are modular, one adapter per portal, so adding an agency, state or country means adding an adapter, not rebuilding the core.

## Project structure

```
frontend/                 Next.js web prototype
  src/app/                routes: / , /gov/* , /contractor/*
  src/components/         app shell, UI primitives, charts, tables, relationship graph
  src/lib/data.ts         all sample data and derived helpers (verification status, priority score)
  src/lib/utils.ts        formatting (₹ Cr / L) and date helpers
video/                    Remotion launch video
  src/                    scenes, components, theme
  public/                 app screenshots and face-cam clips
  out/                    rendered videos
  SCRIPT.md               four-voice voiceover script
Auditly_UnverifiedPostAwardSubcontractorVariations.pdf   pitch deck
```

## Roadmap

- **MVP:** Change Detector and Evidence Linker on sample data
- **V2:** priority scoring and the relationship graph
- **V3:** contractor-facing tender matching engine
- **Pilot:** live pilot with a state procurement portal

## Business model

- Subscription licensing for government agencies and oversight bodies
- Free tender browsing and matching for contractors
- Premium tier for deep eligibility analysis and deadline alerts
- Data licensing for research and civic transparency partners

Aligned with **UN SDG 16** (peace, justice and strong institutions): transparency in public spending, evidence-linked audit trails, and fairer access to public work for smaller firms.

## Team

- Shreesha Aithal
- Pranav S Salian
- Jnandeep Rai
- Shetty Akash Sadashiv
