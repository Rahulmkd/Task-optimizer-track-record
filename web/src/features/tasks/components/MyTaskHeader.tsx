"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";

export function MyTaskHeader() {
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const [showNewTask, setShowNewTask] = useState(false);

  const tasks = tasksData ?? [];

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const upcomingTasks = tasks.filter(
    (task) => !task.completed && Boolean(task.time),
  ).length;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className={cn(
          "rounded-2xl",
          "border border-white/10",
          "bg-white/[0.04]",
          "backdrop-blur-xl",
          "p-5 sm:p-6",
        )}
      >
        {/* Header Top Row */}
        <div className="flex items-start justify-between gap-4">
          {/* Title + Stats */}
          <div className="min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2">
              <ListTodo
                aria-hidden
                className="h-5 w-5 shrink-0 text-violet-400"
              />

              <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white">
                <span className="text-gradient">Tasks List</span>
              </h1>
            </div>

            {/* Description */}
            <p className="mt-1 ml-7 text-sm text-white/40">
              Your productivity tasks.
            </p>

            {/* Stats */}
            {isLoading ? (
              <TaskStatsSkeleton />
            ) : (
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-400">
                <Stat
                  value={totalTasks}
                  label={totalTasks === 1 ? "task today" : "tasks today"}
                />

                <Dot />

                <Stat value={completedTasks} label="completed" tone="emerald" />

                <Dot />

                <Stat
                  value={upcomingTasks}
                  label={
                    upcomingTasks === 1 ? "upcoming task" : "upcoming tasks"
                  }
                  tone="violet"
                />
              </div>
            )}
          </div>

          {/* New Task Button */}
          <motion.button
            type="button"
            whileHover={{
              scale: 1.02,
              y: -1,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() => setShowNewTask(true)}
            className={cn(
              "group relative flex shrink-0 items-center gap-1.5",
              "h-8 px-3",
              "rounded-md",
              "text-[11px] font-semibold text-white",
              "overflow-hidden",
              "bg-linear-to-r from-violet-600 to-indigo-600",
              "border border-violet-500/30",
              "shadow-[0_3px_12px_rgba(109,40,217,0.22)]",
              "hover:shadow-[0_4px_16px_rgba(109,40,217,0.4)]",
              "transition-all duration-300",
              "focus:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-violet-500/60",
            )}
          >
            {/* Shimmer */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-0",
                "-translate-x-full skew-x-[-20deg]",
                "bg-linear-to-r",
                "from-transparent via-white/20 to-transparent",
                "transition-transform duration-700 ease-out",
                "group-hover:translate-x-full",
              )}
            />

            <Plus
              aria-hidden
              className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover:rotate-90"
            />

            <span className="relative z-10 tracking-tight">New Task</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Modal */}
      <AnimatePresence>
        {showNewTask && (
          <CreateTaskModal onClose={() => setShowNewTask(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

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

      <span>{label}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Separator                                                                  */
/* -------------------------------------------------------------------------- */

function Dot() {
  return (
    <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function TaskStatsSkeleton() {
  return (
    <div className="mt-2.5 flex items-center gap-5">
      <span className="h-4 w-20 animate-pulse rounded bg-white/10" />
      <Dot />
      <span className="h-4 w-16 animate-pulse rounded bg-white/10" />
      <Dot />
      <span className="h-4 w-24 animate-pulse rounded bg-white/10" />
    </div>
  );
}
