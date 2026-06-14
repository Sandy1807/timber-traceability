import type { LatLngExpression } from "leaflet";

export type TreeStatus = "Active" | "Under Inspection" | "Harvested" | "Archived";
export type Role = "Super Admin" | "Forest Administrator" | "Forest Officer" | "Inspector" | "Viewer";

export interface Region {
  id: string;
  name: string;
  officer: string;
  area: number; // hectares
  status: "Active" | "Restricted" | "Protected";
  center: [number, number];
  bounds: [number, number][];
}

export interface Tree {
  tagId: string;
  name: string;
  species: string;
  regionId: string;
  lng: number;
  lat: number;
  age: number;
  diameter: number; // cm
  height: number; // m
  status: TreeStatus;
  lastInspection: string;
  registeredAt: string;
  photos: string[];
}

export interface Tag {
  id: string;
  type: "RFID" | "UHF" | "QR";
  assignedTo: string | null;
  assignedDate: string | null;
  status: "Assigned" | "Unassigned" | "Deactivated";
}

export interface Inspection {
  id: string;
  tagId: string;
  inspector: string;
  date: string;
  findings: string;
  condition: 1 | 2 | 3 | 4 | 5;
}

export interface Movement {
  id: string;
  sourceRegionId: string;
  tagId: string;
  vehicle: string;
  driver: string;
  destination: string;
  dispatchedAt: string;
  status: "Pending" | "In Transit" | "Delivered";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  region?: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  at: string;
  ip: string;
}

export interface NotificationItem {
  id: string;
  kind: "Missing Tag" | "Overdue Inspection" | "Unauthorized Movement" | "Compliance";
  message: string;
  at: string;
  read: boolean;
}

const SPECIES = [
  "Teak (Tectona grandis)",
  "Sal (Shorea robusta)",
  "Deodar (Cedrus deodara)",
  "Rosewood (Dalbergia latifolia)",
  "Sandalwood (Santalum album)",
  "Mahogany (Swietenia macrophylla)",
  "Sheesham (Dalbergia sissoo)",
  "Bamboo (Bambusoideae)",
];

const REGION_NAMES = [
  "Western Ghats North", "Western Ghats South", "Nilgiri Reserve", "Sundarbans Delta",
  "Eastern Himalayan Belt", "Aravalli Range", "Vindhyan Plateau", "Satpura Hills",
  "Kanha Tiger Reserve", "Bandhavgarh Forest", "Periyar Sanctuary", "Silent Valley",
  "Namdapha Reserve", "Anamalai Hills", "Dandeli Forest", "Bhitarkanika",
  "Kaziranga Buffer", "Gir Forest",
];
const OFFICERS = [
  "R. Iyer", "S. Banerjee", "M. Khan", "P. Rao", "L. Thomas", "A. Nair",
  "V. Singh", "K. Menon", "D. Sharma", "J. Patel", "T. Mukherjee", "G. Reddy",
];

// Deterministic pseudo-random
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);

function jitter(base: number, range: number) {
  return base + (rng() - 0.5) * range;
}

// 18 regions roughly across India
const REGION_CENTERS: [number, number][] = [
  [15.4, 74.0], [10.8, 76.6], [11.4, 76.7], [21.9, 88.9],
  [27.3, 88.6], [25.0, 73.0], [23.6, 80.0], [22.0, 78.7],
  [22.3, 80.6], [23.7, 81.0], [9.5, 77.2], [11.1, 76.4],
  [27.5, 96.4], [10.4, 77.0], [15.3, 74.6], [20.7, 87.0],
  [26.6, 93.4], [21.1, 70.8],
];

