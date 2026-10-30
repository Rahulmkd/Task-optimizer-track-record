"use client";

/* -------------------------------------------------------------------------- */
/*                               PROGRESS CARD                                */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";

export function ProgressCard() {
  const { data: tasksData, isLoading } = useGetTasksQuery();

  const tasks = tasksData ?? [];
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg hover:border-white/20 transition-all"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-tight">
                Today&apos;s Progress
              </h3>
              <p className="text-[11px] text-white/45">Real-time completion rate</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-lg">
            {isLoading ? "—" : `${percent}%`}
          </span>
        </div>

        {/* Progress Bar with glow */}
        <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-xs">
        <span className="text-white/50">
          {isLoading
            ? "Calculating…"
            : total === 0
              ? "No tasks recorded today"
              : `${completed} of ${total} tasks done`}
        </span>
        {total > 0 && completed === total && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All Done!
          </span>
        )}
      </div>
    </motion.div>
  );
}
