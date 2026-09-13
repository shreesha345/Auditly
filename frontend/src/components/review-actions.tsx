"use client";

import { CircleCheck, Download, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContractStatus } from "@/lib/data";
import { Badge, STATUS_TONE } from "./ui";

export function ReviewActions({ initialStatus }: { initialStatus: ContractStatus }) {
  const [status, setStatus] = useState<ContractStatus>(initialStatus);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const btn = "inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors";

  return (
    <>
      <Badge tone={STATUS_TONE[status]} className="h-7 px-3">
        {status}
      </Badge>
      <button
        className={`${btn} border border-line bg-white text-ink hover:bg-surface`}
        onClick={() => setToast("Audit trail export would download here (prototype).")}
      >
        <Download className="size-4" /> Export audit trail
      </button>
      <button
        className={`${btn} border border-line bg-white text-ink hover:bg-surface`}
        onClick={() => {
          setStatus("Cleared");
          setToast("Marked as cleared. Nothing was saved (prototype).");
        }}
      >
        <CircleCheck className="size-4" /> Mark cleared
      </button>
      <button
        className={`${btn} bg-primary text-white hover:bg-ink`}
        onClick={() => {
          setStatus("Escalated");
          setToast("Escalated to the vigilance officer. Nothing was sent (prototype).");
        }}
      >
        <Flag className="size-4" /> Escalate
      </button>

      {toast && (
        <div role="status" className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg sm:left-auto">
          {toast}
        </div>
      )}
    </>
  );
}
