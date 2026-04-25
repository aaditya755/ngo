"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Receipt,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROLE_LABELS, type AppRole } from "@/lib/roles";

type DashboardRole = Exclude<AppRole, "ADMIN">;

interface DashboardStats {
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
    createdAt: string;
    ngo: { orgName: string };
  }[];
}

interface AssignmentRecord {
  id: string;
  status: string;
  createdAt: string;
  need: { title: string; zone: string; severity: string };
  volunteer?: { user?: { name?: string | null } };
}

interface HoursRecord {
  id: string;
  date: string;
  hours: number;
  status: string;
  assignment: { need: { title: string } } | null;
}

interface CampaignRecord {
  id: string;
  title: string;
  raisedAmount: number;
  ngo: { orgName: string };
}

interface DonationRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
  campaign: {
    title: string;
    ngo: { orgName: string };
  };
}

interface EventRecord {
  id: string;
  title: string;
  joined?: boolean;
}

interface LeaderboardRecord {
  totalPoints: number;
  user: { name: string | null };
  badges: { badge: { emoji: string; name: string } }[];
}

interface NewsRecord {
  id: string;
  title: string;
  createdAt: string;
  ngo: { orgName: string };
}

interface StatCard {
  label: string;
  value: string | number;
  icon: typeof ClipboardList;
  href: string;
  color: string;
}

interface ActionLink {
  label: string;
  href: string;
  icon: typeof ClipboardList;
}

interface RoleDashboardConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  focusLabel: string;
  focusValue: string | number;
  focusDescription: string;
  spotlight: Array<{ label: string; value: string | number }>;
  statCards: StatCard[];
  quickActions: ActionLink[];
  insightTitle: string;
  insights: Array<{ title: string; body: string }>;
}

const severityColor: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

function fetchJson<T>(url: string, fallback: T) {
  return fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        return fallback;
      }

      return (await response.json()) as T;
    })
    .catch(() => fallback);
}

