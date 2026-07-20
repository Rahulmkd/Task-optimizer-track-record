"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { DashboardShell } from "@/components/layouts/DashboardShell";

import { Journal } from "@/components/journalSummary/Journal";

export default function JournalPage() {
  return (
    <DashboardShell>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-violet-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Jurnals & Summary</h1>
        </div>
        <p className="text-white/40 text-sm ml-[44px]">
          AI-generated insights from your daily productivity journals.
        </p>
      </motion.div>

      {/* Journal history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
      >
        <Journal />
      </motion.div>
    </DashboardShell>
  );
}
