"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";

interface DashStats {
  needs: number;
  volunteers: number;
  events: number;
  resolved: number;
  critical: number;
  emergencies: { id: string; zone: string; message: string; alertType: string }[];
  recentNeeds: {
    id: string;
    title: string;
    zone: string;
    severity: string;
    category: string;
    status: string;
    createdAt: string;
    ngo: { orgName: string };
  }[];
}

const severityColor: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((response) => response.json()).then(setStats);
  }, []);

  const statCards = [
    { label: "Community Needs", value: stats?.needs ?? "--", icon: ClipboardList, color: "var(--green-dark)", href: "/dashboard/needs" },
    { label: "Active Volunteers", value: stats?.volunteers ?? "--", icon: Users, color: "var(--blue-soft)", href: "/dashboard/volunteers" },
    { label: "Upcoming Events", value: stats?.events ?? "--", icon: Calendar, color: "var(--amber)", href: "/dashboard/events" },
    { label: "Critical Needs", value: stats?.critical ?? "--", icon: AlertTriangle, color: "var(--red-soft)", href: "/dashboard/needs" },
    { label: "Resolved Requests", value: stats?.resolved ?? "--", icon: CheckCircle, color: "var(--green-accent)", href: "/dashboard/needs" },
  ];

  return (
    <div className="space-y-6">
      {stats?.emergencies?.map((emergency) => (
        <div key={emergency.id} className="emergency-banner rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200/50">
          Zone emergency in <span className="font-black">{emergency.zone}</span>: {emergency.message}
        </div>
      ))}

      <section className="hero-card overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--green-dark)] shadow-sm">
              <Sparkles size={15} />
              Good {getGreeting()}, {session?.user?.name?.split(" ")[0] ?? "there"}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[var(--ink)] sm:text-5xl">
              Your response workspace is ready.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
              Track open community needs, surface pressure points by zone, and move volunteers toward the work that matters most today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard/needs/new" className="button-shine rounded-full bg-[linear-gradient(135deg,var(--green-dark),var(--green-accent))] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5">
                Report a Need
              </Link>
              <Link href="/dashboard/map" className="rounded-full border border-[var(--green-light)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--green-dark)] shadow-sm hover:-translate-y-0.5">
                Open Live Map
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[1.75rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--green-dark)]">Operational Focus</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.35rem] bg-[var(--green-dark)] p-4 text-white">
                <p className="text-sm text-white/70">Highest priority queue</p>
                <p className="mt-2 text-3xl font-black">{stats?.critical ?? 0}</p>
                <p className="mt-2 text-sm text-white/78">Critical requests are still waiting for assignment or escalation.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] bg-white/75 p-4">
                  <p className="text-sm text-[var(--muted)]">Volunteer energy</p>
                  <p className="mt-2 text-2xl font-black text-[var(--ink)]">{stats?.volunteers ?? 0}</p>
                </div>
                <div className="rounded-[1.35rem] bg-white/75 p-4">
                  <p className="text-sm text-[var(--muted)]">Events ahead</p>
                  <p className="mt-2 text-2xl font-black text-[var(--ink)]">{stats?.events ?? 0}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link href={card.href} className="glass block rounded-[1.6rem] p-5 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,92,69,0.14)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${card.color}18`, color: card.color }}>
                <card.icon size={20} />
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[var(--ink)]">{card.value}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass overflow-hidden rounded-[1.9rem]">
          <div className="flex items-center justify-between border-b border-[var(--green-light)] px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Recent requests</p>
              <h2 className="mt-1 text-xl font-black text-[var(--ink)]">Community needs</h2>
            </div>
            <Link href="/dashboard/needs" className="text-sm font-semibold text-[var(--green-dark)] hover:translate-x-0.5">
              View all
            </Link>
          </div>

          <div className="divide-y divide-[var(--green-light)]">
            {!stats ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">Loading dashboard data...</div>
            ) : stats.recentNeeds.length === 0 ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">No community needs available yet.</div>
            ) : (
              stats.recentNeeds.map((need) => (
                <div key={need.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/needs/${need.id}`} className="text-base font-bold text-[var(--ink)] hover:text-[var(--green-dark)]">
                      {need.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        {need.zone}
                      </span>
                      <span>•</span>
                      <span>{need.ngo.orgName}</span>
                      <span>•</span>
                      <span>{formatDate(need.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityColor[need.severity] ?? "badge-low"}`}>
                    {need.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[1.9rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Quick actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Report Need", href: "/dashboard/needs/new", icon: ClipboardList },
                { label: "Log Hours", href: "/dashboard/hours", icon: Clock },
                { label: "Open Live Map", href: "/dashboard/map", icon: MapPin },
                { label: "Ask AI Assistant", href: "/dashboard/chat", icon: TrendingUp },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded-[1.35rem] border border-[var(--green-light)] bg-white/80 p-4 hover:-translate-y-0.5 hover:border-[var(--green-dark)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--green-pale)] text-[var(--green-dark)]">
                    <action.icon size={18} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass rounded-[1.9rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Team rhythm</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.35rem] bg-white/80 p-4">
                <p className="text-sm font-semibold text-[var(--ink)]">Open requests trend</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Urgent requests are concentrated in a smaller number of zones, which makes the live map and assignment tools more valuable right now.</p>
              </div>
              <div className="rounded-[1.35rem] bg-white/80 p-4">
                <p className="text-sm font-semibold text-[var(--ink)]">Suggested next move</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Review critical needs first, then broadcast volunteers toward the highest urgency scores before event planning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
