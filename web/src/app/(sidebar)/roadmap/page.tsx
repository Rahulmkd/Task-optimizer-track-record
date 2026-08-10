"use client";

import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Roadmapsh } from "@/components/roadmap/roadmap";

export default function Roadmap() {
  return (
    <DashboardShell>
      {/* Page header */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="mb-8"
      >
        <Roadmapsh />
      </motion.div>
    </DashboardShell>
  );
}
