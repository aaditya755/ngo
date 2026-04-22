"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getSeverityMapColor } from "@/lib/utils";

interface Need {
  id: string;
  title: string;
  zone: string;
  severity: string;
  category: string;
  lat: number | null;
  lng: number | null;
  urgencyScore: number;
  status: string;
}

export default function MapView({ needs }: { needs: Need[] }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {needs.filter((need) => need.lat && need.lng).map((need) => (
        <CircleMarker
          key={need.id}
          center={[need.lat!, need.lng!]}
          radius={Math.max(8, need.urgencyScore / 8)}
          pathOptions={{
            fillColor: getSeverityMapColor(need.severity),
            color: getSeverityMapColor(need.severity),
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="mb-1 font-bold">{need.title}</p>
              <p className="text-xs text-slate-600">{need.zone}</p>
              <p className="mt-1 text-xs text-slate-600">
                <span style={{ color: getSeverityMapColor(need.severity) }}>● {need.severity}</span>
                {` • ${need.category} • Score: ${need.urgencyScore}`}
              </p>
              <a href={`/dashboard/needs/${need.id}`} className="mt-2 block text-xs underline" style={{ color: "#0f5c45" }}>
                View details
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
