"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface HoursLog {
  id: string;
  date: string;
  hours: number;
  status: string;
  notes: string | null;
  assignment: { need: { title: string } } | null;
}

export default function HoursPage() {
  const [logs, setLogs] = useState<HoursLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hours")
      .then((response) => response.json())
      .then((payload) => {
        setLogs(Array.isArray(payload) ? payload : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-[var(--ink)]">
            <Clock size={28} className="text-[var(--green-dark)]" />
            Hours Tracking
          </h1>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Log and review your volunteer hours.</p>
        </div>
        <button className="rounded-full bg-[var(--green-dark)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 hover:-translate-y-0.5">
          <span className="inline-flex items-center gap-2">
            <Plus size={16} />
            Log Hours
          </span>
        </button>
      </div>

      <div className="glass overflow-hidden rounded-[1.9rem]">
        <div className="border-b border-[var(--green-light)] px-6 py-4">
          <h2 className="font-bold text-[var(--ink)]">My hours log</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[var(--muted)]">Loading hours...</div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Clock size={36} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="font-bold text-[var(--ink)]">No hours logged yet</p>
            <p className="text-sm text-[var(--muted)]">Start logging your volunteer hours to earn points and badges.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--green-light)]">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--green-pale)] text-[var(--green-dark)]">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">{log.assignment?.need?.title ?? "General volunteering"}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{formatDate(log.date)} • {log.notes ?? "No notes"}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[var(--green-dark)]">{log.hours}h</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${log.status === "APPROVED" ? "badge-low" : log.status === "REJECTED" ? "badge-critical" : "badge-medium"}`}>
                    {log.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
