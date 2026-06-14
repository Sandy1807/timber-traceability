import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, FileSpreadsheet, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports" }] }),
  component: Page,
});

const REPORTS = [
  { name: "Tree Inventory Report", desc: "Counts and species mix across all regions", icon: FileBarChart },
  { name: "Region Report", desc: "Officer-wise area, coverage and compliance", icon: FileText },
  { name: "Inspection Report", desc: "All inspections in a date range", icon: FileSpreadsheet },
  { name: "Timber Movement Report", desc: "Dispatch, transit and delivery ledger", icon: FileBarChart },
  { name: "Tag Utilization Report", desc: "Assigned vs unassigned vs deactivated", icon: FileSpreadsheet },
];

function Page() {
  const gen = (n: string, f: string) => toast.success(`${n} generated (${f})`);
  return (
    <div>
      <PageHeader title="Reports" description="Generate and export operational reports" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.name}>
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><r.icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base">{r.name}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => gen(r.name, "PDF")}><Download className="mr-1 h-4 w-4" />PDF</Button>
              <Button size="sm" variant="outline" onClick={() => gen(r.name, "Excel")}><Download className="mr-1 h-4 w-4" />Excel</Button>
              <Button size="sm" variant="outline" onClick={() => gen(r.name, "CSV")}><Download className="mr-1 h-4 w-4" />CSV</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}