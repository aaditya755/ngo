"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Heart,
  MapPin,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Response Map",
    desc: "Surface urgent needs, zone activity, and field status on a single operational canvas.",
  },
  {
    icon: Zap,
    title: "Smart Volunteer Matching",
    desc: "Coordinate people by skill, urgency, and location instead of juggling spreadsheets.",
  },
  {
    icon: DollarSign,
    title: "Need-Linked Donations",
    desc: "Keep fundraising transparent by connecting every campaign to a real community request.",
  },
  {
    icon: Trophy,
    title: "Recognition and Retention",
    desc: "Celebrate volunteer effort with points, badges, milestones, and visible momentum.",
  },
  {
    icon: ShieldAlert,
    title: "Emergency Broadcasts",
    desc: "Escalate critical zone alerts and reach the right nearby responders in seconds.",
  },
  {
    icon: Calendar,
    title: "Events and Shifts",
    desc: "Plan drives, camps, check-ins, and team rotations without losing operational context.",
  },
];

const signals = [
  { value: "12+", label: "Integrated modules" },
  { value: "19", label: "Core data models" },
  { value: "5", label: "Supported user roles" },
  { value: "24/7", label: "Coordination ready" },
];

const personas = [
  {
    title: "NGO Coordinators",
    copy: "See open needs, donation progress, zone stress, and volunteer availability from one control room.",
  },
  {
    title: "Field Workers",
    copy: "Capture what is happening on the ground and turn scattered updates into visible action.",
  },
  {
    title: "Volunteers and Donors",
    copy: "Join with clarity, understand impact, and stay engaged through meaningful progress loops.",
  },
];

const previewRows = [
  "Flood relief medical kits reassigned to the nearest trained responders",
  "Community kitchen donations linked directly to high-priority food requests",
  "Weekend tutoring drive scheduled with volunteer capacity and zone coverage",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="page-shell min-h-screen overflow-x-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-emerald-900/15" style={{ background: "var(--green-dark)" }}>
            <Heart size={18} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[var(--ink)]">HelpConnect</p>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">Community Ops</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-[var(--border-soft)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-sm backdrop-blur hover:-translate-y-0.5"
          >
            Sign In
          </Link>
          <Link
            href="/register"
                className="button-shine rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, var(--green-dark), var(--green-accent))" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-5 pb-20 pt-6 sm:px-8 lg:px-10 lg:pt-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div
              variants={item}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--green-dark)] shadow-sm backdrop-blur"
            >
              <Sparkles size={16} />
              HelpConnect v3.0 with live NGO operations workflows
            </motion.div>

            <motion.h1
              variants={item}
              className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-[var(--ink)] sm:text-6xl xl:text-7xl"
            >
              Turn community needs into <span className="text-gradient">coordinated action</span>.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl"
            >
              HelpConnect brings NGOs, volunteers, field teams, and donors into one shared response system with live needs,
              clear ownership, and calmer execution during both daily service work and emergencies.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                id="hero-register-btn"
              className="button-shine inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-900/20 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, var(--green-dark), var(--green-accent))" }}
              >
                Launch Your Workspace <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--green-light)] bg-white/80 px-7 py-4 text-base font-semibold text-[var(--green-dark)] shadow-sm backdrop-blur hover:-translate-y-1"
              >
                Explore the Dashboard
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {signals.map((signal) => (
                <div key={signal.label} className="glass rounded-3xl p-4">
                  <p className="text-3xl font-black tracking-tight text-[var(--green-dark)]">{signal.value}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{signal.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hero-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
          >
            <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-between rounded-3xl border border-white/70 bg-white/75 p-4 backdrop-blur">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">Mission Control</p>
                  <p className="mt-1 text-xl font-bold text-[var(--ink)]">Operational Snapshot</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[var(--green-dark)]">
                  Live Sync
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl p-5 text-white shadow-lg shadow-emerald-900/20" style={{ background: "var(--green-dark)" }}>
                  <p className="text-sm text-white/70">Critical needs</p>
                  <p className="mt-2 text-4xl font-black">08</p>
                  <p className="mt-3 text-sm text-white/80">Two zones need medical and shelter responders within the hour.</p>
                </div>
                <div className="glass rounded-3xl p-5">
                  <p className="text-sm text-[var(--muted)]">Volunteer availability</p>
                  <p className="mt-2 text-4xl font-black text-[var(--ink)]">126</p>
                  <p className="mt-3 text-sm text-[var(--muted)]">Nearby volunteers filtered by skill, travel distance, and burnout flags.</p>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--ink)]">Today&apos;s coordinated actions</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[var(--green-dark)]">NEXUS-ALLOC</span>
                </div>
                <div className="mt-4 space-y-3">
                  {previewRows.map((row, index) => (
                    <div key={row} className="flex items-start gap-3 rounded-2xl bg-white/80 px-3 py-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-[var(--green-dark)]" style={{ background: "var(--green-pale)" }}>
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-[var(--muted)]">{row}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="glass rounded-[1.75rem] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--green-dark)]">Built for</p>
              <h2 className="mt-3 text-2xl font-bold text-[var(--ink)]">{persona.title}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">{persona.copy}</p>
            </motion.div>
          ))}
        </section>

        <section>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--green-dark)]">Platform Modules</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
                Everything needed to run fast, humane field operations.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              The app already includes the core workflows people expect from a modern volunteer operations system, now presented with a cleaner visual rhythm and stronger motion language.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="glass group rounded-[1.75rem] p-6 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,92,69,0.16)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--green-dark)]" style={{ background: "var(--green-pale)" }}>
                  <feature.icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--ink)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="hero-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--green-dark)]">Why it works</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
                Less admin drag. More visible impact.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
                HelpConnect is designed to feel like an operations product, not just a form dashboard. The refreshed experience gives every major screen clearer structure, calmer spacing, and motion that supports the work instead of distracting from it.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] p-5 text-white" style={{ background: "var(--green-dark)" }}>
                <Users size={22} />
                <p className="mt-4 text-xl font-bold">Multi-role ready</p>
                <p className="mt-2 text-sm leading-7 text-white/75">Admin, coordinator, field worker, volunteer, and donor journeys share one cohesive system.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/80 p-5 backdrop-blur">
                <Zap size={22} className="text-[var(--green-dark)]" />
                <p className="mt-4 text-xl font-bold text-[var(--ink)]">Responsive motion</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Animated entrances, polished cards, and stronger visual grouping across the app.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] px-6 py-10 text-white shadow-2xl shadow-emerald-950/20 sm:px-8" style={{ background: "linear-gradient(135deg, #0d3f34, #178c61)" }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">Ready to deploy</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Bring your NGO team, volunteers, and response workflows together.</h2>
              <p className="mt-4 text-base leading-8 text-white/75">
                Sign in with the seeded demo users or create a new account and continue building on a cleaner, more production-ready base.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="button-shine inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[var(--green-dark)] hover:-translate-y-1"
              >
                Create Account <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur hover:-translate-y-1"
              >
                Open Demo Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/60 px-5 py-8 text-sm text-[var(--muted)] sm:px-8 lg:px-10">
        <p>HelpConnect is designed for NGOs that need operational clarity, not more chaos.</p>
        <p>Built for community response, volunteer coordination, and mission visibility.</p>
      </footer>
    </div>
  );
}
