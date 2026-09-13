import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge, Card, PageHeader, TYPE_TONE, VerificationBadge } from "@/components/ui";
import { alerts } from "@/lib/data";
import { fmtDate } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AlertsPage() {
  const groups = new Map<string, typeof alerts>();
  for (const a of alerts) {
    const [y, m] = a.date.split("-").map(Number);
    const key = `${MONTHS[m - 1]} ${y}`;
    groups.set(key, [...(groups.get(key) ?? []), a]);
  }
  const unverified = alerts.filter((a) => a.status === "unverified").length;

  return (
    <>
      <PageHeader
        title="Detected changes"
        subtitle={`Every post-award change the Contract Change Detector has found, newest first. ${unverified} of ${alerts.length} have no supporting evidence at all.`}
      />
      <div className="space-y-8">
        {[...groups].map(([month, items]) => (
          <section key={month}>
            <h2 className="mb-3 text-sm font-medium text-muted">{month}</h2>
            <Card>
              <ul className="divide-y divide-line">
                {items.map((a) => (
                  <li key={a.id}>
                    <Link href={`/gov/contracts/${a.contractId}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-surface">
                      <div className="w-20 shrink-0 text-xs text-muted">{fmtDate(a.date)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={TYPE_TONE[a.type]}>{a.type}</Badge>
                          <p className="font-medium text-ink">{a.title}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {a.contractTitle} · {a.district} · Impact: <span className="text-ink">{a.impact}</span>
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <VerificationBadge status={a.status} />
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))}
      </div>
    </>
  );
}
