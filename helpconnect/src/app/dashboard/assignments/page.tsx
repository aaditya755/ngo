"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Assignment {
  id: string;
  status: string;
  createdAt: string;
  need: { title: string; zone: string; severity: string };
  volunteer: { user: { name: string } };
}

const statusColors: Record<string, string> = {
  PENDING: "badge-medium",
  ACTIVE: "badge-low",
  COMPLETED: "badge-low",
  CANCELLED: "badge-critical",
};

export default function AssignmentsPage() {
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assignments")
      .then((response) => response.json())
      .then((payload) => {
        setData(Array.isArray(payload) ? payload : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--ink)]">Assignments</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Volunteer-to-need assignments across all zones.</p>
      </div>

      <div className="glass overflow-hidden rounded-[1.9rem]">
        <div className="border-b border-[var(--green-light)] px-6 py-4">
          <h2 className="font-bold text-[var(--ink)]">All assignments</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[var(--muted)]">Loading assignments...</div>
        ) : data.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Users size={36} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="font-bold text-[var(--ink)]">No assignments yet</p>
            <p className="text-sm text-[var(--muted)]">Assignments appear here when volunteers are matched to community needs.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--green-light)]">
            {data.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">{assignment.need.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {assignment.need.zone} • Volunteer: {assignment.volunteer.user.name} • {formatDate(assignment.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[assignment.status] ?? "badge-low"}`}>
                  {assignment.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
