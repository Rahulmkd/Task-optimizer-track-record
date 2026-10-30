"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Plus, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { Button } from "@/components/ui/button";

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
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/20 via-white/[0.02] to-transparent backdrop-blur-xl p-5 sm:p-7 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <ListTodo className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Daily Tasks &amp; Schedule
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-white/50 max-w-xl">
              Track daily time blocks, check off completed milestones, and maintain sustained focus.
            </p>

            {!isLoading && (
              <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white font-medium">
                  <Calendar className="h-3 w-3 text-white/40" />
                  <strong className="text-white font-semibold">{totalTasks}</strong>{" "}
                  {totalTasks === 1 ? "task" : "tasks"}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <strong className="font-semibold">{completedTasks}</strong> completed
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
                  <Clock className="h-3 w-3 text-violet-400" />
                  <strong className="font-semibold">{upcomingTasks}</strong> upcoming
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => setShowNewTask(true)}
              className="shadow-lg shadow-violet-950/40"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {showNewTask && (
          <CreateTaskModal onClose={() => setShowNewTask(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
