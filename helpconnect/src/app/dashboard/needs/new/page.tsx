"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const CATEGORIES = ["HEALTHCARE", "FOOD", "EDUCATION", "SHELTER", "MENTAL_HEALTH", "INFRASTRUCTURE", "WATER", "SECURITY"];
const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function NewNeedPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", zone: "", category: "HEALTHCARE",
    severity: "MEDIUM", urgencyScore: 50, lat: "", lng: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");

    // For demo: use a placeholder ngoId — in production this comes from the user's NGO profile
    const res = await fetch("/api/needs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        lat: form.lat ? parseFloat(form.lat) : undefined,
        lng: form.lng ? parseFloat(form.lng) : undefined,
        urgencyScore: Number(form.urgencyScore),
        ngoId: "demo-ngo", // replaced when NGO profile exists
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Failed to create need"); return; }
    router.push("/dashboard/needs");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/needs" className="p-2 rounded-xl hover:bg-green-50 transition-colors">
          <ArrowLeft size={18} style={{ color: "var(--green-dark)" }} />
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Report Community Need</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && <div className="p-3 rounded-xl text-sm" style={{ background: "#FFEBEE", color: "var(--red-soft)" }}>{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Need Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}
              placeholder="e.g. Medical supplies needed in Dharavi" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Description *</label>
            <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}
              placeholder="Describe the community need in detail…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Zone / Area *</label>
              <input required value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}
                placeholder="e.g. Zone 4 — Mumbai North" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Severity</label>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}>
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Urgency Score: {form.urgencyScore}</label>
              <input type="range" min={1} max={100} value={form.urgencyScore}
                onChange={e => setForm({ ...form, urgencyScore: Number(e.target.value) })}
                className="w-full mt-2 accent-green-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Latitude (optional)</label>
              <input type="number" step="any" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }} placeholder="19.076" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>Longitude (optional)</label>
              <input type="number" step="any" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }} placeholder="72.877" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/needs" className="flex-1 py-3 rounded-xl border text-center text-sm font-medium"
              style={{ borderColor: "var(--green-light)", color: "var(--muted)" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "var(--green-dark)" }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Submitting…" : "Submit Need"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
