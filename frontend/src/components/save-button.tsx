"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SaveButton({ initial, compact }: { initial: boolean; compact?: boolean }) {
  const [saved, setSaved] = useState(initial);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors",
        compact ? "w-10" : "px-3.5",
        saved ? "border-accent/30 bg-accent-soft text-accent" : "border-line bg-white text-ink hover:bg-surface",
      )}
      aria-label={saved ? "Remove from saved" : "Save tender"}
    >
      <Icon className="size-4" />
      {!compact && (saved ? "Saved" : "Save")}
    </button>
  );
}
