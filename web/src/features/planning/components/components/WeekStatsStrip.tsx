"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3 } from "lucide-react";

import { IWeeklyPlanStats } from "@/features/planning/types/weekly.types";

interface WeekStatsStripProps {
  stats: IWeeklyPlanStats;
}

export function WeekStatsStrip({ stats }: WeekStatsStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
    >
      {/* Progress */}
      <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
            Week Progress
          </p>
          <span className="text-white font-bold text-sm">
            {stats.progressPercent}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${stats.progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-white/30 text-[11px] mt-2">
          {stats.completed} of {stats.total} tasks done
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="text-xl font-black text-emerald-400">
            {stats.completed}
          </p>
          <p className="text-white/40 text-[10px]">Completed</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center gap-3">
        <Clock3 className="h-5 w-5 text-yellow-400 shrink-0" />
        <div>
          <p className="text-xl font-black text-yellow-400">
            {stats.pending}
          </p>
          <p className="text-white/40 text-[10px]">Pending</p>
        </div>
      </div>
    </motion.div>
  );
}
