"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, CircleAlert, Target } from "lucide-react";

import { IJournalSummary } from "@/features/ai/types/ai.types";

import {
  calculateCompletionRate,
  formatProgressFullDate,
  getProgressScoreBackground,
  getProgressScoreColor,
} from "../progress.utils";

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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-400" />

            <h3 className="text-sm font-bold text-white">Progress overview</h3>
          </div>

          <p className="mt-1 text-[11px] text-white/35">
            A quick look at your overall productivity
          </p>
        </div>

        {/* Latest Date */}
        {latest && (
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">
            <CalendarDays className="h-3.5 w-3.5 text-white/30" />

            <span className="text-[10px] text-white/40">Latest</span>

            <span className="text-[10px] font-semibold text-white">
              {formatProgressFullDate(latest.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PROGRESS DATA                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ---------------------------------------------------------------- */}
        {/* TASK COMPLETION                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] text-white/35">Task completion</span>

            <span className="text-xs font-bold text-emerald-400">
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
              className="h-full rounded-full bg-emerald-400"
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* AVERAGE SCORE                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] text-white/35">Average score</span>

            <span
              className={`text-xs font-bold ${getProgressScoreColor(
                averageScore,
              )}`}
            >
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
              className={`h-full rounded-full ${getProgressScoreBackground(
                averageScore,
              )}`}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* COMPLETED                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />

            <span className="text-[10px] text-white/35">Completed</span>
          </div>

          <p className="mt-2 text-lg font-black text-white">{completed}</p>

          <p className="text-[9px] text-white/25">{totalTasks} total tasks</p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PENDING                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 text-amber-400" />

            <span className="text-[10px] text-white/35">Pending</span>
          </div>

          <p className="mt-2 text-lg font-black text-white">{pending}</p>

          <p className="text-[9px] text-white/25">tasks remaining</p>
        </div>
      </div>
    </div>
  );
}
