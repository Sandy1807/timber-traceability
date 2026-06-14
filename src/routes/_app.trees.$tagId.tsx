import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getTree, getRegion, timelineFor, inspections } from "@/lib/mock/data";
import { LeafletMap } from "@/components/leaflet-map";
import { format } from "date-fns";
import { ArrowLeft, Camera, FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_app/trees/$tagId")({
  head: ({ params }) => ({ meta: [{ title: `${params.tagId} — Tree Details` }] }),
  component: Page,
  notFoundComponent: () => <div className="p-8">Tree not found.</div>,
});

function Page() {
  const { tagId } = Route.useParams();
  const tree = getTree(tagId);
  if (!tree) throw notFound();
  const region = getRegion(tree.regionId);
  const timeline = timelineFor(tagId);
  const treeInspections = inspections.filter((i) => i.tagId === tagId);

  return (
    <div>
      <PageHeader
        title={tree.name}
        description={`${tree.species} · ${tagId}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/trees"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link></Button>
            <StatusBadge status={tree.status} />
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Tree Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Tag ID" v={<span className="font-mono">{tree.tagId}</span>} />
            <Row k="Name" v={tree.name} />
            <Row k="Species" v={tree.species} />
            <Row k="Age" v={`${tree.age} years`} />
            <Row k="Diameter" v={`${tree.diameter} cm`} />
            <Row k="Height" v={`${tree.height} m`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Region" v={region?.name ?? "—"} />
            <Row k="Longitude" v={<span className="font-mono">{tree.lng.toFixed(5)}</span>} />
            <Row k="Latitude" v={<span className="font-mono">{tree.lat.toFixed(5)}</span>} />
            <Row k="Last Inspection" v={format(new Date(tree.lastInspection), "PP")} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Mini-Map</CardTitle></CardHeader>
          <CardContent className="p-0">
            <LeafletMap trees={[tree]} center={[tree.lat, tree.lng]} zoom={11} height="260px" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="mt-6">
        <TabsList>
          <TabsTrigger value="timeline">Traceability Timeline</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <Card><CardContent className="p-6">
            <ol className="relative space-y-6 border-l pl-6">
              {timeline.map((e) => (
                <li key={e.kind} className="relative">
                  <span className="absolute -left-[31px] top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-sm font-medium">{e.kind}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(e.at), "PPp")}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{e.detail}</div>
                </li>
              ))}
            </ol>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="inspections">
          <Card><CardContent className="p-6">
            {treeInspections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inspections recorded yet for this tree.</p>
            ) : (
              <ul className="divide-y">
                {treeInspections.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <div className="font-medium">{i.inspector}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(i.date), "PPp")} · Condition {i.condition}/5</div>
                      <div className="text-sm">{i.findings}</div>
                    </div>
                    <Button size="sm" variant="outline"><Download className="mr-1 h-4 w-4" />Report</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="photos">
          <Card><CardContent className="p-6">
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
              {[1,2,3,4].map((n) => (
                <div key={n} className="grid aspect-square place-items-center rounded-lg border bg-muted text-xs text-muted-foreground">Photo {n}</div>
              ))}
              <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:bg-muted/40">
                <Camera className="h-6 w-6" /> Upload
                <input type="file" className="hidden" />
              </label>
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card><CardContent className="p-6">
            <ul className="divide-y">
              {[
                { name: "Inspection Report — 2026 Q1", kind: "Inspection" },
                { name: "Compliance Certificate — TIM-CC-1182", kind: "Compliance" },
                { name: "Harvest Permit — HP-4521", kind: "Harvest" },
              ].map((d) => (
                <li key={d.name} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</div>
                  <Button size="sm" variant="outline"><Download className="mr-1 h-4 w-4" />Download</Button>
                </li>
              ))}
            </ul>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}