export function RoleDashboardHome({ role }: { role: DashboardRole }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [hours, setHours] = useState<HoursRecord[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      const [
        nextStats,
        nextAssignments,
        nextHours,
        nextCampaigns,
        nextEvents,
        nextLeaderboard,
        nextDonations,
        nextNews,
      ] = await Promise.all([
        fetchJson<DashboardStats | null>("/api/dashboard", null),
        role === "DONOR" ? Promise.resolve([] as AssignmentRecord[]) : fetchJson<AssignmentRecord[]>("/api/assignments", []),
        role === "DONOR" ? Promise.resolve([] as HoursRecord[]) : fetchJson<HoursRecord[]>("/api/hours", []),
        fetchJson<CampaignRecord[]>("/api/campaigns", []),
        role === "NGO_COORDINATOR" || role === "VOLUNTEER" ? fetchJson<EventRecord[]>("/api/events", []) : Promise.resolve([] as EventRecord[]),
        role === "VOLUNTEER" ? fetchJson<LeaderboardRecord[]>("/api/volunteers/leaderboard", []) : Promise.resolve([] as LeaderboardRecord[]),
        role === "NGO_COORDINATOR" || role === "DONOR" ? fetchJson<DonationRecord[]>("/api/donations", []) : Promise.resolve([] as DonationRecord[]),
        role === "FIELD_WORKER" ? fetchJson<NewsRecord[]>("/api/news", []) : Promise.resolve([] as NewsRecord[]),
      ]);

      if (!active) {
        return;
      }

      setStats(nextStats);
      setAssignments(nextAssignments);
      setHours(nextHours);
      setCampaigns(nextCampaigns);
      setEvents(nextEvents);
      setLeaderboard(nextLeaderboard);
      setDonations(nextDonations);
      setNews(nextNews);
      setLoading(false);
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [role]);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const pendingAssignments = assignments.filter((assignment) => assignment.status === "PENDING").length;
  const activeAssignments = assignments.filter((assignment) => assignment.status === "ACTIVE").length;
  const pendingHours = hours.filter((log) => log.status === "PENDING").length;
  const approvedHours = hours
    .filter((log) => log.status === "APPROVED")
    .reduce((total, log) => total + log.hours, 0);
  const campaignCount = campaigns.length;
  const totalRaised = campaigns.reduce((total, campaign) => total + campaign.raisedAmount, 0);
  const joinedEvents = events.filter((event) => event.joined).length;
  const totalDonated = donations.reduce((total, donation) => total + donation.amount, 0);
  const completedReceipts = donations.filter((donation) => donation.status === "COMPLETED").length;
  const supportedCampaigns = new Set(donations.map((donation) => donation.campaign.title)).size;
  const topLeaderboard = leaderboard[0];
  const newsCount = news.length;

  const config = getRoleDashboardConfig({
    role,
    firstName,
    stats,
    pendingAssignments,
    activeAssignments,
    pendingHours,
    approvedHours,
    campaignCount,
    totalRaised,
    joinedEvents,
    totalDonated,
    completedReceipts,
    supportedCampaigns,
    topLeaderboard,
    donationCount: donations.length,
    newsCount,
  });

  return (
    <div className="space-y-6">
      {stats?.emergencies?.map((emergency) => (
        <div
          key={emergency.id}
          className="emergency-banner rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200/50"
        >
          Zone emergency in <span className="font-black">{emergency.zone}</span>: {emergency.message}
        </div>
      ))}

      <section className="hero-card overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--green-dark)] shadow-sm">
              <Sparkles size={15} />
              {config.eyebrow}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[var(--ink)] sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
              {config.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={config.primaryAction.href}
                className="button-shine rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, var(--green-dark), var(--green-accent))" }}
              >
                {config.primaryAction.label}
              </Link>
              <Link
                href={config.secondaryAction.href}
                className="rounded-full border border-[var(--green-light)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--green-dark)] shadow-sm hover:-translate-y-0.5"
              >
                {config.secondaryAction.label}
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[1.75rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--green-dark)]">{config.focusLabel}</p>
            <div className="mt-5 space-y-4">
            <div className="rounded-[1.35rem] p-4 text-white" style={{ background: "var(--green-dark)" }}>
                <p className="text-sm text-white/70">{ROLE_LABELS[role]}</p>
                <p className="mt-2 text-3xl font-black">{config.focusValue}</p>
                <p className="mt-2 text-sm text-white/78">{config.focusDescription}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {config.spotlight.map((item) => (
                  <div key={item.label} className="rounded-[1.35rem] bg-white/75 p-4">
                    <p className="text-sm text-[var(--muted)]">{item.label}</p>
                    <p className="mt-2 text-2xl font-black text-[var(--ink)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {config.statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link
              href={card.href}
              className="glass block rounded-[1.6rem] p-5 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,92,69,0.14)]"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: `${card.color}18`, color: card.color }}
              >
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
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">
                {getPrimarySectionEyebrow(role)}
              </p>
              <h2 className="mt-1 text-xl font-black text-[var(--ink)]">{getPrimarySectionTitle(role)}</h2>
            </div>
            <Link href={getPrimarySectionHref(role)} className="text-sm font-semibold text-[var(--green-dark)] hover:translate-x-0.5">
              View all
            </Link>
          </div>

          <div className="divide-y divide-[var(--green-light)]">
            {renderPrimarySection({ role, loading, stats, assignments, donations })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[1.9rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Quick actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {config.quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded-[1.35rem] border border-[var(--green-light)] bg-white/80 p-4 hover:-translate-y-0.5 hover:border-[var(--green-dark)]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-[var(--green-dark)]" style={{ background: "var(--green-pale)" }}>
                    <action.icon size={18} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass rounded-[1.9rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">{config.insightTitle}</p>
            <div className="mt-5 space-y-4">
              {config.insights.map((insight) => (
                <div key={insight.title} className="rounded-[1.35rem] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">{insight.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>

          {renderSecondaryPanel({ role, campaigns, hours, events, leaderboard, news, donations })}
        </div>
      </section>
    </div>
  );
}

function getRoleDashboardConfig({
  role,
  firstName,
  stats,
  pendingAssignments,
  activeAssignments,
  pendingHours,
  approvedHours,
  campaignCount,
  totalRaised,
  joinedEvents,
  totalDonated,
  completedReceipts,
  supportedCampaigns,
  topLeaderboard,
  donationCount,
  newsCount,
}: {
  role: DashboardRole;
  firstName: string;
  stats: DashboardStats | null;
  pendingAssignments: number;
  activeAssignments: number;
  pendingHours: number;
  approvedHours: number;
  campaignCount: number;
  totalRaised: number;
  joinedEvents: number;
  totalDonated: number;
  completedReceipts: number;
  supportedCampaigns: number;
  topLeaderboard?: LeaderboardRecord;
  donationCount: number;
  newsCount: number;
}): RoleDashboardConfig {
  if (role === "NGO_COORDINATOR") {
    return {
      eyebrow: `Good ${getGreeting()}, ${firstName}`,
      title: "Coordinate community needs, volunteers, and donor momentum.",
      description:
        "Prioritize urgent requests, approve volunteer activity, track campaigns, and keep impact flowing across every response zone.",
      primaryAction: { label: "Report a Need", href: "/dashboard/needs/new", icon: ClipboardList },
      secondaryAction: { label: "Open Live Map", href: "/dashboard/map", icon: MapPin },
      focusLabel: "NGO mission control",
      focusValue: stats?.critical ?? 0,
      focusDescription:
        "Critical requests are waiting for assignment, fundraising support, or escalation into emergency operations.",
      spotlight: [
        { label: "Pending approvals", value: pendingAssignments + pendingHours },
        { label: "Campaign funds raised", value: formatCurrency(totalRaised) },
      ],
      statCards: [
        { label: "Community Needs", value: stats?.needs ?? "--", icon: ClipboardList, href: "/dashboard/needs", color: "var(--green-dark)" },
        { label: "Volunteer Approvals", value: pendingAssignments, icon: Users, href: "/dashboard/volunteers", color: "var(--blue-soft)" },
        { label: "Hours Approvals", value: pendingHours, icon: Clock, href: "/dashboard/hours", color: "var(--amber)" },
        { label: "Campaigns", value: campaignCount, icon: DollarSign, href: "/dashboard/donations", color: "var(--green-accent)" },
        { label: "Emergency Alerts", value: stats?.emergencies.length ?? 0, icon: ShieldAlert, href: "/dashboard/admin", color: "var(--red-soft)" },
      ],
      quickActions: [
        { label: "Review Needs", href: "/dashboard/needs", icon: ClipboardList },
        { label: "Approve Hours", href: "/dashboard/hours", icon: Clock },
        { label: "Manage Volunteers", href: "/dashboard/volunteers", icon: Users },
        { label: "Donation Campaigns", href: "/dashboard/donations", icon: DollarSign },
      ],
      insightTitle: "Impact analytics",
      insights: [
        {
          title: "Pressure by urgency",
          body: `There are ${stats?.critical ?? 0} critical requests still open, so coordinator attention should stay on fast assignment and escalation.`,
        },
        {
          title: "Volunteer approval queue",
          body: `${pendingAssignments} assignments and ${pendingHours} hour logs still need review before the volunteer pipeline fully clears.`,
        },
      ],
    };
  }

  if (role === "FIELD_WORKER") {
    return {
      eyebrow: `Field operations ready for ${firstName}`,
      title: "Stay on top of field tasks, live incidents, and zone movement.",
      description:
        "Move through the map with the latest task queue, emergency context, and field updates so ground teams can close loops faster.",
      primaryAction: { label: "Open Live Map", href: "/dashboard/map", icon: MapPin },
      secondaryAction: { label: "View Field Updates", href: "/dashboard/news", icon: AlertTriangle },
      focusLabel: "Field readiness",
      focusValue: activeAssignments + pendingAssignments,
      focusDescription:
        "These tasks are either active in the field or waiting for immediate confirmation, routing, or incident reporting.",
      spotlight: [
        { label: "Critical incidents", value: stats?.critical ?? 0 },
        { label: "Emergency zones", value: stats?.emergencies.length ?? 0 },
      ],
      statCards: [
        { label: "Assigned Field Tasks", value: activeAssignments + pendingAssignments, icon: ClipboardList, href: "/dashboard/assignments", color: "var(--green-dark)" },
        { label: "Live Map Pins", value: stats?.needs ?? "--", icon: MapPin, href: "/dashboard/map", color: "var(--blue-soft)" },
        { label: "Incident Updates", value: newsCount, icon: AlertTriangle, href: "/dashboard/news", color: "var(--red-soft)" },
        { label: "Geo Checkpoints", value: stats?.resolved ?? "--", icon: TrendingUp, href: "/dashboard/map", color: "var(--amber)" },
        { label: "Response Volunteers", value: stats?.volunteers ?? "--", icon: Users, href: "/dashboard/volunteers", color: "var(--green-accent)" },
      ],
      quickActions: [
        { label: "Task Queue", href: "/dashboard/assignments", icon: ClipboardList },
        { label: "Live Map", href: "/dashboard/map", icon: MapPin },
        { label: "Field News", href: "/dashboard/news", icon: AlertTriangle },
        { label: "AI Assistant", href: "/dashboard/chat", icon: MessageSquare },
      ],
      insightTitle: "Ground picture",
      insights: [
        {
          title: "Critical zone spread",
          body: `The live queue shows ${stats?.critical ?? 0} high-pressure needs, so map-first triage remains the fastest path to clarity.`,
        },
        {
          title: "Incident rhythm",
          body: `${activeAssignments} tasks are active and ${pendingAssignments} are waiting for confirmation, which makes completion updates especially valuable today.`,
        },
      ],
    };
  }

  if (role === "DONOR") {
    return {
      eyebrow: `Impact updates for ${firstName}`,
      title: "Track campaigns supported, donation history, and proof of impact.",
      description:
        "See where your support is flowing, review receipts, and follow transparent progress across verified HelpConnect campaigns.",
      primaryAction: { label: "Support Campaigns", href: "/dashboard/donations", icon: DollarSign },
      secondaryAction: { label: "View Impact Reports", href: "/dashboard/news", icon: TrendingUp },
      focusLabel: "Donor impact board",
      focusValue: formatCurrency(totalDonated),
      focusDescription:
        "Total support delivered through your donation history, connected to campaign progress and community response visibility.",
      spotlight: [
        { label: "Receipts ready", value: completedReceipts },
        { label: "Campaigns backed", value: supportedCampaigns },
      ],
      statCards: [
        { label: "Campaigns Supported", value: supportedCampaigns, icon: DollarSign, href: "/dashboard/donations", color: "var(--green-dark)" },
        { label: "Donation History", value: donationCount, icon: Receipt, href: "/dashboard/donations", color: "var(--blue-soft)" },
        { label: "Impact Reports", value: supportedCampaigns, icon: TrendingUp, href: "/dashboard/news", color: "var(--green-accent)" },
        { label: "Receipts", value: completedReceipts, icon: Receipt, href: "/dashboard/donations", color: "var(--amber)" },
        { label: "Open Campaigns", value: campaignCount, icon: ClipboardList, href: "/dashboard/donations", color: "var(--red-soft)" },
      ],
      quickActions: [
        { label: "Browse Campaigns", href: "/dashboard/donations", icon: DollarSign },
        { label: "Donation Receipts", href: "/dashboard/donations", icon: Receipt },
        { label: "Latest Impact News", href: "/dashboard/news", icon: TrendingUp },
        { label: "Ask AI Assistant", href: "/dashboard/chat", icon: MessageSquare },
      ],
      insightTitle: "Impact pulse",
      insights: [
        {
          title: "Verified support trail",
          body: `${completedReceipts} donations have completed receipts, giving you a clean paper trail for financial follow-up and reporting.`,
        },
        {
          title: "Campaign momentum",
          body: `${donationCount} recorded gifts are helping push campaign totals upward across active NGO-led response efforts.`,
        },
      ],
    };
  }

  return {
    eyebrow: `Good ${getGreeting()}, ${firstName}`,
    title: "Manage your assignments, hours, badges, and next best actions.",
    description:
      "Stay focused on the work ahead, log volunteer hours, track event participation, and use AI guidance to keep your impact growing.",
    primaryAction: { label: "View Assignments", href: "/dashboard/assignments", icon: ClipboardList },
    secondaryAction: { label: "Log Hours", href: "/dashboard/hours", icon: Clock },
    focusLabel: "Volunteer momentum",
    focusValue: approvedHours.toFixed(1),
    focusDescription:
      "Approved service hours are translating into visible contribution, better badge progress, and stronger standing on the leaderboard.",
    spotlight: [
      { label: "Joined events", value: joinedEvents },
      { label: "Leaderboard lead", value: topLeaderboard?.user.name ?? "Open race" },
    ],
    statCards: [
      { label: "My Assignments", value: activeAssignments + pendingAssignments, icon: ClipboardList, href: "/dashboard/assignments", color: "var(--green-dark)" },
      { label: "Log Hours", value: pendingHours, icon: Clock, href: "/dashboard/hours", color: "var(--amber)" },
      { label: "Joined Events", value: joinedEvents, icon: Calendar, href: "/dashboard/events", color: "var(--blue-soft)" },
      { label: "Badges and Rank", value: topLeaderboard?.badges.length ?? 0, icon: Trophy, href: "/dashboard/leaderboard", color: "var(--green-accent)" },
      { label: "AI Recommendations", value: stats?.critical ?? "--", icon: Sparkles, href: "/dashboard/chat", color: "var(--red-soft)" },
    ],
    quickActions: [
      { label: "My Tasks", href: "/dashboard/assignments", icon: ClipboardList },
      { label: "Log Volunteer Hours", href: "/dashboard/hours", icon: Clock },
      { label: "Joined Events", href: "/dashboard/events", icon: Calendar },
      { label: "AI Assistant", href: "/dashboard/chat", icon: MessageSquare },
    ],
    insightTitle: "Volunteer guidance",
    insights: [
      {
        title: "Keep the streak alive",
        body: `${pendingHours} hour logs are still waiting on review, so documenting completed work quickly helps your progress stay visible.`,
      },
      {
        title: "Recommendation engine",
        body: `${stats?.critical ?? 0} urgent needs are still active, which makes the AI assistant and assignment board especially useful for choosing your next step.`,
      },
    ],
  };
}

function getPrimarySectionEyebrow(role: DashboardRole) {
  switch (role) {
    case "NGO_COORDINATOR":
      return "Priority queue";
    case "FIELD_WORKER":
      return "Task queue";
    case "DONOR":
      return "Donation history";
    case "VOLUNTEER":
    default:
      return "My work";
  }
}

function getPrimarySectionTitle(role: DashboardRole) {
  switch (role) {
    case "NGO_COORDINATOR":
      return "Community needs";
    case "FIELD_WORKER":
      return "Assigned field tasks";
    case "DONOR":
      return "Recent donations";
    case "VOLUNTEER":
    default:
      return "Assignments";
  }
}

function getPrimarySectionHref(role: DashboardRole) {
  switch (role) {
    case "NGO_COORDINATOR":
      return "/dashboard/needs";
    case "FIELD_WORKER":
    case "VOLUNTEER":
      return "/dashboard/assignments";
    case "DONOR":
      return "/dashboard/donations";
  }
}

function renderPrimarySection({
  role,
  loading,
  stats,
  assignments,
  donations,
}: {
  role: DashboardRole;
  loading: boolean;
  stats: DashboardStats | null;
  assignments: AssignmentRecord[];
  donations: DonationRecord[];
}) {
  if (loading) {
    return <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">Loading dashboard data...</div>;
  }

  if (role === "NGO_COORDINATOR") {
    if (!stats?.recentNeeds.length) {
      return <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">No community needs available yet.</div>;
    }

    return stats.recentNeeds.map((need) => (
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
            <span>|</span>
            <span>{need.ngo.orgName}</span>
            <span>|</span>
            <span>{formatDate(need.createdAt)}</span>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityColor[need.severity] ?? "badge-low"}`}>
          {need.severity}
        </span>
      </div>
    ));
  }

  if (role === "DONOR") {
    if (!donations.length) {
      return <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">Your donation history will appear here once you support a campaign.</div>;
    }

    return donations.slice(0, 5).map((donation) => (
      <div key={donation.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[var(--ink)]">{donation.campaign.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <span>{donation.campaign.ngo.orgName}</span>
            <span>|</span>
            <span>{formatDate(donation.createdAt)}</span>
            <span>|</span>
            <span>{donation.transactionId ?? "Receipt pending"}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-[var(--green-dark)]">{formatCurrency(donation.amount, donation.currency)}</p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${donation.status === "COMPLETED" ? "badge-low" : "badge-medium"}`}>
            {donation.status}
          </span>
        </div>
      </div>
    ));
  }

  if (!assignments.length) {
    return <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">No assignments available yet.</div>;
  }

  return assignments.slice(0, 5).map((assignment) => (
    <div key={assignment.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-[var(--ink)]">{assignment.need.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {assignment.need.zone}
          </span>
          {assignment.volunteer?.user?.name ? (
            <>
              <span>|</span>
              <span>{assignment.volunteer.user.name}</span>
            </>
          ) : null}
          <span>|</span>
          <span>{formatDate(assignment.createdAt)}</span>
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityColor[assignment.need.severity] ?? "badge-low"}`}>
        {assignment.status}
      </span>
    </div>
  ));
}

function renderSecondaryPanel({
  role,
  campaigns,
  hours,
  events,
  leaderboard,
  news,
  donations,
}: {
  role: DashboardRole;
  campaigns: CampaignRecord[];
  hours: HoursRecord[];
  events: EventRecord[];
  leaderboard: LeaderboardRecord[];
  news: NewsRecord[];
  donations: DonationRecord[];
}) {
  if (role === "NGO_COORDINATOR") {
    return (
      <div className="glass rounded-[1.9rem] p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Campaign snapshot</p>
          <Link href="/dashboard/donations" className="text-sm font-semibold text-[var(--green-dark)]">
            Open campaigns
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {campaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className="rounded-[1.35rem] bg-white/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{campaign.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{campaign.ngo.orgName}</p>
                </div>
                <p className="text-sm font-black text-[var(--green-dark)]">{formatCurrency(campaign.raisedAmount)}</p>
              </div>
            </div>
          ))}
          {!campaigns.length ? (
            <div className="rounded-[1.35rem] bg-white/80 p-4 text-sm text-[var(--muted)]">No campaigns are live yet.</div>
          ) : null}
        </div>
      </div>
    );
  }

  if (role === "FIELD_WORKER") {
    return (
      <div className="glass rounded-[1.9rem] p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Incident updates</p>
          <Link href="/dashboard/news" className="text-sm font-semibold text-[var(--green-dark)]">
            Open feed
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {news.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-[1.35rem] bg-white/80 p-4">
              <p className="font-semibold text-[var(--ink)]">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.ngo.orgName} | {formatDate(item.createdAt)}
              </p>
            </div>
          ))}
          {!news.length ? (
            <div className="rounded-[1.35rem] bg-white/80 p-4 text-sm text-[var(--muted)]">No field updates have been published yet.</div>
          ) : null}
        </div>
      </div>
    );
  }

  if (role === "DONOR") {
    return (
      <div className="glass rounded-[1.9rem] p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Receipts and reports</p>
          <Link href="/dashboard/donations" className="text-sm font-semibold text-[var(--green-dark)]">
            View all
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {donations.slice(0, 3).map((donation) => (
            <div key={donation.id} className="rounded-[1.35rem] bg-white/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{donation.campaign.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{donation.transactionId ?? "Receipt will appear after confirmation"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${donation.status === "COMPLETED" ? "badge-low" : "badge-medium"}`}>
                  {donation.status}
                </span>
              </div>
            </div>
          ))}
          {!donations.length ? (
            <div className="rounded-[1.35rem] bg-white/80 p-4 text-sm text-[var(--muted)]">Receipts will appear here after your first completed donation.</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-[1.9rem] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">Recognition and events</p>
        <Link href="/dashboard/leaderboard" className="text-sm font-semibold text-[var(--green-dark)]">
          Leaderboard
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        <div className="rounded-[1.35rem] bg-white/80 p-4">
          <p className="text-sm font-semibold text-[var(--ink)]">Leaderboard leader</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {leaderboard[0]?.user.name ?? "No volunteers ranked yet"} {leaderboard[0] ? `leads with ${leaderboard[0].totalPoints} points.` : ""}
          </p>
        </div>
        <div className="rounded-[1.35rem] bg-white/80 p-4">
          <p className="text-sm font-semibold text-[var(--ink)]">Upcoming events</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {events.length ? `${events.slice(0, 2).map((event) => event.title).join(" and ")} are open for participation.` : "No upcoming events are open right now."}
          </p>
        </div>
        <div className="rounded-[1.35rem] bg-white/80 p-4">
          <p className="text-sm font-semibold text-[var(--ink)]">Hours progress</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {hours.length ? `${hours.length} hour logs are on your record, with approvals feeding badge and leaderboard progress.` : "Start logging hours to build visible momentum."}
          </p>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
