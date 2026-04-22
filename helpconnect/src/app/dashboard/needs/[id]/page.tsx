"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, AlertTriangle, Users, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Need {
  id: string; title: string; description: string; zone: string; lat: number | null; lng: number | null;
  category: string; severity: string; urgencyScore: number; status: string; createdAt: string;
  ngo: { orgName: string; description: string };
  _count: { assignments: number };
}

const severityClass: Record<string, string> = {
  CRITICAL: "badge-critical", HIGH: "badge-high", MEDIUM: "badge-medium", LOW: "badge-low",
};

export default function NeedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [need, setNeed] = useState<Need | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/needs/${id}`).then(r => r.json()).then(d => { setNeed(d); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}
    </div>
  );
  if (!need || need.id === undefined) return (
    <div className="max-w-3xl mx-auto glass rounded-2xl p-16 text-center">
      <p className="font-bold text-lg" style={{ color: "var(--ink)" }}>Need not found</p>
      <Link href="/dashboard/needs" className="text-sm mt-2 block" style={{ color: "var(--green-dark)" }}>← Back to needs</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/needs" className="p-2 rounded-xl hover:bg-green-50 transition-colors">
          <ArrowLeft size={18} style={{ color: "var(--green-dark)" }} />
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Need Details</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Header card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{need.title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${severityClass[need.severity] ?? "badge-low"}`}>
              {need.severity}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{need.description}</p>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t" style={{ borderColor: "var(--green-pale)" }}>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
              <MapPin size={14} style={{ color: "var(--green-dark)" }} /> {need.zone}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
              <Users size={14} style={{ color: "var(--green-dark)" }} /> {need._count.assignments} volunteers assigned
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
              <Clock size={14} style={{ color: "var(--green-dark)" }} /> {formatDate(need.createdAt)}
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-3" style={{ color: "var(--ink)" }}>Urgency Score</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 donation-bar">
              <div className="donation-bar-fill" style={{ width: `${need.urgencyScore}%` }} />
            </div>
            <span className="font-bold text-lg mono" style={{ color: "var(--green-dark)" }}>{need.urgencyScore}/100</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Category: {need.category.replace("_", " ")} · Status: {need.status}</p>
        </div>

        {/* NGO Info */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>Posted by NGO</h3>
          <p className="font-semibold text-sm" style={{ color: "var(--green-dark)" }}>{need.ngo.orgName}</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{need.ngo.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "var(--green-dark)" }}>
            Volunteer for This Need
          </button>
          <Link href="/dashboard/map" className="px-6 py-3 rounded-xl border text-sm font-semibold text-center" style={{ borderColor: "var(--green-light)", color: "var(--green-dark)" }}>
            View on Map
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
