"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Users } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyZone, setEmergencyZone] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const declareEmergency = async () => {
    if (!emergencyZone || !emergencyMessage) return;

    await fetch("/api/emergencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zone: emergencyZone, message: emergencyMessage }),
    });

    setEmergencyZone("");
    setEmergencyMessage("");
    window.alert("Emergency declared.");
  };

  const updateRole = async (userId: string, role: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, role } : user)));
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg font-bold text-[var(--red-soft)]">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-[var(--ink)]">
          <ShieldAlert size={28} className="text-[var(--red-soft)]" />
          Admin Panel
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Manage users and issue urgent zone alerts.</p>
      </div>

      <div className="glass rounded-[1.9rem] border-2 border-red-200 p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-[var(--red-soft)]">
          <AlertTriangle size={20} />
          Declare Zone Emergency
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            value={emergencyZone}
            onChange={(e) => setEmergencyZone(e.target.value)}
            placeholder="Zone name"
            className="rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] px-4 py-3 text-sm outline-none focus:border-[var(--green-dark)]"
          />
          <input
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            placeholder="Emergency message"
            className="rounded-2xl border border-[var(--green-light)] bg-[var(--green-pale)] px-4 py-3 text-sm outline-none focus:border-[var(--green-dark)]"
          />
        </div>
        <button
          onClick={declareEmergency}
          className="mt-4 rounded-full bg-[var(--red-soft)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/40 hover:-translate-y-0.5"
        >
          Declare Emergency
        </button>
      </div>

      <div className="glass overflow-hidden rounded-[1.9rem]">
        <div className="flex items-center gap-3 border-b border-[var(--green-light)] px-6 py-5">
          <Users size={19} className="text-[var(--green-dark)]" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--green-dark)]">User management</p>
            <h2 className="text-xl font-black text-[var(--ink)]">Access control</h2>
          </div>
          <span className="ml-auto text-sm text-[var(--muted)]">{users.length} users</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">Loading users...</div>
        ) : (
          <div className="divide-y divide-[var(--green-light)]">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--green-dark)] text-sm font-bold text-white">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--ink)]">{user.name}</p>
                  <p className="truncate text-sm text-[var(--muted)]">{user.email}</p>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="rounded-xl border border-[var(--green-light)] bg-[var(--green-pale)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
                >
                  {["ADMIN", "NGO_COORDINATOR", "FIELD_WORKER", "VOLUNTEER", "DONOR"].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
