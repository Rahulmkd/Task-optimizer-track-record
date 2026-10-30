"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, CircleAlert, Target } from "lucide-react";
import {
  calculateCompletionRate,
  formatProgressFullDate,
  getProgressScoreBackground,
  getProgressScoreColor,
} from "../utils/progress.utils";
import { IJournalSummary } from "@/features/story/types/ai.types";

interface ProgressOverviewProps {
  journals: IJournalSummary[];
}

export function ProgressOverview({ journals }: ProgressOverviewProps) {
  const latest = journals[0];

  const completed = journals.reduce(
    (sum, journal) => sum + journal.completedTasks,
    0,
  );

  const pending = journals.reduce(
    (sum, journal) => sum + journal.pendingTasks,
    0,
  );

  const totalTasks = completed + pending;
  const completionRate = calculateCompletionRate(completed, pending);

  const averageScore = journals.length
    ? Math.round(
        journals.reduce((sum, journal) => sum + journal.productivityScore, 0) /
          journals.length,
      )
    : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Target className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-bold text-white">Aggregated Progress Overview</h3>
          </div>

          <p className="mt-1 text-xs text-white/50">
            Holistic metrics across your entire task and sprint history
          </p>
        </div>

        {/* Latest Date */}
        {latest && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 self-start sm:self-auto text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-white/45">Last log:</span>
            <span className="font-semibold text-white">
              {formatProgressFullDate(latest.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PROGRESS DATA GRID                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        {/* TASK COMPLETION */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 font-medium">Completion Ratio</span>
            <span className="font-bold text-emerald-400">
              {completionRate}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${completionRate}%`,
              }}
              transition={{ duration: 0.7 }}
              className="h-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            />
          </div>

          <p className="text-[11px] text-white/40">
            {completed} of {totalTasks} tasks fulfilled
          </p>
        </div>

        {/* AVERAGE SCORE */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 font-medium">Mean Score</span>
            <span className={`font-bold ${getProgressScoreColor(averageScore)}`}>
              {averageScore}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${averageScore}%`,
              }}
              transition={{ duration: 0.7 }}
              className={`h-full rounded-full ${getProgressScoreBackground(averageScore)}`}
            />
          </div>

          <p className="text-[11px] text-white/40">
            Across {journals.length} journaled sessions
          </p>
        </div>

        {/* TOTAL COMPLETED */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Total Completed</span>
          </div>
          <p className="text-xl font-extrabold text-white">{completed}</p>
          <p className="text-[11px] text-white/40">Successfully checked off</p>
        </div>

        {/* TOTAL REMAINING / PENDING */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
            <CircleAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Carried Forward</span>
          </div>
          <p className="text-xl font-extrabold text-white">{pending}</p>
          <p className="text-[11px] text-white/40">Pending execution</p>
        </div>
      </div>
    </div>
  );
}
