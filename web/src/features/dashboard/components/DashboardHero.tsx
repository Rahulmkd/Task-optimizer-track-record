"use client";

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD HERO                              */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, CheckCircle2, Calendar, Clock, Sparkles } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useGetTasksQuery } from "@/features/tasks/services/task.service";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { Button } from "@/components/ui/button";

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
  const upcoming = tasks.filter((t) => !t.completed && !!t.time).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/25 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
      >
        {/* Ambient background decoration */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>Productivity Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {greeting},{" "}
            <span className="text-gradient">
              {firstName}
            </span>
          </h1>

          {!isLoading && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white font-medium">
                <Calendar className="h-3 w-3 text-white/40" />
                <strong className="text-white font-semibold">{totalToday}</strong>{" "}
                {totalToday === 1 ? "task today" : "tasks today"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <strong className="font-semibold">{completed}</strong> completed
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
                <Clock className="h-3 w-3 text-violet-400" />
                <strong className="font-semibold">{upcoming}</strong>{" "}
                {upcoming === 1 ? "upcoming" : "upcoming"}
              </span>
            </div>
          )}
        </div>

        {/* ── Create New Task button ─────────────────────────────── */}
        <div className="relative z-10 shrink-0">
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
      </motion.div>

      <AnimatePresence>
        {showNewTask && (
          <CreateTaskModal onClose={() => setShowNewTask(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
