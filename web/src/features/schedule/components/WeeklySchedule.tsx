"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  IWeeklyPlanStats,
  IWeeklyTask,
  WeekDay,
} from "@/features/schedule/types/weekly.types";
import { useGetWeeklyPlanQuery } from "@/features/schedule/services/weekly.service";
import { ScheduleHeader } from "./ScheduleHeader";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { WeekStatsStrip } from "./WeekStatsStrip";
import { OverdueNotice } from "./OverdueNotice";
import { WeekGrid } from "./WeekGrid";
import { HighPriorityRemaining } from "./HighPriorityRemaining";
import { ScheduleSkeleton } from "./ScheduleSkeleton";
import { ScheduleError } from "./ScheduleError";
import { AddTaskModal } from "./AddTaskModal";
import { AIWeeklyPlanModal } from "./AIWeeklyPlanModal";
import {
  CategoryFilter,
  DAY_KEYS,
  getAllCategories,
  getCurrentDayKey,
  getMondayOf,
  shiftWeek,
} from "../utils/weekly-schedule.utils";
import { Button } from "@/components/ui/button";

export function WeeklySchedule() {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [preselectedDay, setPreselectedDay] = useState<WeekDay | undefined>();
  const [taskToEdit, setTaskToEdit] = useState<IWeeklyTask | undefined>();

  const {
    data: plan,
    isLoading,
    isError,
    refetch,
  } = useGetWeeklyPlanQuery(weekStart);

  const tasks = useMemo<IWeeklyTask[]>(() => plan?.tasks ?? [], [plan?.tasks]);

  const stats = useMemo<IWeeklyPlanStats>(() => {
    return (
      plan?.stats ?? {
        total: 0,
        completed: 0,
        pending: 0,
        progressPercent: 0,
      }
    );
  }, [plan?.stats]);

  // Derive today's day key for highlighting
  const todayDayKey = useMemo<WeekDay | null>(() => {
    const todayMonday = getMondayOf(new Date());
    if (todayMonday !== weekStart) return null;
    return getCurrentDayKey();
  }, [weekStart]);

  // Dynamic categories list
  const dynamicCategories = useMemo(() => {
    return ["All", ...getAllCategories(tasks)];
  }, [tasks]);

  // Count overdue: tasks on past days (before today in the same week) that aren't completed
  const overdue = useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed || !todayDayKey) return false;
      const idx = DAY_KEYS.indexOf(t.day as WeekDay);
      const todayIdx = DAY_KEYS.indexOf(todayDayKey);
      return idx < todayIdx;
    }).length;
  }, [tasks, todayDayKey]);

  const handlePrevWeek = () => setWeekStart((w) => shiftWeek(w, -1));
  const handleNextWeek = () => setWeekStart((w) => shiftWeek(w, 1));

  const handleAddForDay = (day: WeekDay) => {
    setTaskToEdit(undefined);
    setPreselectedDay(day);
    setShowAddTask(true);
  };

  const handleOpenAddTask = () => {
    setTaskToEdit(undefined);
    setPreselectedDay(undefined);
    setShowAddTask(true);
  };

  const handleEditTask = (task: IWeeklyTask) => {
    setTaskToEdit(task);
    setPreselectedDay(task.day as WeekDay);
    setShowAddTask(true);
  };

  const handleCloseAddTask = () => {
    setShowAddTask(false);
    setPreselectedDay(undefined);
    setTaskToEdit(undefined);
  };

  if (isLoading) return <ScheduleSkeleton />;

  if (isError) return <ScheduleError />;

  return (
    <div className="space-y-5">
      <ScheduleHeader
        weekStart={weekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onAddTask={handleOpenAddTask}
        onOpenAI={() => setShowAIModal(true)}
      />

      <CategoryFilterBar
        value={categoryFilter}
        categories={dynamicCategories}
        onChange={setCategoryFilter}
      />

      <WeekStatsStrip stats={stats} />

      <OverdueNotice count={overdue} />

      {/* ── Day columns ─────────────────────────────────────────────── */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-xl bg-violet-600/15 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm sm:text-base font-bold text-white">
              No tasks scheduled this week
            </h3>
            <p className="text-xs text-white/50">
              Generate a personalized Monday–Sunday timetable using AI, or
              add your first task manually.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.25)] flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate with AI</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenAddTask}
              className="border-white/10 text-white/80 hover:text-white text-xs rounded-xl"
            >
              Add Task Manually
            </Button>
          </div>
        </div>
      ) : (
        <WeekGrid
          tasks={tasks}
          weekStart={weekStart}
          categoryFilter={categoryFilter}
          todayDayKey={todayDayKey}
          onAddForDay={handleAddForDay}
          onEditTask={handleEditTask}
        />
      )}

      <HighPriorityRemaining tasks={tasks} />

      {/* ── Add / Edit Task Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddTask && (
          <AddTaskModal
            key={
              taskToEdit
                ? `edit-${taskToEdit.id}`
                : `add-${preselectedDay ?? "all"}`
            }
            weekStart={weekStart}
            defaultDay={preselectedDay}
            taskToEdit={taskToEdit}
            existingTasks={tasks}
            onClose={handleCloseAddTask}
          />
        )}
      </AnimatePresence>

      {/* ── AI Weekly Plan Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showAIModal && (
          <AIWeeklyPlanModal
            weekStart={weekStart}
            onClose={() => setShowAIModal(false)}
            onPlanApproved={() => refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
