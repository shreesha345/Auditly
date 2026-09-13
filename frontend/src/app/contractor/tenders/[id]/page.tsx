import { ArrowLeft, CircleCheck, CircleX, ExternalLink, Lightbulb, Lock, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/save-button";
import { DeadlineBadge } from "@/components/tender-card";
import { Badge, Card, CardHeader, ScoreRing } from "@/components/ui";
import { getTender, tenders } from "@/lib/data";
import { cn, daysUntil, fmtDate, inr } from "@/lib/utils";

export function generateStaticParams() {
  return tenders.map((t) => ({ id: t.id }));
}

export default async function TenderPage({ params }: PageProps<"/contractor/tenders/[id]">) {
  const { id } = await params;
  const t = getTender(id);
  if (!t) notFound();

  const met = t.eligibility.filter((e) => e.met).length;
  const facts = [
    ["Estimated value", inr(t.value)],
    ["Earnest money deposit", inr(t.emd)],
    ["Category", t.category],
    ["Location", t.location],
    ["Buyer", t.buyer],
    ["Portal", t.portal],
  ];

  return (
    <>
      <Link href="/contractor/tenders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" /> Matched tenders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-mono">{t.id}</span>
            <DeadlineBadge date={t.deadline} />
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{t.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {t.buyer} · Published {fmtDate(t.published)} on {t.portal}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SaveButton initial={t.saved} />
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90">
            View on {t.portal} <ExternalLink className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center">
                <ScoreRing value={t.fit} mode="fit" size={104} stroke={10} suffix="%" />
                <span className="mt-1 text-xs text-muted">match</span>
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-accent">
                  <Sparkles className="size-4" /> Why this matches you
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{t.summary}</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-2 border-t border-line pt-5">
              {t.reasons.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-gray-700">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Eligibility checklist" subtitle={`You meet ${met} of ${t.eligibility.length} criteria, extracted from the tender document`} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-medium">Criterion</th>
                    <th className="px-5 py-3 font-medium">Required</th>
                    <th className="px-5 py-3 font-medium">Yours</th>
                    <th className="px-5 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {t.eligibility.map((e) => (
                    <tr key={e.criterion} className={cn("border-b border-line last:border-0", !e.met && "bg-red-50/50")}>
                      <td className="px-5 py-3 font-medium text-ink">{e.criterion}</td>
                      <td className="px-5 py-3 text-gray-600">{e.required}</td>
                      <td className={cn("px-5 py-3", e.met ? "text-gray-700" : "font-medium text-red-700")}>{e.yours}</td>
                      <td className="px-5 py-3">
                        {e.met ? <CircleCheck className="size-5 text-emerald-600" /> : <CircleX className="size-5 text-red-600" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {t.gaps.length > 0 && (
            <Card>
              <CardHeader title="Gaps and how to close them" />
              <ul className="divide-y divide-line">
                {t.gaps.map((g) => (
                  <li key={g.text} className="px-5 py-4">
                    <p className="flex gap-2 text-sm font-medium text-amber-800">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                      {g.text}
                    </p>
                    <p className="ml-6 mt-1.5 flex gap-2 text-sm text-gray-600">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" />
                      {g.fix}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Key facts" />
            <dl className="divide-y divide-line">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Key dates" />
            <ol className="px-5 py-4">
              {t.timeline.map((step, i) => {
                const days = daysUntil(step.date);
                const past = days < 0;
                const isDeadline = step.date === t.deadline;
                return (
                  <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < t.timeline.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-line" />}
                    <span className={cn("relative mt-1.5 size-[11px] shrink-0 rounded-full", past ? "bg-gray-300" : isDeadline ? "bg-accent" : "bg-primary")} />
                    <div className="flex flex-1 flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className={cn("text-sm", past ? "text-muted" : "font-medium text-ink")}>{step.label}</p>
                        <p className="text-xs text-muted">{fmtDate(step.date)}</p>
                      </div>
                      {!past && <span className={cn("text-xs", isDeadline ? "font-medium text-accent" : "text-muted")}>in {days} days</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="select-none p-5 blur-[3px]" aria-hidden>
              <p className="font-semibold text-ink">Deep eligibility analysis</p>
              <p className="mt-2 text-sm text-gray-600">Clause-by-clause reading of the tender, bid capacity formula, JV rules, similar-work definitions and a bid checklist.</p>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded bg-primary-soft" />
                <div className="h-2 w-4/5 rounded bg-primary-soft" />
                <div className="h-2 w-3/5 rounded bg-primary-soft" />
              </div>
            </div>
            <div className="absolute inset-0 grid place-items-center bg-white/60 p-5 text-center">
              <div>
                <span className="mx-auto grid size-10 place-items-center rounded-full bg-accent text-white">
                  <Lock className="size-5" />
                </span>
                <p className="mt-2 font-semibold text-ink">Premium</p>
                <p className="text-xs text-muted">Deep eligibility analysis and deadline alerts</p>
                <Badge tone="accent" className="mt-2">
                  Upgrade to unlock
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
