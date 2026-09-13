"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs }: { tabs: { id: string; label: string; count?: number; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" className="flex min-w-max gap-1 border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === current.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition-colors",
                t.id === current.id ? "border-primary font-medium text-primary" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn("rounded-full px-1.5 text-xs", t.id === current.id ? "bg-primary text-white" : "bg-primary-soft text-primary")}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-6">{current.content}</div>
    </div>
  );
}
