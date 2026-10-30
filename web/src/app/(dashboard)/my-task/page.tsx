"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TodaysTasksCard } from "@/features/tasks/components/TodaysTasksCard";
import { WeeklySchedule } from "@/features/schedule";
import { MyTaskHeader } from "@/features/tasks/components/MyTaskHeader";

export default function MyTasksPage() {
  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-6 sm:space-y-7"
      >
        <MyTaskHeader />
        <TodaysTasksCard />
        <WeeklySchedule />
      </motion.div>
    </DashboardShell>
  );
}
