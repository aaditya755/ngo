"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Filter, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const categories = ["ALL", "HEALTHCARE", "FOOD", "EDUCATION", "SHELTER", "MENTAL_HEALTH", "INFRASTRUCTURE", "WATER", "SECURITY"];
const severities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

interface Need {
  id: string;
  title: string;
  description: string;
  zone: string;
  category: string;
  severity: string;
  urgencyScore: number;
  status: string;
  createdAt: string;
  ngo: { orgName: string };
  _count: { assignments: number };
}

const severityClass: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

export default function NeedsPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (category !== "ALL") params.set("category", category);
    if (severity !== "ALL") params.set("severity", severity);

    fetch(`/api/needs?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setNeeds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setNeeds([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [category, severity]);

  const updateCategory = (value: string) => {
    setLoading(true);
    setCategory(value);
  };

  const updateSeverity = (value: string) => {
    setLoading(true);
    setSeverity(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--green-dark)]">Operations queue</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--ink)]">Community Needs</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Browse active requests by category, urgency, and zone.</p>
        </div>

        <Link
          href="/dashboard/needs/new"
          id="create-need-btn"
              className="button-shine inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--green-dark), var(--green-accent))" }}
        >
          <Plus size={16} />
          Report Need
        </Link>
      </div>

      <div className="glass rounded-[1.8rem] p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
          <Filter size={15} />
          Filter the queue
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((option) => {
              const active = category === option;
              return (
                <button
                  key={option}
                  onClick={() => updateCategory(option)}
                  className="rounded-full px-3.5 py-2 text-xs font-semibold"
                  style={{
                    background: active ? "var(--green-dark)" : "rgba(255,255,255,0.9)",
                    color: active ? "white" : "var(--muted)",
                    border: `1px solid ${active ? "var(--green-dark)" : "var(--green-light)"}`,
                  }}
                >
                  {option === "ALL" ? "All categories" : option.replaceAll("_", " ")}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {severities.map((option) => {
              const active = severity === option;
              return (
                <button
                  key={option}
                  onClick={() => updateSeverity(option)}
                  className="rounded-full px-3.5 py-2 text-xs font-semibold"
                  style={{
                    background: active ? "var(--ink)" : "rgba(255,255,255,0.9)",
                    color: active ? "white" : "var(--muted)",
                    border: `1px solid ${active ? "var(--ink)" : "var(--green-light)"}`,
                  }}
                >
                  {option === "ALL" ? "All severities" : option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass h-52 animate-pulse rounded-[1.8rem] bg-white/60" />
          ))}
        </div>
      ) : needs.length === 0 ? (
        <div className="glass rounded-[1.9rem] px-6 py-16 text-center">
          <AlertTriangle size={42} className="mx-auto text-[var(--muted)]" />
          <h2 className="mt-5 text-2xl font-black tracking-tight text-[var(--ink)]">No needs matched these filters</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Try another category, lower the severity filter, or report a new request.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {needs.map((need, index) => (
            <motion.div
              key={need.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                href={`/dashboard/needs/${need.id}`}
                className="glass flex h-full flex-col rounded-[1.8rem] p-5 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,92,69,0.14)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">{need.category.replaceAll("_", " ")}</p>
                    <h2 className="mt-2 text-xl font-black leading-tight text-[var(--ink)]">{need.title}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityClass[need.severity] ?? "badge-low"}`}>
                    {need.severity}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-7 text-[var(--muted)]">{need.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {need.zone}
                  </span>
                  <span>•</span>
                  <span>{need.ngo.orgName}</span>
                </div>

                <div className="mt-5 rounded-[1.3rem] bg-white/80 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    <span>Urgency</span>
                    <span className="mono">{need.urgencyScore}/100</span>
                  </div>
                  <div className="donation-bar">
                    <div className="donation-bar-fill" style={{ width: `${need.urgencyScore}%` }} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--green-light)] pt-4 text-xs text-[var(--muted)]">
                  <span>{need._count.assignments} assigned</span>
                  <span>{formatDate(need.createdAt)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
