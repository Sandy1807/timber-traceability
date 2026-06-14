import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tags } from "@/lib/mock/data";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tags")({
  head: () => ({ meta: [{ title: "Tag Management" }] }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const rows = tags.filter((t) => !q || t.id.toLowerCase().includes(q.toLowerCase())).slice(0, 25);
  return (
    <div>
      <PageHeader title="Tag Management" description="RFID, UHF and QR tag inventory" action={<Button onClick={() => toast.success("Assigned new tag")}>Assign Tag</Button>} />
      <Card className="p-4">
        <Input placeholder="Search tag ID…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Tag ID</TableHead><TableHead>Type</TableHead><TableHead>Assigned Tree</TableHead><TableHead>Assignment Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell className="font-mono text-xs">{t.assignedTo ?? "—"}</TableCell>
                  <TableCell className="text-xs">{t.assignedDate ? format(new Date(t.assignedDate), "PP") : "—"}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toast.info("Tag replaced")}>Replace</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.error("Tag deactivated")}>Deactivate</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}