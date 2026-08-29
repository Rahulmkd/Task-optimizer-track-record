"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { HabitTracker } from "@/components/habitTracker/HabitTracker";

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
        <HabitTracker />
      </motion.div>
    </DashboardShell>
  );
}
