"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TodaysTasksCard } from "@/features/tasks/components/TodaysTasksCard";
import { NextWeekSchedule } from "@/features/schedule";
import { MyTaskHeader } from "@/features/tasks/components/MyTaskHeader";

export default function myTasks() {
  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
      >
        <div className="space-y-6">
          <MyTaskHeader />
          <TodaysTasksCard />
          <NextWeekSchedule />
        </div>
      </motion.div>
    </DashboardShell>
  );
}
