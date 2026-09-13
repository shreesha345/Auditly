import { ArrowRight, Gauge, HardHat, Handshake, Landmark, Link2, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "next/link";

const MODULES = [
  {
    icon: ScanSearch,
    title: "Contract Change Detector",
    body: "Compares the awarded contract against amendments, reports and payments to flag changes in cost, scope, materials, timeline or subcontractors.",
    tone: "primary",
  },
  {
    icon: Link2,
    title: "Evidence Linker",
    body: "Checks every flagged change against approvals, change orders, inspection reports and invoices, and marks it verified or unverified.",
    tone: "accent",
  },
  {
    icon: Gauge,
    title: "Investigation Priority Score",
    body: "Ranks flagged contracts by financial variation, evidence gaps and relationship signals, with a plain-language reason for every score.",
    tone: "primary",
  },
  {
    icon: Handshake,
    title: "AI Tender Matching Engine",
    body: "Profiles contractor capability, scores fit against open tenders and explains the match, gaps and deadlines in plain language.",
    tone: "accent",
  },
];

const PIPELINE = ["Public portals & records", "Scrape · OCR · LLM extraction", "Detect changes & match", "Link evidence & score", "Dashboards"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 size-[480px] rounded-full bg-violet-600/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-accent">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-xl font-semibold tracking-tight">Auditly</span>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">Prototype · sample data</span>
          </nav>

          <div className="mt-16 max-w-3xl sm:mt-24">
            <p className="text-sm font-medium text-pink-300">Manipal Hackathon 2026 · Smart Governance & Compliance</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Follow every rupee after the contract is awarded.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Auditly catches unverified post-award changes to cost, scope, materials, timelines and subcontractors, links each one to its evidence, and ranks what to
              investigate first. The same intelligence helps legitimate contractors find tenders they actually qualify for.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Link href="/gov" className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:bg-white/[0.1]">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-500/90">
                <Landmark className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">Government & auditors</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                An investigation queue of flagged contracts, evidence checklists for every change, and relationship graphs that surface hidden links.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200">
                Open oversight dashboard <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/contractor" className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:bg-white/[0.1]">
              <span className="grid size-11 place-items-center rounded-xl bg-accent">
                <HardHat className="size-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">Contractors & SMEs</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Tenders from every portal, ranked by how well they fit your capability, with eligibility gaps and deadlines explained in plain language.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-pink-200">
                Find matching tenders <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">One shared intelligence layer, four engines</h2>
        <p className="mt-2 text-muted">Governments lose track of what changes after award, and contractors cannot find the tenders that fit them. Auditly serves both.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {MODULES.map(({ icon: Icon, title, body, tone }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
              <span className={`grid size-11 shrink-0 place-items-center rounded-full text-white ${tone === "primary" ? "bg-primary" : "bg-accent"}`}>
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className={`font-semibold ${tone === "primary" ? "text-primary" : "text-accent"}`}>{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-white p-6">
          <p className="text-sm font-medium text-ink">How it works</p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-5">
            {PIPELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-3 rounded-xl bg-surface p-3 text-sm text-ink sm:flex-col sm:items-start">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        Team Auditly · Manipal Hackathon 2026 · Supporting UN SDG 16: Peace, Justice & Strong Institutions
      </footer>
    </div>
  );
}
