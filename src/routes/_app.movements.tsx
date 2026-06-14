import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { movements, getRegion } from "@/lib/mock/data";
import { format } from "date-fns";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/_app/movements")({
  head: () => ({ meta: [{ title: "Timber Movement" }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Timber Movement Tracking" description="Dispatch, transit and delivery of harvested timber" action={<Button><Truck className="mr-1 h-4 w-4" />New Dispatch</Button>} />
      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Movement ID</TableHead><TableHead>Source Forest</TableHead><TableHead>Tag</TableHead><TableHead>Vehicle</TableHead><TableHead>Driver</TableHead><TableHead>Destination</TableHead><TableHead>Dispatched</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell>{getRegion(m.sourceRegionId)?.name}</TableCell>
                  <TableCell className="font-mono text-xs">{m.tagId}</TableCell>
                  <TableCell className="font-mono text-xs">{m.vehicle}</TableCell>
                  <TableCell>{m.driver}</TableCell>
                  <TableCell>{m.destination}</TableCell>
                  <TableCell className="text-xs">{format(new Date(m.dispatchedAt), "PP")}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}