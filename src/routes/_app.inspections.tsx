import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inspections } from "@/lib/mock/data";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/inspections")({
  head: () => ({ meta: [{ title: "Inspections" }] }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const rows = inspections.filter((i) => !q || i.tagId.includes(q.toUpperCase()) || i.inspector.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
  return (
    <div>
      <PageHeader title="Inspection Management" description="Field condition reports" action={<Button onClick={() => toast.success("Inspection added")}><Plus className="mr-1 h-4 w-4" />Add Inspection</Button>} />
      <Card className="p-4">
        <Input placeholder="Search by tag or inspector…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Inspection ID</TableHead><TableHead>Tag ID</TableHead><TableHead>Inspector</TableHead><TableHead>Date</TableHead><TableHead>Findings</TableHead><TableHead>Condition</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="font-mono text-xs">{i.tagId}</TableCell>
                  <TableCell>{i.inspector}</TableCell>
                  <TableCell className="text-xs">{format(new Date(i.date), "PP")}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-muted-foreground">{i.findings}</TableCell>
                  <TableCell>
                    <div className="inline-flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={`h-2 w-3 rounded ${idx < i.condition ? "bg-primary" : "bg-muted"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
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