export const regions: Region[] = REGION_NAMES.map((name, i) => {
  const [lat, lng] = REGION_CENTERS[i];
  const d = 0.35;
  return {
    id: `REG-${String(i + 1).padStart(3, "0")}`,
    name,
    officer: OFFICERS[i % OFFICERS.length],
    area: Math.round(800 + rng() * 4200),
    status: i % 7 === 0 ? "Protected" : i % 11 === 0 ? "Restricted" : "Active",
    center: [lat, lng],
    bounds: [
      [lat + d, lng - d], [lat + d, lng + d],
      [lat - d, lng + d], [lat - d, lng - d],
    ],
  };
});

const STATUSES: TreeStatus[] = ["Active", "Active", "Active", "Active", "Under Inspection", "Harvested", "Archived"];

export const trees: Tree[] = Array.from({ length: 260 }, (_, i) => {
  const region = regions[i % regions.length];
  const species = SPECIES[Math.floor(rng() * SPECIES.length)];
  const status = STATUSES[Math.floor(rng() * STATUSES.length)];
  const year = 2024 + Math.floor(rng() * 3);
  return {
    tagId: `TAG-${year}-${String(i + 1).padStart(6, "0")}`,
    name: `${species.split(" ")[0]} #${i + 1}`,
    species,
    regionId: region.id,
    lat: jitter(region.center[0], 0.5),
    lng: jitter(region.center[1], 0.5),
    age: 10 + Math.floor(rng() * 90),
    diameter: 20 + Math.floor(rng() * 120),
    height: 6 + Math.floor(rng() * 30),
    status,
    lastInspection: new Date(Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 200)).toISOString(),
    registeredAt: new Date(Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 800)).toISOString(),
    photos: [],
  };
});

export const tags: Tag[] = trees.slice(0, 240).map((t, i) => ({
  id: t.tagId,
  type: "UHF",
  assignedTo: t.tagId,
  assignedDate: t.registeredAt,
  status: t.status === "Archived" ? "Deactivated" : "Assigned",
}));

const INSPECTORS = ["A. Verma", "B. Pillai", "C. Joshi", "D. Bose", "E. Kapoor", "F. Hegde"];
export const inspections: Inspection[] = Array.from({ length: 80 }, (_, i) => {
  const t = trees[Math.floor(rng() * trees.length)];
  return {
    id: `INS-${String(i + 1).padStart(5, "0")}`,
    tagId: t.tagId,
    inspector: INSPECTORS[i % INSPECTORS.length],
    date: new Date(Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 300)).toISOString(),
    findings: ["Healthy canopy", "Minor pest damage", "Bark scarring observed", "Excellent growth", "Requires follow-up"][i % 5],
    condition: (1 + Math.floor(rng() * 5)) as 1 | 2 | 3 | 4 | 5,
  };
});

const DESTINATIONS = ["Mumbai Sawmill", "Kochi Port", "Delhi Depot", "Chennai Yard", "Kolkata Warehouse", "Bengaluru Mill"];
const DRIVERS = ["Rakesh K.", "Suresh P.", "Imran A.", "Vinod S.", "Tariq M.", "Mahesh R."];
export const movements: Movement[] = Array.from({ length: 40 }, (_, i) => {
  const t = trees[Math.floor(rng() * trees.length)];
  const statuses = ["Pending", "In Transit", "Delivered"] as const;
  return {
    id: `MOV-${String(i + 1).padStart(5, "0")}`,
    sourceRegionId: t.regionId,
    tagId: t.tagId,
    vehicle: `MH-${10 + (i % 80)}-${String(1000 + i).slice(-4)}`,
    driver: DRIVERS[i % DRIVERS.length],
    destination: DESTINATIONS[i % DESTINATIONS.length],
    dispatchedAt: new Date(Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 60)).toISOString(),
    status: statuses[i % 3],
  };
});

