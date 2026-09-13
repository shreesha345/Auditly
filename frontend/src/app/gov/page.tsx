import { ArrowRight, FileWarning, IndianRupee, ScanSearch, TrendingUp } from "lucide-react";
import Link from "next/link";
import { DeviationTypeChart, VariationTrendChart } from "@/components/charts";
import { Badge, Card, CardHeader, PageHeader, ScoreRing, StatCard, TYPE_TONE, VerificationBadge } from "@/components/ui";
import { alerts, contracts, deviationsByType, portfolioStats, variationTrend } from "@/lib/data";
import { fmtDate, inr, pctChange, signedPct } from "@/lib/utils";

export default function GovDashboard() {
  const top = contracts.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Oversight dashboard"
        subtitle="Post-award changes across Karnataka public works contracts. Updated 13 Sep 2026, 06:00."
        actions={
          <Link href="/gov/queue" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-ink">
            Open investigation queue <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Contracts monitored" value={portfolioStats.monitored.toLocaleString("en-IN")} hint="Across 14 agencies and 9 districts" icon={ScanSearch} />
        <StatCard label="Flagged changes" value={String(portfolioStats.flagged)} hint="+40 this month" icon={FileWarning} tone="accent" />
        <StatCard label="Value of unverified changes" value={inr(portfolioStats.unverifiedValue)} hint="No approval or matching evidence" icon={IndianRupee} tone="red" />
        <StatCard label="Average cost variation" value={`+${portfolioStats.avgVariation}%`} hint="On flagged contracts vs award value" icon={TrendingUp} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Flagged vs verified changes"
            subtitle="Last 6 months"
            action={
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-accent" /> Flagged
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> Verified
                </span>
              </div>
            }
          />
          <div className="p-4">
            <VariationTrendChart data={variationTrend} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Changes by type" subtitle={`${portfolioStats.flagged} flagged in total`} />
          <div className="p-4">
            <DeviationTypeChart data={deviationsByType} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Highest priority contracts"
            subtitle="Ranked by Investigation Priority Score"
            action={
              <Link href="/gov/queue" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {top.map((c) => (
              <li key={c.id}>
                <Link href={`/gov/contracts/${c.id}`} className="flex gap-4 px-5 py-4 hover:bg-surface">
                  <ScoreRing value={c.score} size={48} stroke={5} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate font-medium text-ink">{c.title}</p>
                      <span className="text-sm font-medium text-red-600">{signedPct(pctChange(c.awardedValue, c.currentValue))}</span>
                    </div>
                    <p className="text-xs text-muted">
                      {c.contractor} · {c.district}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-600">{c.reason}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Latest detected changes"
            action={
              <Link href="/gov/alerts" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {alerts.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link href={`/gov/contracts/${a.contractId}`} className="block px-5 py-3.5 hover:bg-surface">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={TYPE_TONE[a.type]}>{a.type}</Badge>
                    <span className="text-xs text-muted">{fmtDate(a.date)}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-ink">{a.title}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted">{a.contractTitle}</p>
                    <VerificationBadge status={a.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
