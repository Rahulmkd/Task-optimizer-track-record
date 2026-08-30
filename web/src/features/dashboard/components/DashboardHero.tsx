"use client";

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD HERO                              */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const [showNewTask, setShowNewTask] = useState(false);

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.name?.split(" ")[0] || "there";

  const tasks = tasksData ?? [];
  const totalToday = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  // "Upcoming" = still-pending tasks that have a scheduled time.
  const upcoming = tasks.filter((t) => !t.completed && !!t.time).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
    >
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
          {greeting},
          <span aria-hidden className="text-gradient">
            {" "}
            {firstName}
          </span>
        </h1>

        {!isLoading && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-sm text-zinc-400">
            <Stat
              value={totalToday}
              label={totalToday === 1 ? "task today" : "tasks today"}
            />
            <Dot />
            <Stat value={completed} label="completed" tone="emerald" />
            <Dot />
            <Stat
              value={upcoming}
              label={upcoming === 1 ? "upcoming task" : "upcoming tasks"}
              tone="violet"
            />
          </div>
        )}
      </div>

      {/* ── Create New Task button ─────────────────────────────── */}
      <motion.button
        whileHover={{
          scale: 1.02,
          y: -1,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowNewTask(true)}
        className={cn(
          "group relative overflow-hidden flex items-center gap-2 h-9 px-4 rounded-md text-xs font-semibold text-white",
          "bg-linear-to-r from-violet-600 to-indigo-600",
          "border border-violet-500/30",
          "shadow-[0_4px_16px_rgba(109,40,217,0.25)]",
          "hover:shadow-[0_6px_24px_rgba(109,40,217,0.45)]",
          "transition-all duration-300",
        )}
      >
        {/* Shimmer Sweep Effect */}
        <span
          className={cn(
            "absolute inset-0 -translate-x-full skew-x-[-20deg]",
            "bg-linear-to-r from-transparent via-white/20 to-transparent",
            "group-hover:translate-x-full transition-transform duration-700 ease-out",
          )}
        />

        {/* Button Content */}
        <Plus className="h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
        <span className="relative z-10 tracking-tight">New Task</span>
      </motion.button>

      <AnimatePresence>
        {showNewTask && (
          <CreateTaskModal onClose={() => setShowNewTask(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone?: "emerald" | "violet";
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={cn(
          "font-semibold",
          tone === "emerald"
            ? "text-emerald-400"
            : tone === "violet"
              ? "text-violet-400"
              : "text-white",
        )}
      >
        {value}
      </span>
      {label}
    </span>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden />;
}
