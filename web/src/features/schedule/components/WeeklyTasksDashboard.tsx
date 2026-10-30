"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ListTodo,
  Pencil,
  Plus,
  RefreshCw,
  Repeat,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  IWeeklyPlanStats,
  IWeeklyTask,
  WeekDay,
} from "@/features/schedule/types/weekly.types";
import {
  useDeleteWeeklyPlanMutation,
  useDeleteWeeklyTaskMutation,
  useGetWeeklyPlanQuery,
  useToggleWeeklyTaskMutation,
} from "@/features/schedule/services/weekly.service";
import {
  DAY_KEYS,
  DAY_LABELS,
  getAllCategories,
  getDayDateLabel,
  getDurationLabel,
  getMondayOf,
  getOverlappingTaskIds,
  getTimeRangeLabel,
  getWeekRangeLabel,
  PRIORITY_CONFIG,
  shiftWeek,
  sortTasksChronologically,
} from "../utils/weekly-schedule.utils";
import { AddTaskModal } from "./AddTaskModal";
import { AIWeeklyPlanModal } from "./AIWeeklyPlanModal";
import { cn } from "@/lib/utils";

export function WeeklyTasksDashboard() {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const [selectedDay, setSelectedDay] = useState<WeekDay | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<IWeeklyTask | undefined>();
  const [preselectedDay, setPreselectedDay] = useState<WeekDay | undefined>();
  const [showDeletePlanConfirm, setShowDeletePlanConfirm] = useState(false);

  const {
    data: plan,
    isLoading,
    isError,
    refetch,
  } = useGetWeeklyPlanQuery(weekStart);

  const [toggleWeeklyTask] = useToggleWeeklyTaskMutation();
  const [deleteWeeklyTask] = useDeleteWeeklyTaskMutation();
  const [deleteWeeklyPlan, { isLoading: isDeletingPlan }] =
    useDeleteWeeklyPlanMutation();

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

  // Today's day key if the active weekStart is the current week
  const todayDayKey = useMemo<WeekDay | null>(() => {
    const currentMonday = getMondayOf(new Date());
    if (currentMonday !== weekStart) return null;
    const jsDay = new Date().getDay();
    const map: (WeekDay | null)[] = [
      "SUN",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
    ];
    return map[jsDay];
  }, [weekStart]);

  // Overlapping task IDs
  const overlappingTaskIds = useMemo(() => {
    return getOverlappingTaskIds(tasks);
  }, [tasks]);

  // Dynamic categories
  const categories = useMemo(() => {
    return ["All", ...getAllCategories(tasks)];
  }, [tasks]);

  // Recurring tasks count
  const recurringCount = useMemo(() => {
    return tasks.filter((t) => t.repeatWeekly).length;
  }, [tasks]);

  // Total scheduled duration in minutes
  const totalDurationMinutes = useMemo(() => {
    return tasks.reduce((sum, t) => sum + (t.duration || 60), 0);
  }, [tasks]);

  // Filter tasks by selected category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === "All") return tasks;
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  // Group tasks by day
  const tasksByDay = useMemo(() => {
    const map: Record<WeekDay, IWeeklyTask[]> = {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: [],
      SUN: [],
    };
    for (const task of filteredTasks) {
      const day = task.day as WeekDay;
      if (map[day]) {
        map[day].push(task);
      }
    }
    // Sort each day's tasks chronologically
    for (const day of DAY_KEYS) {
      map[day] = sortTasksChronologically(map[day]);
    }
    return map;
  }, [filteredTasks]);

  // Week navigation
  const handlePrevWeek = () => setWeekStart((w) => shiftWeek(w, -1));
  const handleNextWeek = () => setWeekStart((w) => shiftWeek(w, 1));
  const handleCurrentWeek = () => setWeekStart(getMondayOf(new Date()));

  // Task actions
  const handleToggleTask = async (task: IWeeklyTask) => {
    try {
      await toggleWeeklyTask({ id: task.id, weekStart }).unwrap();
    } catch {
      toast.error("Failed to update task status.");
    }
  };

  const handleDeleteTask = async (task: IWeeklyTask) => {
    try {
      await deleteWeeklyTask({ id: task.id, weekStart }).unwrap();
      toast.success("Task deleted.");
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const handleOpenAddTask = (day?: WeekDay) => {
    setTaskToEdit(undefined);
    setPreselectedDay(day);
    setShowAddTaskModal(true);
  };

  const handleOpenEditTask = (task: IWeeklyTask) => {
    setTaskToEdit(task);
    setPreselectedDay(task.day as WeekDay);
    setShowAddTaskModal(true);
  };

  const handleClearWeek = async () => {
    try {
      await deleteWeeklyPlan({ weekStart }).unwrap();
      setShowDeletePlanConfirm(false);
      toast.success("Weekly plan cleared.");
    } catch {
      toast.error("Failed to clear weekly plan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Hero Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-950/20 via-white/[0.02] to-transparent border border-white/10 shadow-lg relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <CalendarRange className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Weekly Tasks
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-medium">
              AI Optimized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/50 max-w-xl">
            Generate and manage your personalized Monday–Sunday timetable with
            automated weekly execution, habit blocks, and sprint tracking.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all flex items-center gap-2 border border-violet-400/30"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-violet-200" />
            <span>Generate with AI</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenAddTask()}
            className="border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white rounded-xl text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>

          {tasks.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDeletePlanConfirm(true)}
              className="text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl p-2"
              title="Clear weekly plan"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Week Switcher Bar ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            aria-label="Previous week"
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <Calendar className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {getWeekRangeLabel(weekStart)}
            </span>
          </div>

          <button
            onClick={handleNextWeek}
            aria-label="Next week"
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleCurrentWeek}
            className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors ml-1"
          >
            This Week
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0",
                selectedCategory === cat
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "bg-white/[0.02] text-white/40 hover:text-white/70 border border-white/5",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Weekly Overview Stats Strip ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Tasks */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
            <ListTodo className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Total Tasks
            </p>
            <p className="text-xl font-bold text-white mt-0.5">{stats.total}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Completed
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Pending
            </p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Progress % */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Progress
            </p>
            <span className="text-xs font-bold text-violet-300">
              {stats.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/40 mt-2">
            <span>{getDurationLabel(totalDurationMinutes)} scheduled</span>
            <span>{recurringCount} recurring</span>
          </div>
        </div>
      </div>

      {/* ── Day Navigation Tabs (Monday – Sunday) ────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/10 overflow-x-auto">
        <button
          onClick={() => setSelectedDay("ALL")}
          className={cn(
            "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5",
            selectedDay === "ALL"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-white/50 hover:text-white/80 hover:bg-white/5",
          )}
        >
          <span>All Days</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
            {filteredTasks.length}
          </span>
        </button>

        {DAY_KEYS.map((dayKey, index) => {
          const dayTasks = tasksByDay[dayKey];
          const completedCount = dayTasks.filter((t) => t.completed).length;
          const isToday = todayDayKey === dayKey;
          const isSelected = selectedDay === dayKey;

          return (
            <button
              key={dayKey}
              onClick={() => setSelectedDay(dayKey)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 flex flex-col items-center min-w-[70px] relative",
                isSelected
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5",
              )}
            >
              <div className="flex items-center gap-1">
                <span className="font-semibold">{DAY_LABELS[dayKey]}</span>
                {isToday && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="text-[10px] text-white/40">
                {getDayDateLabel(weekStart, index)}
              </span>
              {dayTasks.length > 0 && (
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full mt-1",
                    isSelected
                      ? "bg-white/20 text-white"
                      : completedCount === dayTasks.length
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/10 text-white/60",
                  )}
                >
                  {completedCount}/{dayTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content View: Loading / Error / Empty / Timeline ───────── */}
      {isLoading ? (
        <div className="p-12 text-center space-y-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <RefreshCw className="h-8 w-8 animate-spin text-violet-400 mx-auto" />
          <p className="text-sm text-white/50">Loading weekly timetable...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center space-y-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300">
          <AlertCircle className="h-8 w-8 mx-auto text-red-400" />
          <p className="text-sm font-semibold">
            Failed to load weekly schedule.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="border-red-500/30 hover:bg-red-500/20 text-red-200 text-xs"
          >
            Retry
          </Button>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="p-10 sm:p-14 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-white">
              No tasks scheduled for this week
            </h3>
            <p className="text-xs sm:text-sm text-white/45">
              Let AI generate a tailored Monday–Sunday timetable based on your
              daily routine, working hours, and study goals, or create tasks
              manually.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/25 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate AI Weekly Schedule</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenAddTask()}
              className="border-white/10 text-white/80 hover:text-white rounded-xl text-xs sm:text-sm"
            >
              Add Task Manually
            </Button>
          </div>
        </div>
      ) : (
        /* Daily Task Timelines */
        <div className="space-y-6">
          {(selectedDay === "ALL" ? DAY_KEYS : [selectedDay]).map((dayKey) => {
            const dayTasks = tasksByDay[dayKey];
            const dayOffset = DAY_KEYS.indexOf(dayKey);
            const isToday = todayDayKey === dayKey;
            const completedCount = dayTasks.filter((t) => t.completed).length;

            return (
              <div
                key={dayKey}
                className={cn(
                  "rounded-2xl border transition-all p-4 sm:p-5 space-y-4",
                  isToday
                    ? "bg-violet-950/[0.08] border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.06)]"
                    : "bg-white/[0.02] border-white/5",
                )}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 px-3 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-wider",
                        isToday
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                          : "bg-white/5 text-white/80 border border-white/10",
                      )}
                    >
                      {DAY_LABELS[dayKey]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {getDayDateLabel(weekStart, dayOffset)}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        {dayTasks.length} tasks scheduled • {completedCount}{" "}
                        completed
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenAddTask(dayKey)}
                    className="text-xs text-white/50 hover:text-white hover:bg-white/5 flex items-center gap-1.5 h-8 px-2.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to {DAY_LABELS[dayKey]}</span>
                  </Button>
                </div>

                {/* Day Tasks List */}
                {dayTasks.length === 0 ? (
                  <p className="text-xs text-white/30 italic py-2">
                    No tasks scheduled for {DAY_LABELS[dayKey]}.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {dayTasks.map((task) => {
                      const hasConflict = overlappingTaskIds.has(task.id);
                      const timeRangeLabel = getTimeRangeLabel(
                        task.startTime,
                        task.duration,
                      );
                      const priorityConfig =
                        PRIORITY_CONFIG[task.priority] ??
                        PRIORITY_CONFIG.MEDIUM;

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200",
                            task.completed
                              ? "bg-white/[0.01] border-white/5 opacity-65"
                              : hasConflict
                                ? "bg-amber-500/[0.04] border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.06)]"
                                : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.045]",
                          )}
                        >
                          {/* Left: Checkbox + Time Range + Title */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Toggle checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task)}
                              aria-label={
                                task.completed
                                  ? "Mark task as incomplete"
                                  : "Mark task as completed"
                              }
                              className={cn(
                                "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                                task.completed
                                  ? "bg-emerald-500 border-emerald-400 text-black shadow-sm"
                                  : "border-white/20 hover:border-white/40 bg-white/5",
                              )}
                            >
                              {task.completed && (
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              )}
                            </button>

                            {/* Time badge */}
                            <div className="flex flex-col min-w-[125px] shrink-0">
                              <span className="text-xs font-mono font-medium text-violet-300">
                                {timeRangeLabel}
                              </span>
                              <span className="text-[10px] text-white/40">
                                {getDurationLabel(task.duration)}
                              </span>
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p
                                  className={cn(
                                    "text-sm font-medium text-white truncate",
                                    task.completed &&
                                      "line-through text-white/40",
                                  )}
                                >
                                  {task.title}
                                </p>
                                {hasConflict && (
                                  <span
                                    title="Overlaps with another task at this time"
                                    className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded"
                                  >
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Time conflict</span>
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs text-white/45 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Badges & Edit / Delete */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* Category badge */}
                            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-white/70 font-medium">
                              {task.category}
                            </span>

                            {/* Priority badge */}
                            <span
                              className={cn(
                                "text-[11px] px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1",
                                priorityConfig.badge,
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  priorityConfig.dot,
                                )}
                              />
                              {priorityConfig.label}
                            </span>

                            {/* Recurring badge */}
                            {task.repeatWeekly && (
                              <span
                                title="Repeats weekly"
                                className="p-1 rounded bg-white/5 text-white/50"
                              >
                                <Repeat className="h-3 w-3" />
                              </span>
                            )}

                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditTask(task)}
                              title="Edit task"
                              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task)}
                              title="Delete task"
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── AI Generator Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showAIModal && (
          <AIWeeklyPlanModal
            weekStart={weekStart}
            onClose={() => setShowAIModal(false)}
            onPlanApproved={() => refetch()}
          />
        )}
      </AnimatePresence>

      {/* ── Add / Edit Task Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showAddTaskModal && (
          <AddTaskModal
            key={
              taskToEdit
                ? `edit-${taskToEdit.id}`
                : `add-${preselectedDay ?? "none"}`
            }
            weekStart={weekStart}
            defaultDay={preselectedDay}
            taskToEdit={taskToEdit}
            existingTasks={tasks}
            onClose={() => {
              setShowAddTaskModal(false);
              setTaskToEdit(undefined);
              setPreselectedDay(undefined);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Clear Plan Confirmation Modal ──────────────────────────── */}
      <AnimatePresence>
        {showDeletePlanConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeletePlanConfirm(false)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#0e0f18] border border-white/10 p-5 space-y-4 shadow-2xl">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Clear Weekly Plan?
                </h3>
                <p className="text-xs text-white/50">
                  This will remove all {tasks.length} tasks scheduled for the
                  week of {getWeekRangeLabel(weekStart)}. This action cannot be
                  undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowDeletePlanConfirm(false)}
                  className="text-white/60 hover:text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isDeletingPlan}
                  onClick={handleClearWeek}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4"
                >
                  {isDeletingPlan ? "Clearing..." : "Yes, Clear Week"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
