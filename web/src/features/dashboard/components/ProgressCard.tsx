"use client";

/* -------------------------------------------------------------------------- */
/*                               PROGRESS CARD                                */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";

export function ProgressCard() {
  const { data: tasksData, isLoading } = useGetTasksQuery();

  const tasks = tasksData ?? [];
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-semibold">
          Today&apos;s Progress
        </h3>
        <span className="text-xs font-bold text-violet-400">
          {isLoading ? "—" : `${percent}%`}
        </span>
      </div>

      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <p className="text-zinc-500 text-xs mt-3">
        {isLoading
          ? "Loading…"
          : total === 0
            ? "No tasks yet today"
            : `${completed} / ${total} completed`}
      </p>
    </motion.div>
  );
}
