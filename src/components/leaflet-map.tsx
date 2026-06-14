import { useEffect, useState } from "react";
import type { Tree, Region } from "@/lib/mock/data";

interface Props {
  trees: Tree[];
  regions?: Region[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  onMarker?: (t: Tree) => void;
}

export function LeafletMap(props: Props) {
  const [Comp, setComp] = useState<React.ComponentType<Props> | null>(null);
  useEffect(() => {
    import("./leaflet-map-client").then((m) => setComp(() => m.MapClient));
  }, []);
  if (!Comp) {
    return <div className="grid w-full place-items-center rounded-xl border bg-muted text-sm text-muted-foreground" style={{ height: props.height ?? "70vh" }}>Loading map…</div>;
  }
  return <Comp {...props} />;
}