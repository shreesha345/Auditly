"use client";

import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { contracts, evidenceGaps, type VariationType } from "@/lib/data";
import { cn, inr, pctChange, signedPct } from "@/lib/utils";
import { Badge, riskLabel, ScoreRing, STATUS_TONE, TYPE_TONE } from "./ui";

const TYPES: Array<"All" | VariationType> = ["All", "Cost", "Scope", "Materials", "Timeline", "Subcontractor"];
const STATUSES = ["All", "New", "Under review", "Escalated", "Cleared"];

export function QueueTable() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<"score" | "variation" | "gaps">("score");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return contracts
      .map((c) => ({ ...c, variation: pctChange(c.awardedValue, c.currentValue), gaps: evidenceGaps(c) }))
      .filter((c) => !needle || [c.title, c.id, c.agency, c.contractor, c.district].some((s) => s.toLowerCase().includes(needle)))
      .filter((c) => type === "All" || c.variations.some((v) => v.type === type))
      .filter((c) => status === "All" || c.status === status)
      .sort((a, b) => (sort === "score" ? b.score - a.score : sort === "variation" ? b.variation - a.variation : b.gaps - a.gaps));
  }, [q, type, status, sort]);

  const select = "h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-primary";

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <label className="flex h-10 min-w-0 flex-1 basis-60 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm focus-within:border-primary">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by contract, agency, contractor or district" className="w-full bg-transparent outline-none placeholder:text-muted" />
        </label>
        <select className={select} value={type} onChange={(e) => setType(e.target.value as VariationType | "All")} aria-label="Change type">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All change types" : t}
            </option>
          ))}
        </select>
        <select className={select} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <select className={select} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
          <option value="score">Sort: priority score</option>
          <option value="variation">Sort: cost variation</option>
          <option value="gaps">Sort: evidence gaps</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Contract and why it is flagged</th>
              <th className="px-4 py-3 font-medium">Changes detected</th>
              <th className="px-4 py-3 text-right font-medium">Value now</th>
              <th className="px-4 py-3 text-right font-medium">Evidence gaps</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="group border-b border-line last:border-0 hover:bg-surface">
                <td className="px-4 py-4 align-top">
                  <div className="flex items-center gap-3">
                    <ScoreRing value={c.score} size={44} stroke={5} />
                    <span className="text-xs text-muted">{riskLabel(c.score)}</span>
                  </div>
                </td>
                <td className="max-w-md px-4 py-4 align-top">
                  <Link href={`/gov/contracts/${c.id}`} className="font-medium text-ink hover:text-primary">
                    {c.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">
                    {c.id} · {c.contractor} · {c.district}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-gray-600">{c.reason}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex max-w-48 flex-wrap gap-1">
                    {[...new Set(c.variations.map((v) => v.type))].map((t) => (
                      <Badge key={t} tone={TYPE_TONE[t]}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right align-top">
                  <p className="font-medium text-ink">{inr(c.currentValue)}</p>
                  <p className={cn("text-xs font-medium", c.variation > 15 ? "text-red-600" : c.variation > 5 ? "text-amber-700" : "text-muted")}>
                    {signedPct(c.variation)}
                  </p>
                </td>
                <td className="px-4 py-4 text-right align-top">
                  <span className={cn("font-medium", c.gaps >= 5 ? "text-red-600" : c.gaps >= 3 ? "text-amber-700" : "text-ink")}>{c.gaps}</span>
                </td>
                <td className="px-4 py-4 align-top">
                  <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                </td>
                <td className="px-2 py-4 align-top">
                  <Link href={`/gov/contracts/${c.id}`} className="grid size-8 place-items-center rounded-lg text-muted group-hover:bg-white group-hover:text-primary" aria-label={`Open ${c.title}`}>
                    <ChevronRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  No contracts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-4 py-3 text-xs text-muted">
        Showing {rows.length} of {contracts.length} flagged contracts in this sample set.
      </p>
    </div>
  );
}
