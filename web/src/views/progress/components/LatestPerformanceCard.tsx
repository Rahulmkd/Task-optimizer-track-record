"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert } from "lucide-react";

import {
  getProgressScoreColor,
  getProgressScoreLabel,
  getProgressScoreBackground,
} from "../progress.utils";

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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Latest performance
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {getProgressScoreLabel(latestScore)}
          </p>
        </div>

        <div
          className={`
            flex h-12 w-12 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.03]
            text-lg font-black
            ${getProgressScoreColor(latestScore)}
          `}
        >
          {latestScore}
        </div>
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* ------------------------------------------------------------------ */}
      {/* SCORE                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-[10px] text-white/35">Score</span>

            <span className="text-[10px] font-bold text-white/60">
              {latestScore}/100
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
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

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/35">
            Compared with previous day
          </span>

          <TrendIndicator value={scoreTrend} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TASK SUMMARY                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-2 gap-3">
          {/* Completed */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <span className="text-[9px] uppercase tracking-wider text-white/25">
                Done today
              </span>
            </div>

            <p className="mt-1 text-lg font-black text-emerald-400">
              {completedTasks}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-4 w-4 text-amber-400" />

              <span className="text-[9px] uppercase tracking-wider text-white/25">
                Pending
              </span>
            </div>

            <p className="mt-1 text-lg font-black text-white">{pendingTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
