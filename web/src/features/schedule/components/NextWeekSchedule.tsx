"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { IWeeklyTask, WeekDay } from "@/features/schedule/types/weekly.types";
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
import {
  CategoryFilter,
  DAY_KEYS,
  getMondayOf,
  shiftWeek,
} from "../utils/next-week-schedule.utils";

export function NextWeekSchedule() {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [showAddTask, setShowAddTask] = useState(false);
  const [preselectedDay, setPreselectedDay] = useState<WeekDay | undefined>();

  const { data: plan, isLoading, isError } = useGetWeeklyPlanQuery(weekStart);

  // Derive today's day key for highlighting
  const todayDayKey = useMemo<WeekDay | null>(() => {
    const todayMonday = getMondayOf(new Date());
    if (todayMonday !== weekStart) return null;
    const jsDay = new Date().getDay(); // 0=Sun … 6=Sat
    const keys: (WeekDay | null)[] = [
      "SUN",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
    ];
    return keys[jsDay];
  }, [weekStart]);

  const handlePrevWeek = () => setWeekStart((w) => shiftWeek(w, -1));
  const handleNextWeek = () => setWeekStart((w) => shiftWeek(w, 1));

  const handleAddForDay = (day: WeekDay) => {
    setPreselectedDay(day);
    setShowAddTask(true);
  };

  const handleOpenAddTask = () => {
    setPreselectedDay(undefined);
    setShowAddTask(true);
  };

  const handleCloseAddTask = () => {
    setShowAddTask(false);
    setPreselectedDay(undefined);
  };

  if (isLoading) return <ScheduleSkeleton />;

  if (isError) return <ScheduleError />;

  const tasks: IWeeklyTask[] = plan?.tasks ?? [];

  const stats = plan?.stats ?? {
    total: 0,
    completed: 0,
    pending: 0,
    progressPercent: 0,
  };

  // Count overdue: tasks on past days (before today in the same week) that aren't completed
  const overdue = tasks.filter((t) => {
    if (t.completed || !todayDayKey) return false;
    const idx = DAY_KEYS.indexOf(t.day as WeekDay);
    const todayIdx = DAY_KEYS.indexOf(todayDayKey);
    return idx < todayIdx;
  }).length;

  return (
    <div className="space-y-5">
      <ScheduleHeader
        weekStart={weekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onAddTask={handleOpenAddTask}
      />

      <CategoryFilterBar value={categoryFilter} onChange={setCategoryFilter} />

      <WeekStatsStrip stats={stats} />

      <OverdueNotice count={overdue} />

      {/* ── Day columns ─────────────────────────────────────────────── */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks this week"
          description="Add your first task to start planning your week."
          actionLabel="Add Task"
          onAction={handleOpenAddTask}
        />
      ) : (
        <WeekGrid
          tasks={tasks}
          weekStart={weekStart}
          categoryFilter={categoryFilter}
          todayDayKey={todayDayKey}
          onAddForDay={handleAddForDay}
        />
      )}

      <HighPriorityRemaining tasks={tasks} />

      {/* ── Add Task Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddTask && (
          <AddTaskModal
            weekStart={weekStart}
            defaultDay={preselectedDay}
            onClose={handleCloseAddTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
