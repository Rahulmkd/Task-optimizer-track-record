"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { DashboardNavbar } from "@/components/layouts/Navbar";
import { Sidebar } from "@/components/layouts/Sidebar";
import { GlowBackground } from "@/components/shared/GlowBackground";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <GlowBackground />
        <DashboardNavbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="flex flex-1 relative z-10 min-w-0">
          <Sidebar
            mobileOpen={mobileNavOpen}
            onMobileClose={() => setMobileNavOpen(false)}
          />
          <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
