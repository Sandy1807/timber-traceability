import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { Tree, Region } from "@/lib/mock/data";
import { useEffect } from "react";

const mk = (color: string) => new L.DivIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.35)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});
const greenIcon = mk("#22c55e");
const amberIcon = mk("#f59e0b");
const brownIcon = mk("#a16207");

function iconFor(t: Tree) {
  if (t.status === "Under Inspection") return amberIcon;
  if (t.status === "Harvested" || t.status === "Archived") return brownIcon;
  return greenIcon;
}

function FlyTo({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.6 });
  }, [center, zoom, map]);
  return null;
}

export function MapClient({ trees, regions, height = "70vh", center = [21.5, 80.0], zoom = 5, onMarker }: {
  trees: Tree[]; regions?: Region[]; height?: string; center?: [number, number]; zoom?: number; onMarker?: (t: Tree) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Streets">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer attribution='Tiles &copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer attribution='&copy; OpenTopoMap' url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {regions?.map((r) => (
          <Polygon key={r.id} positions={r.bounds} pathOptions={{ color: "#22c55e", weight: 1.5, fillOpacity: 0.08 }}>
            <Popup><strong>{r.name}</strong><br />Officer: {r.officer}<br />{r.area} ha</Popup>
          </Polygon>
        ))}
        {trees.map((t) => (
          <Marker key={t.tagId} position={[t.lat, t.lng]} icon={iconFor(t)} eventHandlers={{ click: () => onMarker?.(t) }}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 12 }}>Tag: {t.tagId}</div>
                <div style={{ fontSize: 12 }}>{t.species}</div>
                <div style={{ fontSize: 12 }}>{t.lat.toFixed(3)}, {t.lng.toFixed(3)}</div>
                <div style={{ fontSize: 12 }}>Status: {t.status}</div>
                <a style={{ color: "#22c55e", fontSize: 12 }} href={`/trees/${t.tagId}`}>View details →</a>
              </div>
            </Popup>
          </Marker>
        ))}
        <FlyTo center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}