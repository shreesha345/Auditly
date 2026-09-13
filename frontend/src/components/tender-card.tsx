import { Clock, IndianRupee, MapPin, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Tender } from "@/lib/data";
import { daysUntil, fmtDate, inr } from "@/lib/utils";
import { Badge, ScoreRing } from "./ui";

export function DeadlineBadge({ date }: { date: string }) {
  const days = daysUntil(date);
  const tone = days <= 7 ? "red" : days <= 14 ? "amber" : "gray";
  return (
    <Badge tone={tone}>
      <Clock className="size-3" />
      {days < 0 ? "Closed" : days === 0 ? "Closes today" : `${days} days left`}
    </Badge>
  );
}

export function TenderCard({ tender: t, action }: { tender: Tender; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_6px_24px_rgba(27,18,56,0.07)]">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <ScoreRing value={t.fit} mode="fit" size={60} suffix="%" />
          <span className="text-[11px] text-muted">fit</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/contractor/tenders/${t.id}`} className="font-medium text-ink hover:text-accent">
                {t.title}
              </Link>
              <p className="mt-0.5 text-xs text-muted">
                {t.buyer} · {t.portal}
              </p>
            </div>
            {action}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <IndianRupee className="size-3.5 text-muted" />
              {inr(t.value)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-muted" />
              {t.location}
            </span>
            <span>Due {fmtDate(t.deadline)}</span>
            <DeadlineBadge date={t.deadline} />
            <Badge tone="primary">{t.category}</Badge>
          </div>
          <p className="mt-3 flex gap-2 text-[13px] leading-relaxed text-gray-700">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {t.reasons[0]}
          </p>
          {t.gaps.length > 0 && (
            <p className="mt-1.5 flex gap-2 text-[13px] leading-relaxed text-amber-800">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              {t.gaps[0].text}
              {t.gaps.length > 1 && <span className="text-muted"> +{t.gaps.length - 1} more</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
