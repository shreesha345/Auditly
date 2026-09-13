// All mock data for the UI prototype. Fictional sample data only, no backend.

export type VariationType = "Cost" | "Scope" | "Materials" | "Timeline" | "Subcontractor";
export type EvidenceKind = "approval" | "changeOrder" | "inspection" | "invoice";
export type EvidenceStatus = "verified" | "missing" | "mismatch" | "na";
export type VerificationStatus = "verified" | "partial" | "unverified";
export type ContractStatus = "New" | "Under review" | "Escalated" | "Cleared";
export type NodeKind = "agency" | "official" | "person" | "contractor" | "subcontractor";

export interface Evidence {
  status: EvidenceStatus;
  note: string;
}

export interface Variation {
  id: string;
  type: VariationType;
  date: string;
  title: string;
  before: string;
  after: string;
  impact: string;
  source: string;
  evidence: Record<EvidenceKind, Evidence>;
}

export interface ScoreFactor {
  label: string;
  weight: number;
  value: number;
  detail: string;
}

export interface Subcontractor {
  name: string;
  scope: string;
  share: number;
  addedPostAward: boolean;
  flag?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  suspicious?: boolean;
}

export interface Contract {
  id: string;
  title: string;
  agency: string;
  district: string;
  contractor: string;
  category: string;
  status: ContractStatus;
  awardDate: string;
  awardedValue: number;
  currentValue: number;
  originalEnd: string;
  currentEnd: string;
  reason: string;
  scope: { before: string; after: string };
  materials: { before: string; after: string };
  subcontractors: Subcontractor[];
  variations: Variation[];
  factors: ScoreFactor[];
  signals: string[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  score: number;
}

export const EVIDENCE_LABELS: Record<EvidenceKind, string> = {
  approval: "Approval",
  changeOrder: "Change order",
  inspection: "Inspection report",
  invoice: "Invoice / payment",
};

const e = (status: EvidenceStatus, note = ""): Evidence => ({ status, note });
const ev = (approval: Evidence, changeOrder: Evidence, inspection: Evidence, invoice: Evidence) => ({
  approval,
  changeOrder,
  inspection,
  invoice,
});
const na = e("na", "Not applicable for this change");

const factors = (financial: [number, string], evidence: [number, string], relationship: [number, string], timeline: [number, string]): ScoreFactor[] => [
  { label: "Financial variation", weight: 35, value: financial[0], detail: financial[1] },
  { label: "Evidence gaps", weight: 30, value: evidence[0], detail: evidence[1] },
  { label: "Relationship signals", weight: 25, value: relationship[0], detail: relationship[1] },
  { label: "Timeline slippage", weight: 10, value: timeline[0], detail: timeline[1] },
];

const rawContracts: Omit<Contract, "score">[] = [
  {
    id: "KA-PWD-2025-0142",
    title: "NH-66 service road widening, Mangaluru–Udupi (Package 3)",
    agency: "Karnataka PWD, Dakshina Kannada Division",
    district: "Dakshina Kannada",
    contractor: "Sahyadri Roadways Ltd",
    category: "Roads",
    status: "Under review",
    awardDate: "2025-03-14",
    awardedValue: 482_000_000,
    currentValue: 619_000_000,
    originalEnd: "2026-06-30",
    currentEnd: "2027-01-31",
    reason:
      "Cost is up 28% since award with no change order covering ₹9.4 Cr of it. Surfacing work was sub-let to a company that shares a director with the prime contractor, and core samples show a thinner layer than billed.",
    scope: {
      before: "4.2 km two-lane service road, 6 culverts",
      after: "4.2 km two-lane service road, 9 culverts, 1.1 km drain realignment",
    },
    materials: { before: "VG-30 bitumen, 40 mm bituminous concrete", after: "VG-40 bitumen, 50 mm bituminous concrete" },
    subcontractors: [
      { name: "Coastal Aggregates & Paving", scope: "Bituminous surfacing", share: 34, addedPostAward: true, flag: "Shares a director with the prime contractor" },
      { name: "Netravati Earthmovers", scope: "Earthwork", share: 12, addedPostAward: false },
    ],
    variations: [
      {
        id: "V-0142-1",
        type: "Subcontractor",
        date: "2026-02-08",
        title: "Surfacing works sub-let to Coastal Aggregates & Paving",
        before: "Self-executed by prime contractor",
        after: "34% of contract value sub-let",
        impact: "₹16.4 Cr of work moved to a new entity",
        source: "Monthly progress report, Feb 2026",
        evidence: ev(
          e("missing", "No sub-letting approval from Engineer-in-Charge on file"),
          na,
          e("mismatch", "Site log shows the subcontractor crew on site from Dec 2025, two months before disclosure"),
          e("missing", "No invoices from the subcontractor; all work billed through prime contractor"),
        ),
      },
      {
        id: "V-0142-2",
        type: "Materials",
        date: "2026-03-10",
        title: "Bitumen grade and layer thickness changed",
        before: "VG-30, 40 mm BC",
        after: "VG-40, 50 mm BC",
        impact: "Est. +₹4.3 Cr material cost",
        source: "Site inspection log",
        evidence: ev(
          e("missing", "Specification change not approved by design wing"),
          e("missing", "Not covered by any change order"),
          e("mismatch", "Core samples average 42 mm, not the 50 mm billed"),
          e("missing", "Bitumen purchase invoices not submitted"),
        ),
      },
      {
        id: "V-0142-3",
        type: "Cost",
        date: "2026-04-22",
        title: "Bill of quantities revised upward",
        before: "₹48.20 Cr",
        after: "₹61.90 Cr",
        impact: "+₹13.7 Cr (+28.4%)",
        source: "Running account bill #9",
        evidence: ev(
          e("verified", "Revised estimate approved by Superintending Engineer, Mangaluru Circle"),
          e("missing", "No change order covering ₹9.4 Cr of the increase"),
          e("verified", "Measurement book entries match 70% of added quantities"),
          e("mismatch", "RA bill #9 exceeds the approved estimate by ₹9.4 Cr"),
        ),
      },
      {
        id: "V-0142-4",
        type: "Timeline",
        date: "2026-06-15",
        title: "Completion extended by 7 months",
        before: "30 Jun 2026",
        after: "31 Jan 2027",
        impact: "+215 days",
        source: "Extension of time order EOT/DK/112",
        evidence: ev(
          e("verified", "EOT/DK/112 signed by Superintending Engineer"),
          na,
          e("verified", "Monsoon delays recorded in site diary"),
          na,
        ),
      },
    ],
    factors: factors(
      [88, "Cost up 28.4%, in the top 5% for road works in this district"],
      [92, "3 of 4 changes lack approvals or have evidence that contradicts billing"],
      [95, "New subcontractor shares a director with the prime contractor"],
      [60, "+215 days, but a signed extension order was found"],
    ),
    signals: [
      "K. Hegde is listed as a director of both Sahyadri Roadways Ltd and Coastal Aggregates & Paving (company registry).",
      "Coastal Aggregates & Paving was incorporated 5 months after this contract was awarded.",
    ],
    graph: {
      nodes: [
        { id: "ag", label: "Karnataka PWD (DK)", kind: "agency" },
        { id: "o1", label: "Exec. Engineer R. Shenoy", kind: "official" },
        { id: "p1", label: "Director K. Hegde", kind: "person" },
        { id: "c", label: "Sahyadri Roadways Ltd", kind: "contractor" },
        { id: "s1", label: "Coastal Aggregates & Paving", kind: "subcontractor" },
        { id: "s2", label: "Netravati Earthmovers", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹48.2 Cr" },
        { from: "ag", to: "o1", label: "Engineer-in-charge" },
        { from: "p1", to: "c", label: "Director" },
        { from: "p1", to: "s1", label: "Director", suspicious: true },
        { from: "c", to: "s1", label: "Sub-let 34%", suspicious: true },
        { from: "c", to: "s2", label: "Sub-let 12%" },
      ],
    },
  },
  {
    id: "KA-RDPR-2025-0520",
    title: "Jal Jeevan rural water supply, Kundapura cluster",
    agency: "RDPR Department, Udupi",
    district: "Udupi",
    contractor: "Western Ghats Hydro Engineering",
    category: "Water supply",
    status: "Escalated",
    awardDate: "2025-06-02",
    awardedValue: 149_000_000,
    currentValue: 198_000_000,
    originalEnd: "2026-12-31",
    currentEnd: "2026-12-31",
    reason:
      "Invoices bill 54 km of pipe but inspection found 38.2 km laid, a 41% gap. All pipe is now supplied by a firm owned by a relative of the contractor's managing director.",
    scope: { before: "6 overhead tanks, 42 km distribution network", after: "8 overhead tanks, 42 km distribution network" },
    materials: { before: "HDPE PE-100 pipes, open-market supply", after: "HDPE PE-100 pipes, single related supplier" },
    subcontractors: [
      { name: "Souparnika Pipes & Fittings", scope: "Pipe supply", share: 28, addedPostAward: true, flag: "Owned by a relative of the contractor's MD" },
      { name: "Kollur Borewells", scope: "Borewell drilling", share: 9, addedPostAward: false },
    ],
    variations: [
      {
        id: "V-0520-1",
        type: "Subcontractor",
        date: "2025-12-02",
        title: "All pipe supply moved to Souparnika Pipes & Fittings",
        before: "Open-market supply",
        after: "Single related supplier",
        impact: "28% of contract value to a related party",
        source: "GST e-invoices",
        evidence: ev(
          e("missing", "Supplier change not approved"),
          na,
          na,
          e("mismatch", "All e-invoices from the related supplier are priced 18% above the schedule of rates"),
        ),
      },
      {
        id: "V-0520-2",
        type: "Cost",
        date: "2026-03-18",
        title: "Pipe quantities billed above inspected length",
        before: "₹14.90 Cr",
        after: "₹19.80 Cr",
        impact: "+₹4.9 Cr (+32.9%)",
        source: "RA bill #6 vs third-party inspection",
        evidence: ev(
          e("missing", "No revised administrative approval"),
          e("missing", "No change order"),
          e("mismatch", "Third-party inspection measured 38.2 km of pipe laid"),
          e("mismatch", "Invoices claim 54 km of HDPE pipe"),
        ),
      },
      {
        id: "V-0520-3",
        type: "Scope",
        date: "2026-05-10",
        title: "Two additional overhead tanks added",
        before: "6 overhead tanks",
        after: "8 overhead tanks",
        impact: "+₹1.2 Cr",
        source: "Change order CO/UDP/03",
        evidence: ev(
          e("verified", "Approved by Zilla Panchayat CEO"),
          e("verified", "CO/UDP/03"),
          e("verified", "Both tanks confirmed on site"),
          e("verified", "Payments match change order value"),
        ),
      },
    ],
    factors: factors(
      [90, "Cost up 32.9%, the highest in the cluster"],
      [80, "Billed pipe length is 41% higher than the inspected length"],
      [88, "Main supplier is owned by a family member of the contractor's MD"],
      [20, "On schedule"],
    ),
    signals: [
      "S. Bhat, owner of Souparnika Pipes & Fittings, is a relative of the managing director of Western Ghats Hydro Engineering.",
      "Souparnika Pipes & Fittings has received 100% of pipe supply orders on this contract since Dec 2025.",
    ],
    graph: {
      nodes: [
        { id: "ag", label: "RDPR Udupi", kind: "agency" },
        { id: "p1", label: "Owner S. Bhat", kind: "person" },
        { id: "c", label: "Western Ghats Hydro Engg.", kind: "contractor" },
        { id: "s1", label: "Souparnika Pipes & Fittings", kind: "subcontractor" },
        { id: "s2", label: "Kollur Borewells", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹14.9 Cr" },
        { from: "p1", to: "c", label: "Relative of MD", suspicious: true },
        { from: "p1", to: "s1", label: "Owner", suspicious: true },
        { from: "c", to: "s1", label: "Pipe supply 28%", suspicious: true },
        { from: "c", to: "s2", label: "Drilling 9%" },
      ],
    },
  },
  {
    id: "KA-UDD-2025-0311",
    title: "Smart city stormwater drains, Hubballi Zone 2",
    agency: "Hubballi-Dharwad Smart City Ltd",
    district: "Dharwad",
    contractor: "Deccan Civil Works",
    category: "Urban infrastructure",
    status: "New",
    awardDate: "2025-05-20",
    awardedValue: 226_000_000,
    currentValue: 271_000_000,
    originalEnd: "2026-11-30",
    currentEnd: "2026-11-30",
    reason:
      "The drain network grew by 2.3 km on the strength of an informal site memo, with no formal change order, and payment for the extra work was released anyway. A subcontractor registered three weeks before engagement is doing 22% of the work.",
    scope: { before: "11.4 km RCC stormwater drains", after: "13.7 km RCC stormwater drains" },
    materials: { before: "M25 RCC precast sections", after: "M25 RCC precast sections" },
    subcontractors: [
      { name: "Malaprabha Pipes", scope: "Precast supply", share: 18, addedPostAward: false },
      { name: "Twin City Contractors", scope: "Civil works", share: 22, addedPostAward: true, flag: "Registered 3 weeks before being engaged" },
    ],
    variations: [
      {
        id: "V-0311-1",
        type: "Scope",
        date: "2026-01-19",
        title: "Drain network extended by 2.3 km",
        before: "11.4 km",
        after: "13.7 km",
        impact: "+2.3 km, est. +₹3.1 Cr",
        source: "Site memo SM/HZ2/04",
        evidence: ev(
          e("missing", "Only a site memo signed by the project manager"),
          e("missing", "No formal change order"),
          e("verified", "Drone survey confirms 13.7 km laid"),
          e("mismatch", "Payment released before any approval was recorded"),
        ),
      },
      {
        id: "V-0311-2",
        type: "Subcontractor",
        date: "2026-03-01",
        title: "Twin City Contractors engaged for civil work",
        before: "Not listed in bid",
        after: "22% of works",
        impact: "New entity registered Feb 2026",
        source: "Labour register",
        evidence: ev(
          e("missing", "Sub-letting not approved"),
          na,
          e("mismatch", "Labour register shows the crew, but progress reports do not declare them"),
          e("missing", "No invoices from Twin City Contractors"),
        ),
      },
      {
        id: "V-0311-3",
        type: "Cost",
        date: "2026-05-02",
        title: "Payment released for additional length",
        before: "₹22.60 Cr",
        after: "₹27.10 Cr",
        impact: "+₹4.5 Cr (+19.9%)",
        source: "Treasury payment record",
        evidence: ev(
          e("missing", "No revised administrative approval"),
          e("missing", "No change order"),
          na,
          e("verified", "Treasury record TR/HDSCL/5521 matches ₹4.5 Cr"),
        ),
      },
    ],
    factors: factors(
      [70, "Cost up 19.9%, above the district median of 7%"],
      [85, "Scope change backed only by an informal site memo"],
      [74, "Subcontractor incorporated 3 weeks before engagement"],
      [30, "On schedule"],
    ),
    signals: [
      "Twin City Contractors was incorporated on 9 Feb 2026 and engaged on 1 Mar 2026.",
      "Its registered address matches a Deccan Civil Works site office.",
    ],
    graph: {
      nodes: [
        { id: "ag", label: "Hubballi-Dharwad Smart City", kind: "agency" },
        { id: "o1", label: "Project Mgr. A. Kulkarni", kind: "official" },
        { id: "c", label: "Deccan Civil Works", kind: "contractor" },
        { id: "s1", label: "Malaprabha Pipes", kind: "subcontractor" },
        { id: "s2", label: "Twin City Contractors", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹22.6 Cr" },
        { from: "ag", to: "o1", label: "Project manager" },
        { from: "o1", to: "c", label: "Signed site memo", suspicious: true },
        { from: "c", to: "s1", label: "Supply 18%" },
        { from: "c", to: "s2", label: "Civil 22%", suspicious: true },
      ],
    },
  },
  {
    id: "KA-HFW-2024-0907",
    title: "District hospital block expansion, Ballari",
    agency: "Karnataka Health Infrastructure Board",
    district: "Ballari",
    contractor: "Tungabhadra Constructions",
    category: "Health",
    status: "Under review",
    awardDate: "2024-10-11",
    awardedValue: 368_000_000,
    currentValue: 413_000_000,
    originalEnd: "2026-03-31",
    currentEnd: "2026-09-30",
    reason:
      "HVAC chillers were swapped for a lower-capacity model while billing stayed at the original rate. The cost increase itself is mostly explained by an approved price escalation.",
    scope: { before: "120-bed block, 2 operation theatres", after: "120-bed block, 2 operation theatres" },
    materials: { before: "Screw chillers, 400 TR", after: "Scroll chillers, 320 TR" },
    subcontractors: [
      { name: "Vijayanagara MEP Services", scope: "HVAC", share: 15, addedPostAward: false },
      { name: "Sanjeevini Medical Gas Systems", scope: "Medical gas pipeline", share: 6, addedPostAward: true },
    ],
    variations: [
      {
        id: "V-0907-1",
        type: "Cost",
        date: "2025-11-20",
        title: "Price escalation clause applied",
        before: "₹36.80 Cr",
        after: "₹41.30 Cr",
        impact: "+₹4.5 Cr (+12.2%)",
        source: "Escalation order KHIB/PE/07",
        evidence: ev(e("verified", "Escalation order KHIB/PE/07"), na, na, e("verified", "Escalation bills match the WPI index")),
      },
      {
        id: "V-0907-2",
        type: "Subcontractor",
        date: "2026-01-05",
        title: "Medical gas works sub-let",
        before: "Prime contractor",
        after: "Sanjeevini Medical Gas Systems",
        impact: "6% of works",
        source: "Approval letter KHIB/SL/19",
        evidence: ev(
          e("verified", "KHIB/SL/19"),
          na,
          e("verified", "Specialist crew verified on site"),
          e("verified", "Invoices match approved share"),
        ),
      },
      {
        id: "V-0907-3",
        type: "Materials",
        date: "2026-02-11",
        title: "HVAC chillers downgraded",
        before: "Screw chillers, 400 TR",
        after: "Scroll chillers, 320 TR",
        impact: "Lower specification, same billed rate",
        source: "Inspection report IR/BLY/22",
        evidence: ev(
          e("missing", "No approval for specification change"),
          e("missing", "Not in any change order"),
          e("verified", "IR/BLY/22 records 320 TR scroll chillers installed"),
          e("mismatch", "Billed at the 400 TR screw chiller rate"),
        ),
      },
      {
        id: "V-0907-4",
        type: "Timeline",
        date: "2026-04-30",
        title: "Handover delayed by 6 months",
        before: "31 Mar 2026",
        after: "30 Sep 2026",
        impact: "+183 days",
        source: "Progress report, Apr 2026",
        evidence: ev(e("missing", "Extension request still pending with the board"), na, e("verified", "Progress report shows 78% completion"), na),
      },
    ],
    factors: factors(
      [52, "Cost up 12.2%, mostly covered by an escalation order"],
      [71, "HVAC downgrade not reflected in any change order"],
      [35, "No shared ownership found"],
      [68, "+183 days, extension request pending"],
    ),
    signals: [],
    graph: {
      nodes: [
        { id: "ag", label: "Health Infra Board", kind: "agency" },
        { id: "o1", label: "Asst. Engineer M. Patil", kind: "official" },
        { id: "c", label: "Tungabhadra Constructions", kind: "contractor" },
        { id: "s1", label: "Vijayanagara MEP Services", kind: "subcontractor" },
        { id: "s2", label: "Sanjeevini Medical Gas", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹36.8 Cr" },
        { from: "ag", to: "o1", label: "Site inspector" },
        { from: "o1", to: "c", label: "Signed IR/BLY/22" },
        { from: "c", to: "s1", label: "HVAC 15%" },
        { from: "c", to: "s2", label: "Medical gas 6%" },
      ],
    },
  },
  {
    id: "KA-KRIDL-2025-0233",
    title: "Bridge across Sharavathi river at Honnavar",
    agency: "KRIDL, Uttara Kannada",
    district: "Uttara Kannada",
    contractor: "Konkan Bridge Corporation",
    category: "Bridges",
    status: "New",
    awardDate: "2025-07-08",
    awardedValue: 575_000_000,
    currentValue: 632_000_000,
    originalEnd: "2027-03-31",
    currentEnd: "2027-03-31",
    reason:
      "Pile depth was increased after award and a change order exists, but the pile integrity report does not confirm the new depth that is being billed.",
    scope: { before: "Piles to 24 m depth, 14 spans", after: "Piles to 32 m depth, 14 spans" },
    materials: { before: "M40 concrete, Fe550D steel", after: "M40 concrete, Fe550D steel" },
    subcontractors: [{ name: "Aghanashini Piling Works", scope: "Piling", share: 20, addedPostAward: true }],
    variations: [
      {
        id: "V-0233-1",
        type: "Scope",
        date: "2026-02-20",
        title: "Pile depth increased from 24 m to 32 m",
        before: "24 m",
        after: "32 m",
        impact: "+8 m per pile, 56 piles",
        source: "Change order CO/KRIDL/HNV/02",
        evidence: ev(
          e("verified", "Technical sanction revised by Chief Engineer"),
          e("verified", "CO/KRIDL/HNV/02"),
          e("mismatch", "Pile integrity report records an average depth of 27 m"),
          e("mismatch", "Billed for 32 m piles"),
        ),
      },
      {
        id: "V-0233-2",
        type: "Subcontractor",
        date: "2026-02-25",
        title: "Piling sub-let to Aghanashini Piling Works",
        before: "Self-executed",
        after: "20% of works",
        impact: "₹12.6 Cr to subcontractor",
        source: "Approval letter (draft)",
        evidence: ev(e("missing", "Approval letter drafted but not signed"), na, e("verified", "Crew verified on site"), na),
      },
      {
        id: "V-0233-3",
        type: "Cost",
        date: "2026-05-15",
        title: "Revised estimate for piling",
        before: "₹57.50 Cr",
        after: "₹63.20 Cr",
        impact: "+₹5.7 Cr (+9.9%)",
        source: "Revised estimate RE/KRIDL/04",
        evidence: ev(e("verified", "RE/KRIDL/04"), e("verified", "CO/KRIDL/HNV/02"), na, e("verified", "Payments within revised estimate")),
      },
    ],
    factors: factors(
      [45, "Cost up 9.9%, backed by a revised estimate"],
      [72, "Inspection contradicts the billed pile depth"],
      [30, "Piling subcontractor has no prior public works record"],
      [25, "On schedule"],
    ),
    signals: ["Aghanashini Piling Works has no prior public works contracts on record."],
    graph: {
      nodes: [
        { id: "ag", label: "KRIDL Uttara Kannada", kind: "agency" },
        { id: "o1", label: "Chief Engineer's office", kind: "official" },
        { id: "c", label: "Konkan Bridge Corporation", kind: "contractor" },
        { id: "s1", label: "Aghanashini Piling Works", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹57.5 Cr" },
        { from: "ag", to: "o1", label: "Technical sanction" },
        { from: "c", to: "s1", label: "Piling 20%" },
      ],
    },
  },
  {
    id: "KA-BBMP-2025-1178",
    title: "Ward 112 government school buildings retrofit, Bengaluru",
    agency: "Bengaluru Municipal Corporation",
    district: "Bengaluru Urban",
    contractor: "Garden City Builders",
    category: "Education",
    status: "Under review",
    awardDate: "2025-09-01",
    awardedValue: 84_000_000,
    currentValue: 89_000_000,
    originalEnd: "2026-05-31",
    currentEnd: "2026-07-15",
    reason: "A small cost increase is backed by a matching change order and inspection. One invoice is still pending upload and the extension request has not been approved yet.",
    scope: { before: "Structural retrofit of 3 school blocks", after: "Structural retrofit of 3 blocks + fire safety systems" },
    materials: { before: "Micro-concrete jacketing", after: "Micro-concrete jacketing" },
    subcontractors: [{ name: "Kaveri Electricals", scope: "Electrical & fire alarm", share: 8, addedPostAward: false }],
    variations: [
      {
        id: "V-1178-1",
        type: "Cost",
        date: "2026-04-02",
        title: "Additional fire safety works",
        before: "₹8.40 Cr",
        after: "₹8.90 Cr",
        impact: "+₹0.5 Cr (+6.0%)",
        source: "Change order CO/BBMP/112-2",
        evidence: ev(
          e("verified", "Approved by Executive Engineer"),
          e("verified", "CO/BBMP/112-2"),
          e("verified", "Fire alarm and sprinklers inspected"),
          e("missing", "One invoice (₹6.2 L) pending upload"),
        ),
      },
      {
        id: "V-1178-2",
        type: "Timeline",
        date: "2026-06-01",
        title: "Completion extended by 45 days",
        before: "31 May 2026",
        after: "15 Jul 2026",
        impact: "+45 days",
        source: "Extension request",
        evidence: ev(e("missing", "Extension request pending"), na, e("verified", "Site diary records rain delays"), na),
      },
    ],
    factors: factors(
      [22, "Cost up 6%, within the normal range"],
      [40, "One invoice pending upload"],
      [10, "No relationship signals"],
      [45, "+45 days, request pending"],
    ),
    signals: [],
    graph: {
      nodes: [
        { id: "ag", label: "Bengaluru Municipal Corp.", kind: "agency" },
        { id: "c", label: "Garden City Builders", kind: "contractor" },
        { id: "s1", label: "Kaveri Electricals", kind: "subcontractor" },
      ],
      edges: [
        { from: "ag", to: "c", label: "Awarded ₹8.4 Cr" },
        { from: "c", to: "s1", label: "Electrical 8%" },
      ],
    },
  },
];

export const contracts: Contract[] = rawContracts
  .map((c) => ({
    ...c,
    score: Math.round(c.factors.reduce((sum, f) => sum + (f.value * f.weight) / 100, 0)),
  }))
  .sort((a, b) => b.score - a.score);

export function getContract(id: string) {
  return contracts.find((c) => c.id === id);
}

export function verificationOf(v: Variation): VerificationStatus {
  const relevant = Object.values(v.evidence).filter((x) => x.status !== "na");
  const verified = relevant.filter((x) => x.status === "verified").length;
  if (verified === relevant.length) return "verified";
  return verified > 0 ? "partial" : "unverified";
}

export function evidenceGaps(c: Contract) {
  return c.variations.flatMap((v) => Object.values(v.evidence)).filter((x) => x.status === "missing" || x.status === "mismatch").length;
}

export const alerts = contracts
  .flatMap((c) => c.variations.map((v) => ({ ...v, contractId: c.id, contractTitle: c.title, district: c.district, status: verificationOf(v) })))
  .sort((a, b) => b.date.localeCompare(a.date));

export const portfolioStats = {
  monitored: 1284,
  flagged: 212,
  unverifiedValue: 486_000_000,
  avgVariation: 18.4,
};

export const variationTrend = [
  { month: "Apr", flagged: 28, verified: 12 },
  { month: "May", flagged: 34, verified: 15 },
  { month: "Jun", flagged: 31, verified: 11 },
  { month: "Jul", flagged: 41, verified: 17 },
  { month: "Aug", flagged: 38, verified: 14 },
  { month: "Sep", flagged: 40, verified: 16 },
];

export const deviationsByType = [
  { type: "Cost", count: 64 },
  { type: "Timeline", count: 48 },
  { type: "Scope", count: 41 },
  { type: "Materials", count: 33 },
  { type: "Subcontr.", count: 26 },
];

// ───────────────────────── Contractor side ─────────────────────────

export interface Tender {
  id: string;
  title: string;
  buyer: string;
  portal: string;
  category: string;
  location: string;
  value: number;
  emd: number;
  published: string;
  deadline: string;
  fit: number;
  summary: string;
  reasons: string[];
  gaps: { text: string; fix: string }[];
  eligibility: { criterion: string; required: string; yours: string; met: boolean }[];
  timeline: { label: string; date: string }[];
  saved: boolean;
}

export const tenders: Tender[] = [
  {
    id: "KPPP-PWD-UDP-2026-118",
    title: "Resurfacing of Karkala–Moodbidri SH-37 (18 km)",
    buyer: "Karnataka PWD, Udupi",
    portal: "KPPP",
    category: "Roads",
    location: "Karkala, Udupi",
    value: 124_000_000,
    emd: 2_480_000,
    published: "2026-09-02",
    deadline: "2026-09-24",
    fit: 92,
    summary:
      "Strong match. You have delivered this kind of state highway resurfacing three times, the value is within your turnover band, and the site is close to your Mulki hot-mix plant. The only blocker is an expired ISO 45001 certificate, which you can renew before the bid date.",
    reasons: [
      "3 state highway resurfacing projects above ₹10 Cr completed in the last 5 years",
      "Your hot-mix plant at Mulki is 38 km from the site",
      "Class I PWD registration matches the required class",
    ],
    gaps: [{ text: "ISO 45001 certificate expired in June 2026", fix: "Upload the renewed certificate before 24 Sep" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class I (PWD)", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹8 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Similar work completed", required: "1 work ≥ ₹6 Cr", yours: "3 works, largest ₹14.2 Cr", met: true },
      { criterion: "Plant & machinery", required: "Hot-mix plant within 60 km", yours: "Mulki plant, 38 km", met: true },
      { criterion: "Safety certification", required: "ISO 45001 (valid)", yours: "Expired Jun 2026", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-02" },
      { label: "Pre-bid meeting", date: "2026-09-16" },
      { label: "Bid submission", date: "2026-09-24" },
      { label: "Technical bid opening", date: "2026-09-26" },
    ],
    saved: true,
  },
  {
    id: "KPPP-ZP-DK-2026-064",
    title: "Construction of 4 box culverts, Belthangady taluk",
    buyer: "Zilla Panchayat, Dakshina Kannada",
    portal: "KPPP",
    category: "Bridges & culverts",
    location: "Belthangady, Dakshina Kannada",
    value: 38_000_000,
    emd: 760_000,
    published: "2026-08-29",
    deadline: "2026-09-19",
    fit: 87,
    summary:
      "A small culvert package near your base that fits your capacity comfortably. You have built 11 box culverts under two past contracts. The deadline is tight: bids close in 6 days.",
    reasons: [
      "11 box culverts built under two RDPR contracts since 2022",
      "Site is within 45 km of your Surathkal wet-mix plant",
      "Contract value is well below your bid capacity",
    ],
    gaps: [{ text: "A site-specific traffic management plan must be attached to the bid", fix: "Reuse the plan from your 2024 Puttur culvert bid" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class II or above", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹2.5 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Similar work completed", required: "2 culvert works", yours: "2 works", met: true },
    ],
    timeline: [
      { label: "Published", date: "2026-08-29" },
      { label: "Bid submission", date: "2026-09-19" },
      { label: "Technical bid opening", date: "2026-09-22" },
    ],
    saved: true,
  },
  {
    id: "KPPP-MSCL-2026-031",
    title: "Stormwater drain rehabilitation, Mangaluru Wards 18–24",
    buyer: "Mangaluru Smart City Ltd",
    portal: "KPPP",
    category: "Urban infrastructure",
    location: "Mangaluru",
    value: 96_000_000,
    emd: 1_920_000,
    published: "2026-09-05",
    deadline: "2026-10-06",
    fit: 81,
    summary:
      "A good fit on location, value and drain work history. The tender asks for trenchless pipe laying on 600 m of the network, which is not in your profile. Declaring a specialist subcontractor would close that gap.",
    reasons: [
      "Two stormwater drain contracts in Mangaluru city (2023, 2025)",
      "Local presence earns points under the evaluation criteria",
      "Your turnover is 2.2x the requirement",
    ],
    gaps: [{ text: "Trenchless (micro-tunnelling) experience required for 600 m", fix: "Declare a specialist subcontractor at bid stage, which the tender allows" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class I", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹9.6 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Similar work completed", required: "1 drain work ≥ ₹4.8 Cr", yours: "2 works, largest ₹7.1 Cr", met: true },
      { criterion: "Trenchless experience", required: "600 m in the last 5 yrs", yours: "None on record", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-05" },
      { label: "Pre-bid meeting", date: "2026-09-22" },
      { label: "Bid submission", date: "2026-10-06" },
      { label: "Technical bid opening", date: "2026-10-08" },
    ],
    saved: false,
  },
  {
    id: "OMMAS-KRRDA-UDP-07",
    title: "Rural road connectivity, package UDP-07 (PMGSY)",
    buyer: "KRRDA (PMGSY), Udupi",
    portal: "PMGSY OMMAS",
    category: "Roads",
    location: "Udupi district",
    value: 213_000_000,
    emd: 4_260_000,
    published: "2026-09-08",
    deadline: "2026-10-14",
    fit: 74,
    summary:
      "The work type and region are right, but the package is large. Your computed bid capacity of ₹28.5 Cr is short of the ₹32 Cr required. A joint venture, or the smaller UDP-09 package, would qualify you.",
    reasons: [
      "Rural road experience under two PMGSY packages",
      "Udupi is inside your active operating region",
      "Your plant and machinery meet the listed requirements",
    ],
    gaps: [{ text: "Bid capacity ₹28.5 Cr against ₹32 Cr required", fix: "Form a JV, or bid for the smaller UDP-09 package" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class I", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹14 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Bid capacity", required: "≥ ₹32 Cr", yours: "₹28.5 Cr", met: false },
      { criterion: "Similar work completed", required: "1 work ≥ ₹10.6 Cr", yours: "₹14.2 Cr", met: true },
    ],
    timeline: [
      { label: "Published", date: "2026-09-08" },
      { label: "Pre-bid meeting", date: "2026-09-29" },
      { label: "Bid submission", date: "2026-10-14" },
      { label: "Technical bid opening", date: "2026-10-16" },
    ],
    saved: true,
  },
  {
    id: "KPPP-PWD-CKM-2026-092",
    title: "Retaining wall and slope protection, Charmadi Ghat",
    buyer: "Karnataka PWD, Chikkamagaluru",
    portal: "KPPP",
    category: "Roads",
    location: "Charmadi Ghat, Chikkamagaluru",
    value: 158_000_000,
    emd: 3_160_000,
    published: "2026-09-10",
    deadline: "2026-10-21",
    fit: 79,
    summary:
      "A solid match for ghat slope protection, similar to your 2024 Agumbe retaining wall work. The tender requires a geotechnical engineer on staff, and its monsoon working restrictions may affect your schedule.",
    reasons: [
      "Retaining wall and gabion work on Agumbe Ghat (2024, ₹9.8 Cr)",
      "Class I PWD registration",
      "Chikkamagaluru is one of your active regions",
    ],
    gaps: [{ text: "A geotechnical engineer must be on the payroll", fix: "Bring your consulting geotechnical engineer on staff before bidding" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class I", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹10.5 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Similar work completed", required: "1 slope work ≥ ₹7.9 Cr", yours: "₹9.8 Cr", met: true },
      { criterion: "Geotechnical engineer on staff", required: "Required", yours: "Consultant only", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-10" },
      { label: "Pre-bid meeting", date: "2026-10-01" },
      { label: "Bid submission", date: "2026-10-21" },
      { label: "Technical bid opening", date: "2026-10-23" },
    ],
    saved: false,
  },
  {
    id: "KPPP-WCD-UDP-2026-017",
    title: "Anganwadi buildings, 12 units, Kundapura",
    buyer: "Women & Child Development Dept, Udupi",
    portal: "KPPP",
    category: "Buildings",
    location: "Kundapura, Udupi",
    value: 42_000_000,
    emd: 840_000,
    published: "2026-09-01",
    deadline: "2026-09-30",
    fit: 68,
    summary:
      "Within your capacity and region, but building works are a small part of your history. Evaluators weigh similar building experience heavily for this tender.",
    reasons: ["The value fits comfortably within your capacity", "Kundapura is inside your operating region"],
    gaps: [{ text: "Only 1 building project in the last 5 years (2 required)", fix: "Add the 2021 Surathkal school block to your profile if you were the prime contractor" }],
    eligibility: [
      { criterion: "Contractor class", required: "Class II or above", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹2.8 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Building works completed", required: "2 in the last 5 yrs", yours: "1", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-01" },
      { label: "Bid submission", date: "2026-09-30" },
      { label: "Technical bid opening", date: "2026-10-03" },
    ],
    saved: false,
  },
  {
    id: "CPPP-WRD-MNG-2026-005",
    title: "Coastal embankment strengthening, Ullal",
    buyer: "Water Resources Dept (Coastal), Mangaluru",
    portal: "CPPP",
    category: "Water & coastal",
    location: "Ullal, Dakshina Kannada",
    value: 275_000_000,
    emd: 5_500_000,
    published: "2026-09-11",
    deadline: "2026-11-04",
    fit: 58,
    summary:
      "Nearby and high value, but it requires marine works experience and more bid capacity than you have. Worth watching as a joint venture opportunity with a marine contractor.",
    reasons: ["Site is 14 km from your Mangaluru office", "Earthwork and rock-armour supply match your plant list"],
    gaps: [
      { text: "Marine or coastal protection works experience required", fix: "Form a JV with an experienced marine contractor" },
      { text: "Bid capacity ₹28.5 Cr against ₹41 Cr required", fix: "A JV partner's capacity counts toward the requirement" },
    ],
    eligibility: [
      { criterion: "Contractor class", required: "Class I", yours: "Class I (PWD)", met: true },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹18 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Marine works experience", required: "1 work ≥ ₹13 Cr", yours: "None on record", met: false },
      { criterion: "Bid capacity", required: "≥ ₹41 Cr", yours: "₹28.5 Cr", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-11" },
      { label: "Pre-bid meeting", date: "2026-10-12" },
      { label: "Bid submission", date: "2026-11-04" },
      { label: "Technical bid opening", date: "2026-11-06" },
    ],
    saved: false,
  },
  {
    id: "GEM-KCMC-2026-2291",
    title: "Solar street lighting, Karwar municipal limits",
    buyer: "Karwar City Municipal Council",
    portal: "GeM",
    category: "Electrical",
    location: "Karwar, Uttara Kannada",
    value: 21_000_000,
    emd: 420_000,
    published: "2026-09-04",
    deadline: "2026-10-02",
    fit: 41,
    summary:
      "A weak fit. The tender needs an electrical contractor licence and solar installation experience, and neither appears in your profile.",
    reasons: ["Karwar is inside your operating region"],
    gaps: [
      { text: "Electrical contractor licence (Class A) required", fix: "Not quickly fixable; skip or partner with a licensed firm" },
      { text: "No solar installation experience", fix: "Partner with an empanelled solar installer" },
    ],
    eligibility: [
      { criterion: "Electrical contractor licence", required: "Class A", yours: "Not held", met: false },
      { criterion: "Average annual turnover (3 yrs)", required: "≥ ₹1.4 Cr", yours: "₹21.6 Cr", met: true },
      { criterion: "Solar installation experience", required: "500 lights installed", yours: "None on record", met: false },
    ],
    timeline: [
      { label: "Published", date: "2026-09-04" },
      { label: "Bid submission", date: "2026-10-02" },
    ],
    saved: false,
  },
];

export function getTender(id: string) {
  return tenders.find((t) => t.id === id);
}

export const contractorProfile = {
  name: "Karavali Infra Builders Pvt Ltd",
  location: "Mangaluru, Karnataka",
  registration: "PWD Class I contractor",
  established: 2009,
  employees: 184,
  completeness: 86,
  bidCapacity: 285_000_000,
  missing: ["Upload the renewed ISO 45001 certificate", "Add the bid capacity statement for FY 2025-26", "Add completion certificate for the Surathkal school block (2021)"],
  turnover: [
    { year: "FY 2023-24", value: 198_000_000 },
    { year: "FY 2024-25", value: 214_000_000 },
    { year: "FY 2025-26", value: 236_000_000 },
  ],
  categories: ["Roads", "Bridges & culverts", "Urban infrastructure", "Buildings"],
  certifications: [
    { name: "ISO 9001:2015 Quality", expires: "2027-08-31", valid: true },
    { name: "ISO 14001:2015 Environment", expires: "2027-02-28", valid: true },
    { name: "ISO 45001:2018 Safety", expires: "2026-06-30", valid: false },
  ],
  plant: ["Hot-mix plant, Mulki (120 TPH)", "Wet-mix plant, Surathkal", "3 sensor pavers, 2 excavators, 14 tippers"],
  regions: ["Dakshina Kannada", "Udupi", "Uttara Kannada", "Chikkamagaluru"],
  projects: [
    { name: "SH-67 resurfacing, Puttur–Sullia (22 km)", client: "Karnataka PWD", value: 142_000_000, year: 2025, category: "Roads" },
    { name: "Stormwater drains, Mangaluru Ward 9", client: "Mangaluru City Corporation", value: 71_000_000, year: 2025, category: "Urban infrastructure" },
    { name: "Retaining wall, Agumbe Ghat", client: "Karnataka PWD", value: 98_000_000, year: 2024, category: "Roads" },
    { name: "Box culverts (7), Puttur taluk", client: "RDPR Dakshina Kannada", value: 34_000_000, year: 2024, category: "Bridges & culverts" },
    { name: "PMGSY rural roads, package DK-04", client: "KRRDA", value: 118_000_000, year: 2023, category: "Roads" },
  ],
};
