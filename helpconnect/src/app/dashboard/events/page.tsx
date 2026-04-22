"use client";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface Event { id: string; title: string; date: string; location: string | null; capacity: number; _count: { signups: number }; ngo: { orgName: string } }

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Events & Shifts</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Sign up for volunteer events and camps</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm" style={{ background: "var(--green-dark)" }}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Calendar size={40} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-lg" style={{ color: "var(--ink)" }}>No upcoming events</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>NGOs will post events here. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, i) => {
            const pct = Math.round((event._count.signups / event.capacity) * 100);
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-5 space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="px-3 py-2 rounded-xl text-center flex-shrink-0" style={{ background: "var(--green-dark)", minWidth: 52 }}>
                    <div className="text-white text-xs font-semibold">{new Date(event.date).toLocaleDateString("en", { month: "short" })}</div>
                    <div className="text-white text-2xl font-bold leading-none">{new Date(event.date).getDate()}</div>
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{event.title}</h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{event.ngo.orgName}</p>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                    <MapPin size={12} /> {event.location}
                  </div>
                )}
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1"><Users size={11} /> {event._count.signups}/{event.capacity} signed up</span>
                    <span>{pct >= 100 ? "🔴 Full" : pct >= 75 ? "🟡 Almost full" : "🟢 Open"}</span>
                  </div>
                  <div className="donation-bar"><div className="donation-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                </div>
                <button disabled={pct >= 100}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: "var(--green-pale)", color: "var(--green-dark)" }}>
                  {pct >= 100 ? "Event Full" : "Sign Up"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