export const users: User[] = [
  { id: "U-001", name: "Arjun Mehta", email: "arjun@forest.gov.in", role: "Super Admin", active: true },
  { id: "U-002", name: "Priya Nair", email: "priya@forest.gov.in", role: "Forest Administrator", active: true },
  { id: "U-003", name: "Ravi Kumar", email: "ravi@forest.gov.in", role: "Forest Officer", active: true, region: "Western Ghats North" },
  { id: "U-004", name: "Meera Joshi", email: "meera@forest.gov.in", role: "Inspector", active: true },
  { id: "U-005", name: "Dev Anand", email: "dev@forest.gov.in", role: "Viewer", active: false },
  ...OFFICERS.map((n, i) => ({
    id: `U-${String(100 + i).padStart(3, "0")}`,
    name: n,
    email: `${n.replace(/\W/g, "").toLowerCase()}@forest.gov.in`,
    role: (i % 2 ? "Forest Officer" : "Inspector") as Role,
    active: i % 5 !== 0,
  })),
];

const ACTIONS = ["Logged in", "Registered tree", "Assigned tag", "Added inspection", "Dispatched timber", "Marked harvested", "Updated region", "Generated report"];
const MODULES = ["Auth", "Tree Registry", "Tag Management", "Inspections", "Movements", "Regions", "Reports"];
export const audit: AuditEntry[] = Array.from({ length: 120 }, (_, i) => ({
  id: `AUD-${String(i + 1).padStart(6, "0")}`,
  user: users[i % users.length].name,
  action: ACTIONS[i % ACTIONS.length],
  module: MODULES[i % MODULES.length],
  at: new Date(Date.now() - i * 1000 * 60 * 37).toISOString(),
  ip: `10.${10 + (i % 200)}.${i % 255}.${(i * 7) % 255}`,
}));

export const notifications: NotificationItem[] = [
  { id: "N1", kind: "Missing Tag", message: "Tag TAG-2025-000128 not detected in last sweep", at: new Date(Date.now() - 3600e3).toISOString(), read: false },
  { id: "N2", kind: "Overdue Inspection", message: "12 trees in Nilgiri Reserve overdue for inspection", at: new Date(Date.now() - 7200e3).toISOString(), read: false },
  { id: "N3", kind: "Unauthorized Movement", message: "Vehicle MH-22-4501 left Sundarbans without dispatch order", at: new Date(Date.now() - 86400e3).toISOString(), read: false },
  { id: "N4", kind: "Compliance", message: "Kanha Tiger Reserve audit due in 7 days", at: new Date(Date.now() - 86400e3 * 2).toISOString(), read: true },
  { id: "N5", kind: "Overdue Inspection", message: "5 trees in Aravalli overdue", at: new Date(Date.now() - 86400e3 * 3).toISOString(), read: true },
];

export const kpis = {
  totalTrees: 25480,
  totalRegions: regions.length,
  activeTags: 24980,
  pendingInspections: 125,
};

export function timelineFor(tagId: string) {
  const t = trees.find((x) => x.tagId === tagId);
  if (!t) return [];
  const base = new Date(t.registeredAt).getTime();
  const day = 86400e3;
  const events = [
    { kind: "Tree Registered", at: new Date(base).toISOString(), detail: "Entered into the registry" },
    { kind: "Tag Assigned", at: new Date(base + 1 * day).toISOString(), detail: `${t.tagId} bound` },
    { kind: "Inspection Conducted", at: new Date(base + 90 * day).toISOString(), detail: "Routine health check — healthy" },
    { kind: "Movement Recorded", at: new Date(base + 180 * day).toISOString(), detail: "Geo-perimeter ping" },
  ];
  if (t.status === "Harvested") {
    events.push(
      { kind: "Harvest Approval", at: new Date(base + 400 * day).toISOString(), detail: "Approved by Forest Officer" },
      { kind: "Timber Dispatch", at: new Date(base + 420 * day).toISOString(), detail: "Dispatched to mill" },
    );
  }
  return events;
}

export function getRegion(id: string) {
  return regions.find((r) => r.id === id);
}

export function getTree(tagId: string) {
  return trees.find((t) => t.tagId === tagId);
}

export const mapCenter: LatLngExpression = [21.5, 80.0];