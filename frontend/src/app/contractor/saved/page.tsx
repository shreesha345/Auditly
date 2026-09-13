import { BellRing, Lock, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SaveButton } from "@/components/save-button";
import { DeadlineBadge, TenderCard } from "@/components/tender-card";
import { Card, CardHeader, PageHeader } from "@/components/ui";
import { tenders } from "@/lib/data";
import { daysUntil, fmtDate } from "@/lib/utils";

export default function SavedPage() {
  const saved = tenders.filter((t) => t.saved).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const milestones = saved
    .flatMap((t) => t.timeline.map((m) => ({ ...m, tender: t })))
    .filter((m) => daysUntil(m.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHeader title="Saved tenders & deadlines" subtitle="Tenders you are tracking, with every upcoming pre-bid meeting, submission and opening date in one place." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {saved.map((t) => (
            <TenderCard key={t.id} tender={t} action={<SaveButton initial compact />} />
          ))}
          {saved.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-muted">
              Nothing saved yet.{" "}
              <Link href="/contractor/tenders" className="text-accent hover:underline">
                Browse matched tenders
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming dates" subtitle="From your saved tenders" />
            <ul className="divide-y divide-line">
              {milestones.map((m) => (
                <li key={`${m.tender.id}-${m.label}`} className="flex gap-3 px-5 py-3">
                  <div className="w-12 shrink-0 rounded-lg bg-surface py-1 text-center">
                    <p className="text-[10px] uppercase text-muted">{fmtDate(m.date).split(" ")[1]}</p>
                    <p className="text-base font-semibold leading-tight text-ink">{fmtDate(m.date).split(" ")[0]}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{m.label}</p>
                    <p className="truncate text-xs text-muted">{m.tender.title}</p>
                    {m.label === "Bid submission" && (
                      <div className="mt-1">
                        <DeadlineBadge date={m.date} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <BellRing className="size-5 text-accent" />
              <p className="font-semibold text-ink">Deadline alerts</p>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                <Lock className="size-3" /> Premium
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Get reminded before pre-bid meetings and submission deadlines, and when a tender is amended.</p>
            <ul className="mt-4 space-y-3">
              {[
                { icon: Mail, label: "Email, 7 and 2 days before" },
                { icon: MessageSquare, label: "WhatsApp / SMS on the due date" },
                { icon: BellRing, label: "Alert when a corrigendum is published" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-muted">
                  <Icon className="size-4" />
                  <span className="flex-1">{label}</span>
                  <span className="h-5 w-9 rounded-full bg-gray-200 p-0.5">
                    <span className="block size-4 rounded-full bg-white shadow" />
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-5 h-10 w-full rounded-xl bg-accent text-sm font-medium text-white hover:bg-accent/90">Upgrade to Premium</button>
            <p className="mt-2 text-center text-xs text-muted">Browsing and matching stay free.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
