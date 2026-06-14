import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trees, regions, type TreeStatus } from "@/lib/mock/data";
import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Eye, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/trees/")({
  head: () => ({ meta: [{ title: "Tree Registry — Timber Traceability" }] }),
  component: Page,
});

type SortKey = "tagId" | "name" | "species" | "lastInspection" | "status";

function Page() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ k: SortKey; dir: "asc" | "desc" }>({ k: "tagId", dir: "asc" });

  const filtered = useMemo(() => {
    const f = trees.filter((t) =>
      (region === "all" || t.regionId === region) &&
      (status === "all" || t.status === status) &&
      (!q || t.tagId.toLowerCase().includes(q.toLowerCase()) || t.name.toLowerCase().includes(q.toLowerCase()) || t.species.toLowerCase().includes(q.toLowerCase()))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...f].sort((a, b) => String(a[sort.k]).localeCompare(String(b[sort.k])) * dir);
  }, [q, region, status, sort]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const sortBtn = (k: SortKey, label: string) => (
    <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => ({ k, dir: s.k === k && s.dir === "asc" ? "desc" : "asc" }))}>
      {label} <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );

  const exportCsv = () => {
    const headers = ["Tag ID","Name","Species","Region","Lng","Lat","Last Inspection","Status"];
    const rows = filtered.map((t) => [t.tagId, t.name, t.species, regions.find((r) => r.id === t.regionId)?.name ?? "", t.lng, t.lat, t.lastInspection, t.status]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tree-registry.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div>
      <PageHeader
        title="Tree Registry"
        description={`${filtered.length.toLocaleString()} trees`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" />CSV</Button>
            <Button variant="outline" onClick={() => toast.info("Excel export queued")}><Download className="mr-1 h-4 w-4" />Excel</Button>
            <Button asChild><Link to="/trees/register">Register Tree</Link></Button>
          </div>
        }
      />
      <Card className="p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <Input placeholder="Search tag, name, species…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <Select value={region} onValueChange={(v) => { setRegion(v); setPage(1); }}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(["Active","Under Inspection","Harvested","Archived"] as TreeStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{sortBtn("tagId", "Tag ID")}</TableHead>
                <TableHead>{sortBtn("name", "Tree Name")}</TableHead>
                <TableHead>{sortBtn("species", "Species")}</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Longitude</TableHead>
                <TableHead className="text-right">Latitude</TableHead>
                <TableHead>{sortBtn("lastInspection", "Last Inspection")}</TableHead>
                <TableHead>{sortBtn("status", "Status")}</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.tagId}>
                  <TableCell className="font-mono text-xs">{t.tagId}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.species}</TableCell>
                  <TableCell>{regions.find((r) => r.id === t.regionId)?.name}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{t.lng.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{t.lat.toFixed(4)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(t.lastInspection), "PP")}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" asChild><Link to="/trees/$tagId" params={{ tagId: t.tagId }}><Eye className="h-4 w-4" /></Link></Button>
                      <Button size="sm" variant="ghost" onClick={() => nav({ to: "/map", search: { tag: t.tagId } as any })}><MapPin className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div>Page {page} of {pageCount}</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}