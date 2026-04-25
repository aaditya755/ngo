"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const typeLabel: Record<string, string> = {
  ASSIGNMENT: "Assignment",
  HOURS_APPROVED: "Hours",
  EMERGENCY: "Emergency",
  DONATION: "Donation",
  BADGE: "Badge",
  EVENT: "Event",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((payload) => {
        setNotifications(Array.isArray(payload) ? payload : []);
        setLoading(false);
      });
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-[var(--ink)]">
            <Bell size={28} className="text-[var(--green-dark)]" />
            Notifications
          </h1>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{unreadCount} unread messages.</p>
        </div>
        {unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            className="rounded-full border border-[var(--green-light)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--green-dark)] hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCheck size={14} />
              Mark all read
            </span>
          </button>
        ) : null}
      </div>

      <div className="glass overflow-hidden rounded-[1.9rem]">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[var(--muted)]">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Bell size={40} className="mx-auto mb-4 text-[var(--muted)]" />
            <p className="font-bold text-[var(--ink)]">All caught up</p>
            <p className="text-sm text-[var(--muted)]">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--green-light)]">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-start gap-4 px-6 py-4 ${notification.read ? "" : "bg-green-50/60"}`}
              >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold uppercase tracking-[0.16em] text-[var(--green-dark)]" style={{ background: "var(--green-pale)" }}>
                  {(typeLabel[notification.type] ?? "Alert").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">{notification.title}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{notification.body}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--green-dark)]">
                    {typeLabel[notification.type] ?? "Alert"} • {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.read ? <div className="mt-2 h-2.5 w-2.5 rounded-full" style={{ background: "var(--green-accent)" }} /> : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
