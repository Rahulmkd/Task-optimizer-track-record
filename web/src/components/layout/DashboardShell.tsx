"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { GlowBackground } from "@/components/shared/GlowBackground";
import { DashboardNavbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-violet-500/30 selection:text-white">
        <GlowBackground />
        <DashboardNavbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="flex flex-1 relative z-10 min-w-0">
          <Sidebar
            mobileOpen={mobileNavOpen}
            onMobileClose={() => setMobileNavOpen(false)}
          />
          <main className="flex-1 min-w-0 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
