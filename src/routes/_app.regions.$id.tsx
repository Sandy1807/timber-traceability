import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRegion, trees, inspections } from "@/lib/mock/data";
import { LeafletMap } from "@/components/leaflet-map";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/regions/$id")({
  head: ({ params }) => ({ meta: [{ title: `Region ${params.id}` }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const r = getRegion(id);
  if (!r) throw notFound();
  const regionTrees = trees.filter((t) => t.regionId === id);
  const tagIds = new Set(regionTrees.map((t) => t.tagId));
  const regionInspections = inspections.filter((i) => tagIds.has(i.tagId));

  return (
    <div>
      <PageHeader
        title={r.name}
        description={`Officer ${r.officer} · ${r.area.toLocaleString()} ha`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/regions"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link></Button>
            <StatusBadge status={r.status} />
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { l: "Trees", v: regionTrees.length },
          { l: "Active", v: regionTrees.filter((t) => t.status === "Active").length },
          { l: "Inspections", v: regionInspections.length },
          { l: "Area (ha)", v: r.area.toLocaleString() },
        ].map((s) => (
          <Card key={s.l}><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">{s.l}</div><div className="mt-1 font-display text-2xl font-semibold">{s.v}</div></CardContent></Card>
        ))}
      </div>
      <Card className="mt-4 p-2">
        <LeafletMap trees={regionTrees} regions={[r]} center={r.center} zoom={9} height="50vh" />
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Trees in Region</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Tag</TableHead><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {regionTrees.slice(0, 8).map((t) => (
                  <TableRow key={t.tagId}>
                    <TableCell className="font-mono text-xs"><Link to="/trees/$tagId" params={{ tagId: t.tagId }} className="text-primary hover:underline">{t.tagId}</Link></TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Inspections</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {regionInspections.slice(0, 6).map((i) => (
                <li key={i.id} className="py-2">
                  <div className="font-medium">{i.inspector} <span className="text-muted-foreground">on {i.tagId}</span></div>
                  <div className="text-xs text-muted-foreground">{format(new Date(i.date), "PPp")} · Condition {i.condition}/5</div>
                </li>
              ))}
              {regionInspections.length === 0 && <li className="py-2 text-muted-foreground">No inspections recorded.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}