// Fixed "today" so days-left values are deterministic and match between server and client.
export const TODAY = "2026-09-13";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Indian currency: ₹61.90 Cr, ₹24.8 L */
export function inr(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function pctChange(from: number, to: number) {
  return ((to - from) / from) * 100;
}

export function signedPct(n: number, digits = 1) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

function toUtc(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(from: string, to: string) {
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

export function daysUntil(date: string) {
  return daysBetween(TODAY, date);
}

export function fmtDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
