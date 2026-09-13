import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleX, Minus, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { EvidenceStatus, VariationType, VerificationStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(27,18,56,0.04)]", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-sm text-muted">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  gray: "bg-gray-100 text-gray-700 ring-gray-500/15",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  primary: "bg-primary-soft text-primary ring-primary/15",
  accent: "bg-accent-soft text-accent ring-accent/20",
};

export type Tone = keyof typeof TONES;

export function Badge({ tone = "gray", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const ICON_TONES = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof ICON_TONES;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", ICON_TONES[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export function ProgressBar({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-primary-soft", className)}>
      <div className={cn("h-full rounded-full bg-primary", barClassName)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function scoreColor(value: number, mode: "risk" | "fit") {
  if (mode === "risk") return value >= 75 ? "#dc2626" : value >= 50 ? "#d97706" : "#16a34a";
  return value >= 80 ? "#16a34a" : value >= 60 ? "#2e1a6b" : "#9ca3af";
}

export function riskLabel(score: number) {
  return score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";
}

export function ScoreRing({
  value,
  size = 56,
  stroke = 6,
  mode = "risk",
  suffix,
}: {
  value: number;
  size?: number;
  stroke?: number;
  mode?: "risk" | "fit";
  suffix?: string;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(value, mode);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede8f8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-semibold text-ink" style={{ fontSize: size * 0.3 }}>
        {value}
        {suffix}
      </span>
    </div>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified")
    return (
      <Badge tone="green">
        <CircleCheck className="size-3" /> Verified
      </Badge>
    );
  if (status === "partial")
    return (
      <Badge tone="amber">
        <TriangleAlert className="size-3" /> Partially verified
      </Badge>
    );
  return (
    <Badge tone="red">
      <CircleX className="size-3" /> Unverified
    </Badge>
  );
}

export function EvidenceIcon({ status, className }: { status: EvidenceStatus; className?: string }) {
  if (status === "verified") return <CircleCheck className={cn("size-4 text-emerald-600", className)} />;
  if (status === "missing") return <CircleX className={cn("size-4 text-red-600", className)} />;
  if (status === "mismatch") return <TriangleAlert className={cn("size-4 text-amber-600", className)} />;
  return <Minus className={cn("size-4 text-gray-400", className)} />;
}

export const EVIDENCE_STATUS_LABEL: Record<EvidenceStatus, string> = {
  verified: "Verified",
  missing: "Missing",
  mismatch: "Contradicts billing",
  na: "Not applicable",
};

export const TYPE_TONE: Record<VariationType, Tone> = {
  Cost: "accent",
  Scope: "primary",
  Materials: "amber",
  Timeline: "sky",
  Subcontractor: "violet",
};

export const STATUS_TONE: Record<string, Tone> = {
  New: "primary",
  "Under review": "amber",
  Escalated: "red",
  Cleared: "green",
};
