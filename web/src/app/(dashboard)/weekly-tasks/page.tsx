"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WeeklyTasksDashboard } from "@/features/schedule";

export default function WeeklyTasksPage() {
  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
      >
        <WeeklyTasksDashboard />
      </motion.div>
    </DashboardShell>
  );
}
