import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, useTheme } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: Page,
});

const PERMS: Record<Role, string[]> = {
  "Super Admin": ["All modules", "User management", "Audit", "Settings"],
  "Forest Administrator": ["All operational modules", "Region edit", "Reports"],
  "Forest Officer": ["Tree registry", "Tag management", "Movements"],
  "Inspector": ["Inspections", "Tree details (read)"],
  "Viewer": ["Dashboard (read-only)"],
};

function Page() {
  const { session, setRole } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Name</Label><Input defaultValue={session?.name} /></div>
            <div><Label>Email</Label><Input defaultValue={session?.email} /></div>
            <div>
              <Label>Role (demo)</Label>
              <Select value={session?.role} onValueChange={(v) => { setRole(v as Role); toast.success(`Role changed to ${v}`); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Super Admin","Forest Administrator","Forest Officer","Inspector","Viewer"] as Role[]).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark mode</div>
                <div className="text-xs text-muted-foreground">Reduce glare for long shifts</div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Role Permissions</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.entries(PERMS) as [Role, string[]][]).map(([role, perms]) => (
              <div key={role} className="rounded-lg border p-3">
                <div className="text-sm font-medium">{role}</div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {perms.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}