"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Filter } from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-96 rounded-2xl" style={{ background: "var(--green-pale)" }}>
    <p className="text-sm" style={{ color: "var(--muted)" }}>Loading map…</p>
  </div>
)});

const SEVERITIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const CATEGORIES = ["ALL", "HEALTHCARE", "FOOD", "EDUCATION", "SHELTER", "INFRASTRUCTURE", "WATER", "SECURITY"];

interface Need { id: string; title: string; zone: string; severity: string; category: string; lat: number | null; lng: number | null; urgencyScore: number; status: string }

export default function MapPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [severity, setSeverity] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    const p = new URLSearchParams();
    if (severity !== "ALL") p.set("severity", severity);
    if (category !== "ALL") p.set("category", category);
    fetch(`/api/needs?${p}`).then(r => r.json()).then(setNeeds);
  }, [severity, category]);

  const pinNeeds = needs.filter(n => n.lat && n.lng);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Live GIS Map</h1>
        <span className="text-sm" style={{ color: "var(--muted)" }}>{pinNeeds.length} pinned needs</span>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <Filter size={14} style={{ color: "var(--muted)" }} />
        {SEVERITIES.map(s => (
          <button key={s} onClick={() => setSeverity(s)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{ background: severity === s ? "var(--ink)" : "white", color: severity === s ? "white" : "var(--muted)", borderColor: "var(--green-light)" }}>
            {s === "ALL" ? "All Severities" : s}
          </button>
        ))}
        <span className="text-gray-300">|</span>
        {CATEGORIES.slice(0, 5).map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{ background: category === c ? "var(--green-dark)" : "white", color: category === c ? "white" : "var(--muted)", borderColor: "var(--green-light)" }}>
            {c === "ALL" ? "All" : c.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden border" style={{ height: "70vh", borderColor: "var(--green-light)" }}>
        <MapView needs={pinNeeds} />
      </div>
    </div>
  );
}
