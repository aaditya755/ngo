"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MenuSquare,
  MessageSquare,
  Newspaper,
  ShieldAlert,
  Trophy,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", roles: ["ALL"] },
  { href: "/dashboard/needs", icon: ClipboardList, label: "Community Needs", roles: ["ALL"] },
  { href: "/dashboard/map", icon: MapPin, label: "Live Map", roles: ["ALL"] },
  { href: "/dashboard/hours", icon: MenuSquare, label: "Hours Tracking", roles: ["ALL"] },
  { href: "/dashboard/events", icon: Calendar, label: "Events", roles: ["ALL"] },
  { href: "/dashboard/donations", icon: DollarSign, label: "Donations", roles: ["ALL"] },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard", roles: ["ALL"] },
  {
    href: "/dashboard/volunteers",
    icon: Users,
    label: "Volunteers",
    roles: ["ADMIN", "NGO_COORDINATOR", "FIELD_WORKER"],
  },
  { href: "/dashboard/certificates", icon: FileText, label: "Certificates", roles: ["ALL"] },
  { href: "/dashboard/news", icon: Newspaper, label: "Field Updates", roles: ["ALL"] },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Assistant", roles: ["ALL"] },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications", roles: ["ALL"] },
  { href: "/dashboard/admin", icon: ShieldAlert, label: "Admin Panel", roles: ["ADMIN"] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "VOLUNTEER";

  const visible = navItems.filter(
    (item) => item.roles.includes("ALL") || item.roles.includes(role),
  );

  return (
    <>
      {open ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-white shadow-lg shadow-emerald-950/10">
              <Heart size={18} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-white">HelpConnect</p>
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Mission Control</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4 text-white backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-white/55">Signed in as</p>
            <p className="mt-2 truncate text-base font-semibold">{session?.user?.name ?? "User"}</p>
            <p className="mt-1 text-sm text-white/62">{role.replaceAll("_", " ")}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {visible.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                  isActive
                    ? "bg-white/18 text-white shadow-lg shadow-black/10"
                    : "text-white/65 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-white/65 group-hover:text-white"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-5">
          <button
            id="signout-btn"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur hover:bg-white/12 hover:text-white"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
