
# Timber Traceability System — Build Plan

A complete enterprise UI prototype with mock data (no backend). All 15 modules, dark-default theme, Leaflet maps, responsive sidebar layout.

## Tech & Setup

- TanStack Start (already in template), TypeScript, Tailwind v4
- shadcn/ui components (already present)
- `react-leaflet` + `leaflet` for the map
- `recharts` for dashboard analytics
- `date-fns` for timeline formatting
- Theme: dark-by-default with light toggle (class on `<html>`, persisted in localStorage)
- Mock data lives in `src/lib/mock/` (trees, regions, tags, inspections, movements, users, audit logs, notifications) — shared across modules so search/filter/details all stay consistent

## Design System

- Nature palette mapped to semantic tokens in `src/styles.css`:
  - primary = forest green, accent = moss/lime, secondary = warm bark brown, background = deep charcoal (dark) / off-white (light)
  - status colors: Active (green), Under Inspection (amber), Harvested (brown), Archived (slate); alert severity (red/amber/blue)
- Typography pair: Space Grotesk (display) + Inter (body), loaded via `<link>` in `__root.tsx`
- Material-style cards with subtle elevation, rounded-xl, generous spacing

## App Shell

- `src/routes/_app.tsx` — pathless layout with `SidebarProvider`, collapsible sidebar, top header (search hotkey, notifications bell w/ count, theme toggle, user menu), `<Outlet/>`
- `src/routes/index.tsx` — redirects to `/login` if no mock session, else `/dashboard`
- Mock auth: `useAuth` hook backed by localStorage; selectable demo role (Super Admin default) drives RBAC visibility on menu items
- 404 + error boundaries per route stack

## Routes (file → URL)

```
login.tsx                          /login
_app.tsx                           (layout)
_app.dashboard.tsx                 /dashboard
_app.trees.index.tsx               /trees           (registry table)
_app.trees.register.tsx            /trees/register
_app.trees.$tagId.tsx              /trees/:tagId    (details)
_app.regions.index.tsx             /regions
_app.regions.$id.tsx               /regions/:id
_app.tags.tsx                      /tags
_app.inspections.tsx               /inspections
_app.movements.tsx                 /movements
_app.map.tsx                       /map
_app.reports.tsx                   /reports
_app.users.tsx                     /users
_app.audit.tsx                     /audit
_app.settings.tsx                  /settings
_app.notifications.tsx             /notifications
```

## Modules

1. **Login** — split screen: left forest illustration + branding + "Track. Monitor. Protect."; right form with validation, show/hide password, remember me, role selector for demo, "Sign in" → `/dashboard`.
2. **Dashboard** — 4 KPI cards (trees, regions, active tags, inspections due) with trend deltas; charts: trees by region (bar), inspections over time (line), status breakdown (donut), recent activity feed, alerts panel.
3. **Global Search** — header search opens command palette (cmd/ctrl-K) keyed on Tree Tag ID with recent-searches history in localStorage; jumps to details.
4. **Tree Registry** — TanStack table: sortable columns, per-column filters, pagination (10/page), CSV + XLSX export, status badges, row actions (View Details, Show On Map → `/map?tag=...`).
5. **Forest Map** — full-height Leaflet map, OSM + satellite (Esri) + terrain (OpenTopoMap) layer toggle, region polygons, marker clustering (`leaflet.markercluster`), region filter, marker popup (tag, name, species, coords, status), deep-link via `?tag=` / `?region=`.
6. **Tree Details** — header w/ status, tabs: Info, Location (mini-map), Traceability Timeline (vertical timeline with 6 event types + timestamps), Photos (gallery + upload stub), Documents (list w/ download stub).
7. **Forest Regions** — table + region detail page (stats cards, embedded mini-map of just that region, trees-within table, inspection history).
8. **Tree Registration** — multi-section form (info, location w/ lat/lng + map picker, measurements, photo upload), auto-generated Tag ID preview (`TAG-YYYY-NNNNNN`), zod validation, success toast appends to mock store.
9. **Tag Management** — table of RFID/UHF tags with assign / replace / deactivate dialogs.
10. **Inspection Management** — table + add/edit dialog (inspector, date, findings, condition rating 1–5), download report stub.
11. **Timber Movement** — table with status pills (Pending / In Transit / Delivered), detail drawer with movement timeline (dispatch → checkpoints → delivery).
12. **Notifications** — bell dropdown + full page; categorized alerts (missing tags, overdue inspections, unauthorized movement, compliance).
13. **Reports** — cards for each report type, filter controls, "Generate" → preview table + Export PDF/Excel/CSV.
14. **User Management** — table with roles, create/edit dialog, activate/deactivate toggle; RBAC matrix shown in settings.
15. **Audit Trail** — table (user, action, module, datetime, IP) with search + date-range + module filter.

## Mock Data Volume

- 18 forest regions with polygon coordinates
- ~250 trees (enough for pagination, clustering, charts) — display counters show 25,480 etc. as headline KPIs while the table works on the real 250
- 60 inspections, 40 movements, 20 users, 80 audit entries, 15 notifications

## Responsive & Theming

- Sidebar collapses to icon rail < lg; sheet drawer on mobile
- Tables become horizontally scrollable with sticky first column on small screens
- Dark default via `<html class="dark">` set pre-hydration in `__root.tsx`; toggle in header

## Technical Notes

- Map files: Leaflet CSS imported once in `__root.tsx` via `<link>` (CDN) to avoid SSR import issues; map components wrapped in client-only guard (`typeof window !== 'undefined'`) since react-leaflet touches `window`.
- Exports: CSV/XLSX via `xlsx` package; PDF via `jspdf` + `jspdf-autotable`.
- All data mutations update an in-memory store + localStorage so changes persist across navigation in the prototype.
- No Lovable Cloud, no real auth, no real uploads (file inputs accepted but stored as object URLs in memory).

## Out of Scope (this build)

- Real backend, real RFID hardware, real email/SMS alerts, real PDF report styling beyond basic tables, true offline mode.

## Delivery Order

1. Shell: theme, sidebar, header, mock auth, login, dashboard
2. Mock data + Tree Registry + Tree Details + Map
3. Regions, Registration, Tags, Inspections, Movements
4. Notifications, Reports, Users, Audit, Settings
5. Polish pass: responsive QA, empty states, toasts, keyboard search
