import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { users } from "@/lib/mock/data";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/users")({
  head: () => ({ meta: [{ title: "Users" }] }),
  component: Page,
});

function Page() {
  const [list, setList] = useState(users);
  return (
    <div>
      <PageHeader title="User Management" description="Roles and permissions" action={<Button onClick={() => toast.success("User created")}><Plus className="mr-1 h-4 w-4" />Create User</Button>} />
      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Region</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{u.region ?? "—"}</TableCell>
                  <TableCell>
                    <Switch checked={u.active} onCheckedChange={(v) => { setList((xs) => xs.map((x) => x.id === u.id ? { ...x, active: v } : x)); toast.message(`${u.name} ${v ? "activated" : "deactivated"}`); }} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">Edit</Button>
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