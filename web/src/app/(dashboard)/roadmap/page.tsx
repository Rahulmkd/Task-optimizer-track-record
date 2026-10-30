"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Roadmapsh } from "@/features/roadmap/components/roadmap";

export default function RoadmapPage() {
  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Roadmapsh />
      </motion.div>
    </DashboardShell>
  );
}
