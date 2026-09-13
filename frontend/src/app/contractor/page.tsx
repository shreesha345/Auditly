import { ArrowRight, CalendarClock, CircleAlert, Gauge, Sparkles, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { SaveButton } from "@/components/save-button";
import { DeadlineBadge, TenderCard } from "@/components/tender-card";
import { Card, CardHeader, PageHeader, ProgressBar, StatCard } from "@/components/ui";
import { contractorProfile, tenders } from "@/lib/data";
import { daysUntil, fmtDate } from "@/lib/utils";

export default function ContractorOverview() {
  const ranked = [...tenders].sort((a, b) => b.fit - a.fit);
  const avgFit = Math.round(tenders.reduce((s, t) => s + t.fit, 0) / tenders.length);
  const closingSoon = tenders.filter((t) => daysUntil(t.deadline) <= 14);
  const upcoming = [...tenders].filter((t) => t.saved || t.fit >= 75).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Good morning, Karavali Infra"
        subtitle="New tenders from KPPP, CPPP, GeM and PMGSY portals are matched to your capability profile every morning."
        actions={
          <Link href="/contractor/tenders" className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90">
            See all matches <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Matched open tenders" value={String(tenders.length)} hint="3 new since yesterday" icon={Sparkles} tone="accent" />
        <StatCard label="Average fit" value={`${avgFit}%`} hint={`${tenders.filter((t) => t.fit >= 80).length} strong matches (80%+)`} icon={Gauge} />
        <StatCard label="Closing in 14 days" value={String(closingSoon.length)} hint="Act on these first" icon={CalendarClock} tone="amber" />
        <StatCard label="Profile completeness" value={`${contractorProfile.completeness}%`} hint="Complete it to improve match accuracy" icon={UserRoundCheck} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Top matches for you</h2>
            <Link href="/contractor/tenders" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {ranked.slice(0, 3).map((t) => (
            <TenderCard key={t.id} tender={t} action={<SaveButton initial={t.saved} compact />} />
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming deadlines" />
            <ul className="divide-y divide-line">
              {upcoming.map((t) => (
                <li key={t.id}>
                  <Link href={`/contractor/tenders/${t.id}`} className="block px-5 py-3.5 hover:bg-surface">
                    <p className="line-clamp-1 text-sm font-medium text-ink">{t.title}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted">Bid due {fmtDate(t.deadline)}</span>
                      <DeadlineBadge date={t.deadline} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Profile completeness</p>
              <span className="text-sm font-semibold text-accent">{contractorProfile.completeness}%</span>
            </div>
            <ProgressBar value={contractorProfile.completeness} className="mt-3 bg-accent-soft" barClassName="bg-accent" />
            <ul className="mt-4 space-y-2.5">
              {contractorProfile.missing.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-gray-700">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  {m}
                </li>
              ))}
            </ul>
            <Link href="/contractor/profile" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              Complete profile <ArrowRight className="size-4" />
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
