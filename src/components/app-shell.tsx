import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Trees, MapPinned, PlusCircle, Tag, ClipboardCheck, Truck,
  Map, FileBarChart, Users, ScrollText, Settings, LogOut, Bell, Sun, Moon,
  Search, TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useTheme } from "@/lib/auth";
import { notifications } from "@/lib/mock/data";
import { useEffect, useState } from "react";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/trees", icon: Trees, label: "Tree Registry" },
  { to: "/regions", icon: MapPinned, label: "Forest Regions" },
  { to: "/trees/register", icon: PlusCircle, label: "Tree Registration" },
  { to: "/tags", icon: Tag, label: "Tag Management" },
  { to: "/inspections", icon: ClipboardCheck, label: "Inspections" },
  { to: "/movements", icon: Truck, label: "Timber Movement" },
  { to: "/map", icon: Map, label: "Forest Map" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
];
const admin = [
  { to: "/users", icon: Users, label: "Users" },
  { to: "/audit", icon: ScrollText, label: "Audit Logs" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { session, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const nav2 = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;
  const [q, setQ] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!session && path !== "/login") nav2({ to: "/login" });
  }, [session, path, nav2]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <TreePine className="h-5 w-5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate font-display text-sm font-semibold">Timber Traceability</div>
              <div className="truncate text-xs text-muted-foreground">Forest Department</div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((i) => (
                  <SidebarMenuItem key={i.to}>
                    <SidebarMenuButton asChild isActive={path === i.to || (i.to !== "/dashboard" && path.startsWith(i.to))} tooltip={i.label}>
                      <Link to={i.to}><i.icon /><span>{i.label}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {admin.map((i) => (
                  <SidebarMenuItem key={i.to}>
                    <SidebarMenuButton asChild isActive={path.startsWith(i.to)} tooltip={i.label}>
                      <Link to={i.to}><i.icon /><span>{i.label}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { signOut(); nav2({ to: "/login" }); }} tooltip="Sign out">
                <LogOut /><span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger />
          <form
            onSubmit={(e) => { e.preventDefault(); if (q.trim()) nav2({ to: "/trees/$tagId", params: { tagId: q.trim() } }); }}
            className="relative ml-2 hidden flex-1 max-w-md md:block"
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Tree Tag ID (e.g. TAG-2026-000145)"
              className="pl-8"
            />
          </form>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/notifications" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">{unread}</span>
                )}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary text-xs text-primary-foreground">{session?.name?.[0] ?? "?"}</AvatarFallback></Avatar>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-medium leading-tight">{session?.name ?? "Guest"}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">{session?.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-normal">
                    <div className="font-medium">{session?.name}</div>
                    <div className="text-xs text-muted-foreground">{session?.email}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => { signOut(); nav2({ to: "/login" }); }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-primary/15 text-primary border-primary/30",
    "Under Inspection": "bg-amber-500/15 text-amber-500 border-amber-500/30",
    Harvested: "bg-secondary/30 text-secondary-foreground border-secondary/40",
    Archived: "bg-muted text-muted-foreground border-border",
    Pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    "In Transit": "bg-sky-500/15 text-sky-500 border-sky-500/30",
    Delivered: "bg-primary/15 text-primary border-primary/30",
    Assigned: "bg-primary/15 text-primary border-primary/30",
    Unassigned: "bg-muted text-muted-foreground border-border",
    Deactivated: "bg-destructive/15 text-destructive border-destructive/30",
    Protected: "bg-accent/30 text-accent-foreground border-accent/40",
    Restricted: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
}