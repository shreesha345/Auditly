import { ArrowLeft, ArrowRight, CalendarClock, FileText, IndianRupee, Info, Sparkles, UserRoundX } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelationshipGraph } from "@/components/relationship-graph";
import { ReviewActions } from "@/components/review-actions";
import { Tabs } from "@/components/tabs";
import {
  Badge,
  Card,
  CardHeader,
  EVIDENCE_STATUS_LABEL,
  EvidenceIcon,
  ProgressBar,
  riskLabel,
  ScoreRing,
  scoreColor,
  TYPE_TONE,
  VerificationBadge,
} from "@/components/ui";
import { contracts, EVIDENCE_LABELS, getContract, verificationOf, type Contract, type EvidenceKind } from "@/lib/data";
import { cn, daysBetween, fmtDate, inr, pctChange, signedPct } from "@/lib/utils";

export function generateStaticParams() {
  return contracts.map((c) => ({ id: c.id }));
}

export default async function ContractPage({ params }: PageProps<"/gov/contracts/[id]">) {
  const { id } = await params;
  const c = getContract(id);
  if (!c) notFound();

  const variation = pctChange(c.awardedValue, c.currentValue);
  const slip = daysBetween(c.originalEnd, c.currentEnd);
  const allEvidence = c.variations.flatMap((v) => Object.values(v.evidence)).filter((e) => e.status !== "na");
  const counts = {
    verified: allEvidence.filter((e) => e.status === "verified").length,
    missing: allEvidence.filter((e) => e.status === "missing").length,
    mismatch: allEvidence.filter((e) => e.status === "mismatch").length,
  };

  return (
    <>
      <Link href="/gov/queue" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
        <ArrowLeft className="size-4" /> Investigation queue
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-mono">{c.id}</span>
            <Badge tone="primary">{c.category}</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{c.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {c.agency} · Awarded to <span className="text-ink">{c.contractor}</span> on {fmtDate(c.awardDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ReviewActions initialStatus={c.status} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <ScoreRing value={c.score} size={64} stroke={6} />
          <div>
            <p className="text-sm text-muted">Priority score</p>
            <p className="text-lg font-semibold" style={{ color: scoreColor(c.score, "risk") }}>
              {riskLabel(c.score)} priority
            </p>
          </div>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <IndianRupee className="size-4" /> Contract value
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {inr(c.awardedValue)} <ArrowRight className="inline size-4 text-muted" /> {inr(c.currentValue)}
          </p>
          <p className={cn("text-sm font-medium", variation > 15 ? "text-red-600" : variation > 5 ? "text-amber-700" : "text-muted")}>
            {signedPct(variation)} since award
          </p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <CalendarClock className="size-4" /> Completion date
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">{fmtDate(c.currentEnd)}</p>
          <p className={cn("text-sm font-medium", slip > 90 ? "text-red-600" : slip > 0 ? "text-amber-700" : "text-emerald-700")}>
            {slip > 0 ? `+${slip} days vs ${fmtDate(c.originalEnd)}` : "On original schedule"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <FileText className="size-4" /> Evidence checks
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {counts.verified} of {allEvidence.length} verified
          </p>
          <p className="text-sm font-medium text-red-600">
            {counts.missing} missing · {counts.mismatch} contradict billing
          </p>
        </Card>
      </div>

      <Card className="mb-6 flex gap-3 border-primary/15 bg-primary-soft/60 p-5">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-primary">Why this contract is flagged</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{c.reason}</p>
        </div>
      </Card>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview", content: <Overview c={c} /> },
          { id: "changes", label: "Changes", count: c.variations.length, content: <Changes c={c} /> },
          { id: "evidence", label: "Evidence", count: counts.missing + counts.mismatch, content: <EvidencePanel c={c} /> },
          { id: "score", label: "Priority score", content: <ScorePanel c={c} /> },
          { id: "relationships", label: "Relationships", count: c.signals.length, content: <Relationships c={c} /> },
        ]}
      />
    </>
  );
}

function Overview({ c }: { c: Contract }) {
  const rows = [
    { label: "Contract value", before: inr(c.awardedValue), after: inr(c.currentValue) },
    { label: "Completion date", before: fmtDate(c.originalEnd), after: fmtDate(c.currentEnd) },
    { label: "Scope", before: c.scope.before, after: c.scope.after },
    { label: "Key materials", before: c.materials.before, after: c.materials.after },
    {
      label: "Subcontractors",
      before: `${c.subcontractors.filter((s) => !s.addedPostAward).length} declared at bid`,
      after: `${c.subcontractors.length} working on site`,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader title="Awarded vs current" subtitle="Highlighted rows changed after award" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium" />
                <th className="px-5 py-3 font-medium">At award</th>
                <th className="px-5 py-3 font-medium">Current</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const changed = r.before !== r.after;
                return (
                  <tr key={r.label} className={cn("border-b border-line last:border-0", changed && "bg-accent-soft/40")}>
                    <td className="px-5 py-3 font-medium text-ink">{r.label}</td>
                    <td className="px-5 py-3 text-gray-600">{r.before}</td>
                    <td className={cn("px-5 py-3", changed ? "font-medium text-accent" : "text-gray-600")}>{r.after}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Subcontractors" subtitle="Share of contract value" />
        <ul className="divide-y divide-line">
          {c.subcontractors.map((s) => (
            <li key={s.name} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{s.scope}</p>
                </div>
                <span className="text-sm font-semibold text-ink">{s.share}%</span>
              </div>
              <ProgressBar value={s.share} className="mt-2" barClassName={s.flag ? "bg-red-500" : "bg-primary"} />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.addedPostAward ? <Badge tone="amber">Added after award</Badge> : <Badge tone="gray">Declared at bid</Badge>}
                {s.flag && (
                  <Badge tone="red">
                    <UserRoundX className="size-3" /> {s.flag}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Changes({ c }: { c: Contract }) {
  const items = [...c.variations].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ol className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line">
      {items.map((v) => {
        const status = verificationOf(v);
        return (
          <li key={v.id} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-5 size-[15px] rounded-full border-[3px] border-surface",
                status === "verified" ? "bg-emerald-500" : status === "partial" ? "bg-amber-500" : "bg-red-500",
              )}
            />
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={TYPE_TONE[v.type]}>{v.type}</Badge>
                  <span className="text-xs text-muted">{fmtDate(v.date)}</span>
                </div>
                <VerificationBadge status={status} />
              </div>
              <h3 className="mt-2 font-medium text-ink">{v.title}</h3>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-lg bg-surface px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-muted">Before</p>
                  <p className="text-gray-700">{v.before}</p>
                </div>
                <ArrowRight className="mx-auto hidden size-4 text-muted sm:block" />
                <div className="rounded-lg bg-accent-soft/60 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-muted">After</p>
                  <p className="font-medium text-accent">{v.after}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                <span>
                  Impact: <span className="font-medium text-ink">{v.impact}</span>
                </span>
                <span>Detected in: {v.source}</span>
              </div>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}

function EvidencePanel({ c }: { c: Contract }) {
  const kinds = Object.keys(EVIDENCE_LABELS) as EvidenceKind[];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {(["verified", "missing", "mismatch", "na"] as const).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <EvidenceIcon status={s} className="size-3.5" /> {EVIDENCE_STATUS_LABEL[s]}
          </span>
        ))}
      </div>
      {c.variations.map((v) => (
        <Card key={v.id}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge tone={TYPE_TONE[v.type]}>{v.type}</Badge>
              <p className="font-medium text-ink">{v.title}</p>
            </div>
            <VerificationBadge status={verificationOf(v)} />
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
            {kinds.map((k) => {
              const e = v.evidence[k];
              return (
                <div key={k} className={cn("bg-white p-4", e.status === "na" && "bg-gray-50/80")}>
                  <div className="flex items-center gap-2">
                    <EvidenceIcon status={e.status} />
                    <p className="text-sm font-medium text-ink">{EVIDENCE_LABELS[k]}</p>
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      e.status === "verified" ? "text-emerald-700" : e.status === "missing" ? "text-red-700" : e.status === "mismatch" ? "text-amber-700" : "text-gray-400",
                    )}
                  >
                    {EVIDENCE_STATUS_LABEL[e.status]}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{e.note}</p>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ScorePanel({ c }: { c: Contract }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="flex flex-col items-center p-6 text-center">
        <ScoreRing value={c.score} size={140} stroke={12} />
        <p className="mt-4 text-lg font-semibold" style={{ color: scoreColor(c.score, "risk") }}>
          {riskLabel(c.score)} investigation priority
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.reason}</p>
        <p className="mt-4 flex gap-2 rounded-xl bg-surface p-3 text-left text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          The score is a weighted sum of the factors on the right. It ranks where to look first; it is not a finding of wrongdoing.
        </p>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader title="Score breakdown" subtitle="Factor value × weight" />
        <ul className="divide-y divide-line">
          {c.factors.map((f) => (
            <li key={f.label} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-ink">
                  {f.label} <span className="text-xs font-normal text-muted">· weight {f.weight}%</span>
                </p>
                <p className="text-sm text-muted">
                  <span className="font-semibold text-ink">{f.value}</span>/100 → contributes{" "}
                  <span className="font-semibold text-ink">{((f.value * f.weight) / 100).toFixed(1)}</span>
                </p>
              </div>
              <ProgressBar value={f.value} className="mt-2" barClassName={f.value >= 75 ? "bg-red-500" : f.value >= 50 ? "bg-amber-500" : "bg-emerald-500"} />
              <p className="mt-2 text-[13px] text-gray-600">{f.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Relationships({ c }: { c: Contract }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Relationship graph"
          subtitle="Built from award records, company registry and site documents"
          action={
            <span className="inline-flex items-center gap-2 text-xs text-muted">
              <span className="h-0 w-6 border-t-2 border-dashed border-red-600" /> Flagged link
            </span>
          }
        />
        <div className="p-4">
          <RelationshipGraph nodes={c.graph.nodes} edges={c.graph.edges} />
        </div>
      </Card>
      <Card>
        <CardHeader title="Relationship signals" />
        {c.signals.length ? (
          <ul className="divide-y divide-line">
            {c.signals.map((s) => (
              <li key={s} className="flex gap-3 px-5 py-4 text-sm text-ink">
                <UserRoundX className="mt-0.5 size-4 shrink-0 text-red-600" />
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-muted">No shared directors, owners or addresses found between the parties on this contract.</p>
        )}
      </Card>
    </div>
  );
}
