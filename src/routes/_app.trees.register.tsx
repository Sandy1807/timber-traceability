import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { regions } from "@/lib/mock/data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/trees/register")({
  head: () => ({ meta: [{ title: "Register Tree" }] }),
  component: Page,
});

const SPECIES = ["Teak","Sal","Deodar","Rosewood","Sandalwood","Mahogany","Sheesham","Bamboo"];

function Page() {
  const nav = useNavigate();
  const year = new Date().getFullYear();
  const tagId = `TAG-${year}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`;
  const [region, setRegion] = useState(regions[0].id);

  return (
    <div>
      <PageHeader title="Tree Registration" description="Add a new tree to the registry. A unique Tag ID is auto-generated." />
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success(`Registered ${tagId}`); nav({ to: "/trees" }); }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Tree Name"><Input required placeholder="e.g. Teak #2601" /></Field>
            <Field label="Species">
              <Select defaultValue={SPECIES[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SPECIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Forest Region">
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Age (years)"><Input type="number" min={1} defaultValue={20} /></Field>
            <Field label="Height (m)"><Input type="number" min={1} defaultValue={12} /></Field>
            <Field label="Diameter (cm)"><Input type="number" min={1} defaultValue={60} /></Field>
            <Field label="Longitude"><Input type="number" step="0.0001" defaultValue={regions.find((r) => r.id === region)?.center[1]} /></Field>
            <Field label="Latitude"><Input type="number" step="0.0001" defaultValue={regions.find((r) => r.id === region)?.center[0]} /></Field>
            <Field label="Notes" className="sm:col-span-2"><Textarea rows={3} placeholder="Optional field notes" /></Field>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Auto-generated</CardTitle></CardHeader>
            <CardContent>
              <Label>Tree Tag ID</Label>
              <div className="mt-1 rounded-lg border bg-muted px-3 py-2 font-mono text-sm">{tagId}</div>
              <p className="mt-2 text-xs text-muted-foreground">Bound to a fresh RFID/UHF tag on submission.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Photo</CardTitle></CardHeader>
            <CardContent>
              <label className="grid h-32 cursor-pointer place-items-center rounded-lg border-2 border-dashed text-sm text-muted-foreground hover:bg-muted/40">
                Click to upload
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full">Register Tree</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1.5 block">{label}</Label>{children}</div>;
}