"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell flex min-h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="dashboard-main flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
          <div className="relative mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
