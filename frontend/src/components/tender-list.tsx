"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { tenders } from "@/lib/data";
import { SaveButton } from "./save-button";
import { TenderCard } from "./tender-card";

const CATEGORIES = ["All", ...new Set(tenders.map((t) => t.category))];

export function TenderList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [minFit, setMinFit] = useState(0);
  const [sort, setSort] = useState<"fit" | "deadline" | "value">("fit");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tenders
      .filter((t) => !needle || [t.title, t.buyer, t.location, t.portal].some((s) => s.toLowerCase().includes(needle)))
      .filter((t) => category === "All" || t.category === category)
      .filter((t) => t.fit >= minFit)
      .sort((a, b) => (sort === "fit" ? b.fit - a.fit : sort === "deadline" ? a.deadline.localeCompare(b.deadline) : b.value - a.value));
  }, [q, category, minFit, sort]);

  const select = "h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="flex h-10 min-w-0 flex-1 basis-60 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm focus-within:border-accent">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, buyer, location or portal" className="w-full bg-transparent outline-none placeholder:text-muted" />
        </label>
        <select className={select} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>
        <select className={select} value={minFit} onChange={(e) => setMinFit(Number(e.target.value))} aria-label="Minimum fit">
          <option value={0}>Any fit</option>
          <option value={60}>Fit 60%+</option>
          <option value={80}>Fit 80%+</option>
        </select>
        <select className={select} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
          <option value="fit">Sort: best fit</option>
          <option value="deadline">Sort: closing soonest</option>
          <option value="value">Sort: highest value</option>
        </select>
      </div>

      <p className="text-sm text-muted">
        {rows.length} {rows.length === 1 ? "tender" : "tenders"} across KPPP, CPPP, GeM and PMGSY portals
      </p>

      <div className="space-y-3">
        {rows.map((t) => (
          <TenderCard key={t.id} tender={t} action={<SaveButton initial={t.saved} compact />} />
        ))}
        {rows.length === 0 && <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-muted">No tenders match these filters.</div>}
      </div>
    </div>
  );
}
