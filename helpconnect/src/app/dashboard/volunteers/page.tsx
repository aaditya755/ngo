"use client";
import { useEffect, useState } from "react";
import { Users, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { parseJsonSafe } from "@/lib/utils";

interface Vol { id: string; zone: string; totalHours: number; totalPoints: number; skills: string; user: { name: string; email: string }; badges: { badge: { emoji: string; name: string } }[] }

export default function VolunteersPage() {
  const [volunteers, setVols] = useState<Vol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/volunteers").then(r => r.json()).then(d => { setVols(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Volunteer Directory</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{volunteers.length} registered volunteers</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((v, i) => {
            const skills = parseJsonSafe<string[]>(v.skills, []);
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0" style={{ background: "var(--green-dark)" }}>
                    {v.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{v.user.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}><MapPin size={11} /> {v.zone ?? "No zone"}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center"><div className="font-bold" style={{ color: "var(--green-dark)" }}>{v.totalHours}h</div><div className="text-xs" style={{ color: "var(--muted)" }}>Hours</div></div>
                  <div className="text-center"><div className="font-bold" style={{ color: "var(--amber)" }}>{v.totalPoints}</div><div className="text-xs" style={{ color: "var(--muted)" }}>Points</div></div>
                  <div className="text-center"><div className="font-bold" style={{ color: "var(--blue-soft)" }}>{v.badges.length}</div><div className="text-xs" style={{ color: "var(--muted)" }}>Badges</div></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "var(--green-pale)", color: "var(--green-mid)" }}>{s}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
