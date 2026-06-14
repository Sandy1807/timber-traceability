import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trees, MapPinned, Tag as TagIcon, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { trees, regions, kpis, audit, notifications } from "@/lib/mock/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Timber Traceability" }] }),
  component: Dashboard,
});

function KpiCard({ label, value, icon: Icon, delta, up }: { label: string; value: string; icon: any; delta: string; up?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        </div>
        <div className={`mt-3 inline-flex items-center gap-1 text-xs ${up ? "text-primary" : "text-destructive"}`}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {delta}
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const byRegion = regions.slice(0, 8).map((r) => ({
    name: r.name.split(" ")[0],
    trees: trees.filter((t) => t.regionId === r.id).length,
  }));
  const byStatus = ["Active", "Under Inspection", "Harvested", "Archived"].map((s) => ({
    name: s, value: trees.filter((t) => t.status === s).length,
  }));
  const colors = ["#22c55e", "#f59e0b", "#a16207", "#64748b"];
  const trend = Array.from({ length: 12 }, (_, i) => ({
    month: format(new Date(2026, i, 1), "MMM"),
    inspections: 30 + Math.round(Math.sin(i / 2) * 12 + i * 1.5),
  }));

  return (
    <div>
      <PageHeader title="Dashboard" description="Live snapshot of the registry, regions and field activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Trees" value={kpis.totalTrees.toLocaleString()} icon={Trees} delta="+1.2% vs last week" up />
        <KpiCard label="Forest Regions" value={String(kpis.totalRegions)} icon={MapPinned} delta="2 newly mapped" up />
        <KpiCard label="Active Tree Tags" value={kpis.activeTags.toLocaleString()} icon={TagIcon} delta="98.0% coverage" up />
        <KpiCard label="Needing Inspection" value={String(kpis.pendingInspections)} icon={AlertTriangle} delta="+18 overdue" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Trees by Region</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRegion}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="trees" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Status Mix</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {byStatus.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {byStatus.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} /> {s.name}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Inspections — Last 12 months</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="month" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="inspections" stroke="#22c55e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <Link key={n.id} to="/notifications" className="block rounded-lg border p-3 hover:bg-muted/40">
                <div className="text-xs font-medium text-primary">{n.kind}</div>
                <div className="text-sm">{n.message}</div>
                <div className="text-[10px] text-muted-foreground">{format(new Date(n.at), "PP p")}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {audit.slice(0, 6).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <div className="min-w-0"><span className="font-medium">{a.user}</span> <span className="text-muted-foreground">{a.action.toLowerCase()}</span> <span className="text-muted-foreground">in</span> <span className="text-primary">{a.module}</span></div>
                <div className="text-xs text-muted-foreground">{format(new Date(a.at), "PP p")}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}