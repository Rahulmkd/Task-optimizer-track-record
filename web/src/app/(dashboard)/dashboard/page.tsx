"use client";

import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { ProgressCard } from "@/features/dashboard/components/ProgressCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { UpcomingCard } from "@/features/dashboard/components/UpcomingCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <DashboardShell>
      {/* Charts panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="space-y-6">
          <DashboardHero />

          {/* Secondary: progress, upcoming, recent activity */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ProgressCard />
            <UpcomingCard />
            <RecentActivityCard />
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
