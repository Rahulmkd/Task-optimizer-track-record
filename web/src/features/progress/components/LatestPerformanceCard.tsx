"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert } from "lucide-react";

import {
  getProgressScoreColor,
  getProgressScoreLabel,
  getProgressScoreBackground,
} from "../utils/progress.utils";

import { TrendIndicator } from "./TrendIndicator";

interface LatestPerformanceCardProps {
  latestScore: number;
  scoreTrend: number;
  completedTasks: number;
  pendingTasks: number;
}

export function LatestPerformanceCard({
  latestScore,
  scoreTrend,
  completedTasks,
  pendingTasks,
}: LatestPerformanceCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Latest Performance
            </p>

            <p className="mt-1 text-base font-bold text-white">
              {getProgressScoreLabel(latestScore)}
            </p>
          </div>

          <div
            className={`
              flex h-12 w-12 items-center justify-center
              rounded-2xl border border-white/10
              bg-white/[0.04]
              text-lg font-black shadow-lg
              ${getProgressScoreColor(latestScore)}
            `}
          >
            {latestScore}
          </div>
        </div>

        <div className="my-5 h-px bg-white/[0.08]" />

        {/* ------------------------------------------------------------------ */}
        {/* SCORE                                                              */}
        {/* ------------------------------------------------------------------ */}

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-xs font-semibold">
              <span className="text-white/50">Productivity Score</span>
              <span className="text-white/80">{latestScore}/100</span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06] p-0.5 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${latestScore}%`,
                }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${getProgressScoreBackground(
                  latestScore,
                )}`}
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* TREND                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-white/50">
              Session-over-session trend
            </span>

            <TrendIndicator value={scoreTrend} />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* TASK SUMMARY                                                     */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">
                  {completedTasks}
                </p>
                <p className="text-[10px] text-emerald-300/80 font-medium">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <CircleAlert className="h-4 w-4 text-white/40 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">
                  {pendingTasks}
                </p>
                <p className="text-[10px] text-white/50 font-medium">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-white/40">
        AI evaluated productivity index
      </div>
    </div>
  );
}
