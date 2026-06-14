import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { audit } from "@/lib/mock/data";
import { useMemo, useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/audit")({
  head: () => ({ meta: [{ title: "Audit Logs" }] }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [mod, setMod] = useState("all");
  const modules = Array.from(new Set(audit.map((a) => a.module)));
  const rows = useMemo(() => audit.filter((a) =>
    (mod === "all" || a.module === mod) &&
    (!q || a.user.toLowerCase().includes(q.toLowerCase()) || a.action.toLowerCase().includes(q.toLowerCase()) || a.ip.includes(q))
  ).slice(0, 40), [q, mod]);

  return (
    <div>
      <PageHeader title="Audit Trail" description="Every action, user and IP" />
      <Card className="p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input placeholder="Search user, action or IP…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={mod} onValueChange={setMod}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow>
              <TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Module</TableHead><TableHead>Date Time</TableHead><TableHead>IP Address</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.user}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell className="text-muted-foreground">{a.module}</TableCell>
                  <TableCell className="text-xs">{format(new Date(a.at), "PPp")}</TableCell>
                  <TableCell className="font-mono text-xs">{a.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}