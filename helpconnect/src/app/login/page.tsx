"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

const trustSignals = [
  "Live role-based dashboard access",
  "Seeded demo accounts included",
  "Built for NGO, volunteer, and donor workflows",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="auth-shell flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden rounded-[2rem] border border-white/12 bg-white/8 p-8 text-white shadow-2xl shadow-emerald-950/10 backdrop-blur lg:block"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
              <Heart size={22} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">HelpConnect</p>
              <p className="text-sm text-white/70">Operational clarity for community teams</p>
            </div>
          </div>

          <h1 className="mt-10 text-4xl font-black leading-tight">
            Sign in to the coordination workspace that keeps urgent work moving.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
            Monitor live needs, match volunteers, track donations, and respond faster with a calmer dashboard built for real NGO operations.
          </p>

          <div className="mt-8 space-y-4">
            {trustSignals.map((signal) => (
              <div key={signal} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <ShieldCheck size={18} className="text-emerald-200" />
                <span className="text-sm text-white/82">{signal}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-white/60">Demo Access</p>
            <p className="mt-3 text-base font-semibold">Volunteer</p>
            <p className="text-sm text-white/72">`vol1@helpconnect.dev` / `vol12345`</p>
            <p className="mt-4 text-base font-semibold">Coordinator</p>
            <p className="text-sm text-white/72">`ngo@helpconnect.dev` / `ngo12345`</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-panel mx-auto w-full max-w-xl rounded-[2rem] p-6 sm:p-8"
        >
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--green-pale)] text-[var(--green-dark)] lg:mx-0">
              <Heart size={24} />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-[var(--ink)]">Welcome back</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Sign in to continue managing community response, volunteer hours, and field activity.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--ink)]">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--green-dark)] focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--ink)]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--green-dark)] focus:bg-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="button-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--green-dark),var(--green-accent))] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-65"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-[var(--green-pale)] px-4 py-3 text-sm text-[var(--muted)]">
            Quick demo: use <span className="font-semibold text-[var(--ink)]">vol1@helpconnect.dev</span> and <span className="font-semibold text-[var(--ink)]">vol12345</span>.
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--green-light)] pt-5 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Don&apos;t have an account yet?
            </p>
            <Link href="/register" className="font-semibold text-[var(--green-dark)] hover:translate-x-0.5">
              Create one <ArrowRight size={14} className="ml-1 inline-block" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
