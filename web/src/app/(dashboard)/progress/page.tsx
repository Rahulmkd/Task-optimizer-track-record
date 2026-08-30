"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Progress } from "@/features/progress";


export default function ProgressPage() {
  return (
    <DashboardShell>
      {/* Progress panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="mb-8"
      >
        <Progress />
      </motion.div>
    </DashboardShell>
  );
}
