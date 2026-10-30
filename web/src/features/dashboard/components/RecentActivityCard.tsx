"use client";

/* -------------------------------------------------------------------------- */
/*                             RECENT ACTIVITY CARD                           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { CheckCircle2, History, Check } from "lucide-react";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";

export function RecentActivityCard() {
  const { data: tasksData, isLoading } = useGetTasksQuery();

  const recent = (tasksData ?? [])
    .filter((t) => t.completed)
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-tight">
                Recent Completions
              </h3>
              <p className="text-[11px] text-white/45">Checked off today</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400">
            {recent.length} done
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-7 rounded-lg bg-white/[0.04] animate-pulse" />
            <div className="h-7 rounded-lg bg-white/[0.04] animate-pulse" />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-5 text-center flex flex-col items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 mb-2">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-white/40 text-xs">No tasks completed yet today.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-xs text-white/50 truncate line-through">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-white/40 flex items-center justify-between">
        <span>Continuous sync</span>
        <span>Latest updates</span>
      </div>
    </motion.div>
  );
}
