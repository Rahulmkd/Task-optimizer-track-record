"use client";

/* -------------------------------------------------------------------------- */
/*                                UPCOMING CARD                               */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Clock, CalendarCheck } from "lucide-react";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";

export function UpcomingCard() {
  const { data: tasksData, isLoading } = useGetTasksQuery();

  const upcoming = (tasksData ?? [])
    .filter((t) => !t.completed && !!t.time)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-tight">
                Upcoming Queue
              </h3>
              <p className="text-[11px] text-white/45">Next scheduled blocks</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-white/40">
            {upcoming.length} pending
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-7 rounded-lg bg-white/[0.04] animate-pulse" />
            <div className="h-7 rounded-lg bg-white/[0.04] animate-pulse" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="py-5 text-center flex flex-col items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 mb-2">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <p className="text-white/40 text-xs">Nothing scheduled right now.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <span className="flex items-center gap-1 text-[11px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md tabular-nums shrink-0">
                  <Clock className="h-3 w-3" />
                  {task.time}
                </span>
                <span className="text-xs text-white/80 truncate font-medium">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-white/40 flex items-center justify-between">
        <span>Ordered chronologically</span>
        <span>IST (UTC+5:30)</span>
      </div>
    </motion.div>
  );
}
