import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "@/lib/mock/data";
import { format } from "date-fns";
import { AlertTriangle, Clock, ShieldAlert, BadgeAlert } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications" }] }),
  component: Page,
});

const ICONS = {
  "Missing Tag": BadgeAlert,
  "Overdue Inspection": Clock,
  "Unauthorized Movement": ShieldAlert,
  "Compliance": AlertTriangle,
} as const;

function Page() {
  return (
    <div>
      <PageHeader title="Alerts & Notifications" description={`${notifications.filter((n) => !n.read).length} unread`} />
      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = ICONS[n.kind];
          return (
            <Card key={n.id} className={!n.read ? "border-primary/40" : undefined}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-primary">{n.kind}</div>
                  <div className="text-sm">{n.message}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(n.at), "PPp")}</div>
                </div>
                {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}