"use client";

import { Bell, Menu, Search, Sparkles } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const notifications = 3;

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            id="sidebar-toggle"
            onClick={onMenuClick}
            className="rounded-2xl border border-[var(--green-light)] bg-white/80 p-2.5 text-[var(--green-dark)] shadow-sm hover:-translate-y-0.5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--green-dark)]">Workspace</p>
            <h1 className="text-lg font-black tracking-tight text-[var(--ink)] sm:text-xl">
              {title ?? "Community Operations"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-[var(--green-light)] bg-white/85 px-4 py-2.5 text-sm text-[var(--muted)] shadow-sm md:flex">
            <Search size={16} />
            <span>Search needs, zones, or people</span>
          </div>

        <div className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[var(--green-dark)] sm:flex" style={{ background: "var(--green-pale)" }}>
            <Sparkles size={14} />
            Live sync active
          </div>

          <button
            id="notifications-btn"
            className="relative rounded-2xl border border-[var(--green-light)] bg-white/85 p-2.5 text-[var(--green-dark)] shadow-sm hover:-translate-y-0.5"
          >
            <Bell size={19} />
            {notifications > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--red-soft)" }}>
                {notifications}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
