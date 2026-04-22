"use client";
import { useEffect, useState } from "react";
import { DollarSign, Plus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Campaign { id: string; title: string; targetAmount: number; raisedAmount: number; status: string; endDate: string | null; ngo: { orgName: string } }

export default function DonationsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns").then(r => r.json()).then(d => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Donation Campaigns</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Fund community needs through transparent campaigns</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm" style={{ background: "var(--green-dark)" }}>
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <DollarSign size={40} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-lg" style={{ color: "var(--ink)" }}>No active campaigns</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>NGOs can create fundraising campaigns linked to specific needs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c, i) => {
            const pct = Math.min(Math.round((c.raisedAmount / c.targetAmount) * 100), 100);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{c.title}</h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{c.ngo.orgName} {c.endDate && `· Ends ${formatDate(c.endDate)}`}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-low">{c.status}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold" style={{ color: "var(--green-dark)" }}>{formatCurrency(c.raisedAmount)}</span>
                    <span style={{ color: "var(--muted)" }}>of {formatCurrency(c.targetAmount)} goal</span>
                  </div>
                  <div className="donation-bar"><div className="donation-bar-fill" style={{ width: `${pct}%` }} /></div>
                  <p className="text-right text-xs mt-1 font-semibold" style={{ color: "var(--green-accent)" }}>{pct}% funded</p>
                </div>
                <button className="w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ background: "var(--green-dark)" }}>
                  <TrendingUp size={15} /> Donate Now
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
