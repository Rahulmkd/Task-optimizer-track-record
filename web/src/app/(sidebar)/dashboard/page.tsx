"use client";

import { DashboardShell } from "@/components/layouts/DashboardShell";
import { DashboardHero } from "@/components/dashboard/home/DashboardHero";
import { ProgressCard } from "@/components/dashboard/home/ProgressCard";
import { UpcomingCard } from "@/components/dashboard/home/UpcomingCard";
import { RecentActivityCard } from "@/components/dashboard/home/RecentActivityCard";
import { TodaysTasksCard } from "@/components/dashboard/home/TodaysTasksCard";
import { CategoryChips } from "@/components/dashboard/home/CategoryChips";

export default function HomePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <DashboardHero />

        {/* Secondary: progress, upcoming, recent activity */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProgressCard />
          <UpcomingCard />
          <RecentActivityCard />
        </div>
        <CategoryChips />
        <TodaysTasksCard />
      </div>
    </DashboardShell>
  );
}
