"use client";

import { AuthGuard } from "@/components/shared/AuthGuard";
import { DashboardNavbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GlowBackground } from "@/components/shared/GlowBackground";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <GlowBackground />
        <DashboardNavbar />
        <div className="flex flex-1 relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
