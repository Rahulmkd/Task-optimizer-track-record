"use client";

/* -------------------------------------------------------------------------- */
/*                                UPCOMING CARD                               */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";

export function UpcomingCard() {
  const { data: tasksData, isLoading } = useGetTasksQuery();

  const upcoming = (tasksData ?? [])
    .filter((t) => !t.completed && !!t.time)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6"
    >
      <h3 className="text-white text-sm font-semibold mb-4">Upcoming</h3>

      {isLoading ? (
        <p className="text-zinc-500 text-xs">Loading…</p>
      ) : upcoming.length === 0 ? (
        <p className="text-zinc-500 text-xs">
          Nothing scheduled. Enjoy the calm.
        </p>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 tabular-nums w-14 shrink-0">
                <Clock className="h-3 w-3" />
                {task.time}
              </span>
              <span className="text-sm text-zinc-200 truncate">
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
