import { Award, CircleAlert, Factory, MapPin, Sparkles, Upload } from "lucide-react";
import { Badge, Card, CardHeader, PageHeader, ProgressBar } from "@/components/ui";
import { contractorProfile as p } from "@/lib/data";
import { fmtDate, inr } from "@/lib/utils";

export default function ProfilePage() {
  const maxTurnover = Math.max(...p.turnover.map((t) => t.value));
  const avgTurnover = p.turnover.reduce((s, t) => s + t.value, 0) / p.turnover.length;

  return (
    <>
      <PageHeader
        title="Capability profile"
        subtitle="Auditly builds this from your work orders, completion certificates and financial statements. It is what every tender is matched against."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90">
            <Upload className="size-4" /> Upload documents
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="flex flex-wrap items-start gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-accent text-lg font-semibold text-white">KI</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-ink">{p.name}</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-4" /> {p.location}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="primary">{p.registration}</Badge>
                  <Badge tone="gray">Est. {p.established}</Badge>
                  <Badge tone="gray">{p.employees} employees</Badge>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted">Avg. turnover (3 yrs)</p>
                <p className="text-lg font-semibold text-ink">{inr(avgTurnover)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Computed bid capacity</p>
                <p className="text-lg font-semibold text-ink">{inr(p.bidCapacity)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Completed public works</p>
                <p className="text-lg font-semibold text-ink">{p.projects.length} in 3 yrs</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Annual turnover" subtitle="From audited balance sheets" />
            <div className="space-y-4 p-5">
              {p.turnover.map((t) => (
                <div key={t.year} className="flex items-center gap-4">
                  <span className="w-20 shrink-0 text-sm text-muted">{t.year}</span>
                  <ProgressBar value={(t.value / maxTurnover) * 100} className="h-3 bg-accent-soft" barClassName="bg-accent" />
                  <span className="w-24 shrink-0 text-right text-sm font-medium text-ink">{inr(t.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Past projects" subtitle="Extracted from completion certificates" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-medium">Project</th>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 text-right font-medium">Value</th>
                    <th className="px-5 py-3 text-right font-medium">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {p.projects.map((pr) => (
                    <tr key={pr.name} className="border-b border-line last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">{pr.name}</td>
                      <td className="px-5 py-3 text-gray-600">{pr.client}</td>
                      <td className="px-5 py-3">
                        <Badge tone="primary">{pr.category}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right text-ink">{inr(pr.value)}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{pr.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-line bg-white p-8 text-center hover:border-accent/40">
            <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
              <Upload className="size-5" />
            </span>
            <p className="mt-3 font-medium text-ink">Drop work orders, completion certificates or balance sheets</p>
            <p className="mt-1 text-sm text-muted">PDF or scanned images. AI extracts projects, values, dates and certifications into your profile.</p>
            <input type="file" className="sr-only" multiple />
          </label>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Profile completeness</p>
              <span className="text-sm font-semibold text-accent">{p.completeness}%</span>
            </div>
            <ProgressBar value={p.completeness} className="mt-3 bg-accent-soft" barClassName="bg-accent" />
            <ul className="mt-4 space-y-2.5">
              {p.missing.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-gray-700">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  {m}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Work categories" />
            <div className="flex flex-wrap gap-2 p-5">
              {p.categories.map((c) => (
                <Badge key={c} tone="accent" className="px-3 py-1 text-sm">
                  {c}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Certifications" />
            <ul className="divide-y divide-line">
              {p.certifications.map((c) => (
                <li key={c.name} className="flex items-center gap-3 px-5 py-3">
                  <Award className={c.valid ? "size-5 text-emerald-600" : "size-5 text-red-600"} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-muted">
                      {c.valid ? "Valid until" : "Expired"} {fmtDate(c.expires)}
                    </p>
                  </div>
                  {c.valid ? <Badge tone="green">Valid</Badge> : <Badge tone="red">Renew</Badge>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Plant & machinery" />
            <ul className="space-y-2.5 p-5">
              {p.plant.map((x) => (
                <li key={x} className="flex gap-2 text-sm text-gray-700">
                  <Factory className="mt-0.5 size-4 shrink-0 text-muted" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Operating regions" />
            <div className="flex flex-wrap gap-2 p-5">
              {p.regions.map((r) => (
                <Badge key={r} tone="gray" className="px-3 py-1 text-sm">
                  <MapPin className="size-3" /> {r}
                </Badge>
              ))}
            </div>
          </Card>

          <p className="flex gap-2 px-1 text-xs leading-relaxed text-muted">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
            Match scores update automatically whenever this profile changes.
          </p>
        </div>
      </div>
    </>
  );
}
