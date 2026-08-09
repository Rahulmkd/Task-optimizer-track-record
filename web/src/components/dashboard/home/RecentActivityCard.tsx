"use client";

/* -------------------------------------------------------------------------- */
/*                             RECENT ACTIVITY CARD                           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6"
    >
      <h3 className="text-white text-sm font-semibold mb-4">Recent Activity</h3>

      {isLoading ? (
        <p className="text-zinc-500 text-xs">Loading…</p>
      ) : recent.length === 0 ? (
        <p className="text-zinc-500 text-xs">Nothing completed yet today.</p>
      ) : (
        <div className="space-y-2.5">
          {recent.map((task) => (
            <div key={task.id} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-sm text-zinc-300 truncate line-through">
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
