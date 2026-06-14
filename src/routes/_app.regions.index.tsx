import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { regions, trees, tags } from "@/lib/mock/data";
import { Eye, Pencil } from "lucide-react";

export const Route = createFileRoute("/_app/regions/")({
  head: () => ({ meta: [{ title: "Forest Regions" }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Forest Regions" description={`${regions.length} regions under management`} />
      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Forest Officer</TableHead>
                <TableHead className="text-right">Total Trees</TableHead>
                <TableHead className="text-right">Tagged</TableHead>
                <TableHead className="text-right">Area (ha)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((r) => {
                const total = trees.filter((t) => t.regionId === r.id).length;
                const tagged = tags.filter((g) => trees.find((t) => t.regionId === r.id && t.tagId === g.id)).length;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.officer}</TableCell>
                    <TableCell className="text-right">{total}</TableCell>
                    <TableCell className="text-right">{tagged}</TableCell>
                    <TableCell className="text-right">{r.area.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="ghost" asChild><Link to="/regions/$id" params={{ id: r.id }}><Eye className="h-4 w-4" /></Link></Button>
                        <Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}