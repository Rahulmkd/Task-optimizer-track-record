"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { IJournalSummary } from "@/features/ai/types/ai.types";

import { formatProgressDate } from "../progress.utils";

interface TaskPerformanceChartProps {
  journals: IJournalSummary[];
}

export function TaskPerformanceChart({ journals }: TaskPerformanceChartProps) {
  const data = [...journals].reverse().slice(-7);

  const maxTasks = Math.max(
    ...data.map((journal) => journal.completedTasks + journal.pendingTasks),
    1,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start justify-between border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Task performance</h3>

            <p className="mt-0.5 text-[11px] text-white/35">
              Completed vs pending
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col items-end gap-1 text-[9px]">
          <span className="flex items-center gap-1.5 text-white/35">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Completed
          </span>

          <span className="flex items-center gap-1.5 text-white/35">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            Pending
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BARS                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="p-4">
        <div className="flex h-[210px] items-end gap-2 sm:gap-3">
          {data.map((journal, index) => {
            const total = journal.completedTasks + journal.pendingTasks;

            const completedHeight =
              total === 0 ? 0 : (journal.completedTasks / maxTasks) * 100;

            const pendingHeight =
              total === 0 ? 0 : (journal.pendingTasks / maxTasks) * 100;

            return (
              <div
                key={journal.id}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                {/* Values */}
                <div className="mb-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-white/40">
                    {journal.completedTasks}
                  </span>
                </div>

                {/* Bar */}
                <div className="flex h-[170px] items-end justify-center gap-1">
                  {/* Completed */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${completedHeight}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="w-full max-w-[18px] rounded-t-md bg-emerald-400/80"
                    title={`${journal.completedTasks} completed`}
                  />

                  {/* Pending */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${pendingHeight}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05 + 0.05,
                    }}
                    className="w-full max-w-[18px] rounded-t-md bg-white/[0.14]"
                    title={`${journal.pendingTasks} pending`}
                  />
                </div>

                {/* Date */}
                <span className="mt-2 truncate text-center text-[9px] text-white/25">
                  {formatProgressDate(journal.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
