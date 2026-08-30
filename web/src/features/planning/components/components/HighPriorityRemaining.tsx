"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

import { IWeeklyTask, WeekDay } from "@/features/planning/types/weekly.types";

import { DAY_LABELS } from "../next-week-schedule.utils";

interface HighPriorityRemainingProps {
  tasks: IWeeklyTask[];
}

export function HighPriorityRemaining({ tasks }: HighPriorityRemainingProps) {
  const remaining = tasks
    .filter((t) => !t.completed && t.priority === "HIGH")
    .slice(0, 6);

  if (remaining.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-4 w-4 text-orange-400" />
        <h3 className="text-white text-sm font-semibold">
          High-Priority Remaining
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {remaining.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3"
          >
            <p className="text-white/80 text-xs font-semibold">
              {task.title}
            </p>
            <p className="text-white/35 text-[10px] mt-1">
              {DAY_LABELS[task.day as WeekDay]} · {task.category}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
