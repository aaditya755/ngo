"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2, Lock, Mail, User, Users } from "lucide-react";

const roles = [
  { value: "VOLUNTEER", label: "Volunteer", desc: "Join community needs directly." },
  { value: "NGO_COORDINATOR", label: "NGO Coordinator", desc: "Manage operations and campaign flow." },
  { value: "FIELD_WORKER", label: "Field Worker", desc: "Capture and update ground reality." },
  { value: "DONOR", label: "Donor", desc: "Support verified community requests." },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VOLUNTEER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.ok) {
      router.push("/dashboard");
      return;
    }

    router.push("/login");
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
              <p className="text-sm text-white/70">Start a cleaner workflow for your mission</p>
            </div>
          </div>

          <h1 className="mt-10 text-4xl font-black leading-tight">
            Create your account and start coordinating with clarity.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
            Register as a volunteer, NGO coordinator, field worker, or donor and continue building the response network from one shared platform.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">Inside the platform</p>
              <p className="mt-3 text-lg font-semibold">Community needs, events, hours, donations, chat, and emergency tools.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">Designed for growth</p>
              <p className="mt-3 text-lg font-semibold">A polished base you can extend instead of a rough prototype you need to rebuild.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-panel mx-auto w-full max-w-xl rounded-[2rem] p-6 sm:p-8"
        >
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--green-pale)] text-[var(--green-dark)] lg:mx-0">
              <Users size={24} />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-[var(--ink)]">Create your account</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Set up your role and continue into the HelpConnect dashboard experience.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--ink)]">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--green-dark)] focus:bg-white"
                  placeholder="Aditya Kumar"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--ink)]">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--green-dark)] focus:bg-white"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-[var(--ink)]">Choose your role</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const active = form.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className="rounded-2xl border p-4 text-left"
                      style={{
                        borderColor: active ? "var(--green-dark)" : "var(--green-light)",
                        background: active ? "rgba(183, 239, 211, 0.65)" : "rgba(255,255,255,0.86)",
                        boxShadow: active ? "0 16px 30px rgba(15, 92, 69, 0.12)" : "none",
                      }}
                    >
                      <p className="font-semibold text-[var(--ink)]">{role.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{role.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--green-dark),var(--green-accent))] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-65"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--green-light)] pt-5 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>Already have an account?</p>
            <Link href="/login" className="font-semibold text-[var(--green-dark)] hover:translate-x-0.5">
              Sign in <ArrowRight size={14} className="ml-1 inline-block" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
