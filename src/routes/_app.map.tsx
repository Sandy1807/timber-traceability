import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeafletMap } from "@/components/leaflet-map";
import { trees, regions, getTree, mapCenter } from "@/lib/mock/data";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const search = z.object({ tag: fallback(z.string().optional(), undefined), region: fallback(z.string().optional(), undefined) });

export const Route = createFileRoute("/_app/map")({
  head: () => ({ meta: [{ title: "Forest Map — Timber Traceability" }] }),
  validateSearch: zodValidator(search),
  component: Page,
});

function Page() {
  const { tag, region: initRegion } = Route.useSearch();
  const [region, setRegion] = useState<string>(initRegion ?? "all");

  const focused = tag ? getTree(tag) : undefined;
  const visible = useMemo(() => trees.filter((t) => region === "all" || t.regionId === region), [region]);
  const center: [number, number] = focused ? [focused.lat, focused.lng] : (region !== "all" ? regions.find((r) => r.id === region)?.center ?? (mapCenter as [number, number]) : (mapCenter as [number, number]));
  //const zoom = focused ? 14 : region !== "all" ? 11 : 8;
  const zoom = focused ? 15 : region !== "all" ? 12 : 9;

  return (
    <div>
      <PageHeader
        title="Forest Map View"
        description="Region boundaries, tree pins and satellite layers."
        action={
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="min-w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />
      <Card className="p-2">
        <LeafletMap trees={visible} regions={regions} center={center} zoom={zoom} height="78vh" />
      </Card>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#22c55e]" /> Active</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#f59e0b]" /> Under Inspection</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#a16207]" /> Harvested / Archived</span>
      </div>
    </div>
  );
}