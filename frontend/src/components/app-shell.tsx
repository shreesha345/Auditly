"use client";

import {
  ArrowLeftRight,
  Bell,
  Bookmark,
  Building2,
  LayoutDashboard,
  ListOrdered,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Role = "gov" | "contractor";

const NAV = {
  gov: [
    { href: "/gov", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gov/queue", label: "Investigation queue", icon: ListOrdered, also: ["/gov/contracts"] },
    { href: "/gov/alerts", label: "Detected changes", icon: Bell },
  ],
  contractor: [
    { href: "/contractor", label: "Overview", icon: LayoutDashboard },
    { href: "/contractor/tenders", label: "Matched tenders", icon: Sparkles },
    { href: "/contractor/saved", label: "Saved & deadlines", icon: Bookmark },
    { href: "/contractor/profile", label: "Capability profile", icon: Building2 },
  ],
};

const META = {
  gov: {
    section: "Oversight",
    user: "Rekha Adiga",
    org: "Procurement Audit Cell",
    initials: "RA",
    switchHref: "/contractor",
    switchLabel: "Contractor portal",
    search: "Search contracts, agencies, contractors…",
    bar: "bg-violet-400",
    avatar: "bg-primary",
  },
  contractor: {
    section: "Contractor portal",
    user: "Karavali Infra Builders",
    org: "PWD Class I · Mangaluru",
    initials: "KI",
    switchHref: "/gov",
    switchLabel: "Oversight dashboard",
    search: "Search tenders, buyers, locations…",
    bar: "bg-pink-400",
    avatar: "bg-accent",
  },
};

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const meta = META[role];

  const isActive = (item: (typeof NAV)[Role][number]) => {
    if (item.href === `/${role}`) return pathname === item.href;
    const prefixes = [item.href, ...(("also" in item && item.also) || [])];
    return prefixes.some((p) => pathname.startsWith(p));
  };

  return (
    <div className="min-h-screen lg:pl-64">
      {open && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-accent">
              <ShieldCheck className="size-[18px]" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Auditly</span>
          </Link>
          <button className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <p className="px-5 pb-2 pt-4 text-[11px] font-medium uppercase tracking-wider text-white/40">{meta.section}</p>
        <nav className="flex-1 space-y-1 px-3">
          {NAV[role].map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/10 font-medium text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                {active && <span className={cn("absolute inset-y-2 left-0 w-0.5 rounded-full", meta.bar)} />}
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 p-3">
          <Link
            href={meta.switchHref}
            className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/75 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeftRight className="size-4" />
            Switch to {meta.switchLabel}
          </Link>
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <span className={cn("grid size-8 place-items-center rounded-full text-xs font-semibold", meta.avatar)}>{meta.initials}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{meta.user}</p>
              <p className="truncate text-xs text-white/50">{meta.org}</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button className="-ml-1 rounded-md p-1.5 text-ink hover:bg-primary-soft lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-5" />
        </button>
        <label className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted sm:flex">
          <Search className="size-4" />
          <input className="w-full bg-transparent outline-none placeholder:text-muted" placeholder={meta.search} />
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/25 sm:inline">
            Prototype · sample data
          </span>
          {role === "gov" && (
            <Link href="/gov/alerts" className="relative rounded-lg p-2 text-ink hover:bg-primary-soft" aria-label="Detected changes">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
            </Link>
          )}
          <span className={cn("grid size-8 place-items-center rounded-full text-xs font-semibold text-white", meta.avatar)}>{meta.initials}</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
