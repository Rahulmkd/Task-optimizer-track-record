"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddTaskModal } from "./actionModals/AddTaskModel";
import {
  useDeleteWeeklyTaskMutation,
  useGetWeeklyPlanQuery,
  useToggleWeeklyTaskMutation,
} from "@/features/weekly/services/weekly.service";
import { IWeeklyTask, WeekDay } from "@/features/weekly/types/weekly.types";

/* -------------------------------------------------------------------------- */
/*                              DATE HELPERS                                  */
/* -------------------------------------------------------------------------- */

const DAY_KEYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DAY_LABELS: Record<WeekDay, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

/** Get the ISO date string (YYYY-MM-DD) of the Monday for a given Date. */
function getMondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  // getDay() returns 0=Sun … 6=Sat; shift so Mon=0
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d.toISOString().split("T")[0];
}

/** Add `weeks` weeks to a YYYY-MM-DD weekStart string. */
function shiftWeek(weekStart: string, weeks: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}

/** "Jul 20 – Jul 26, 2026" display label. */
function weekRangeLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

/** Date number for a specific day offset from weekStart. */
function dayDate(weekStart: string, offset: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + offset);
  return String(d.getDate());
}

/* -------------------------------------------------------------------------- */
/*                              PRIORITY STYLES                               */
/* -------------------------------------------------------------------------- */

const priorityConfig: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  HIGH: {
    dot: "bg-red-400",
    badge: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "High",
  },
  MEDIUM: {
    dot: "bg-yellow-400",
    badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    label: "Medium",
  },
  LOW: {
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    label: "Low",
  },
};

/* -------------------------------------------------------------------------- */
/*                              CATEGORY FILTERS                              */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  "All",
  "Study",
  "Fitness",
  "Nutrition",
  "Personal",
  "Career",
  "Other",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

/* -------------------------------------------------------------------------- */
/*                            WEEKLY TASK CARD                                */
/* -------------------------------------------------------------------------- */

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: IWeeklyTask;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const p = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;
  const durationLabel =
    task.duration < 60
      ? `${task.duration}m`
      : `${Math.floor(task.duration / 60)}h${task.duration % 60 ? ` ${task.duration % 60}m` : ""}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group rounded-xl border p-3 transition-colors duration-200",
        task.completed
          ? "border-white/[0.06] bg-white/[0.02]"
          : "border-white/10 bg-white/[0.04] hover:border-white/20",
      )}
    >
      {/* title row */}
      <div className="flex items-start gap-2">
        <button
          onClick={onToggle}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          className="mt-0.5 shrink-0"
        >
          <CheckCircle2
            className={cn(
              "h-4 w-4 transition-colors",
              task.completed
                ? "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]"
                : "text-white/20 hover:text-white/50",
            )}
          />
        </button>

        <p
          className={cn(
            "flex-1 text-xs font-medium leading-snug transition-colors",
            task.completed ? "text-white/25 line-through" : "text-white/80",
          )}
        >
          {task.title}
        </p>

        {/* delete — visible on hover */}
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="ml-auto opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* meta row */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {/* priority dot badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
            p.badge,
          )}
        >
          <span className={cn("h-1 w-1 rounded-full", p.dot)} />
          {p.label}
        </span>

        {/* duration */}
        <span className="flex items-center gap-0.5 text-[10px] text-white/30">
          <Clock3 className="h-2.5 w-2.5" />
          {durationLabel}
        </span>

        {/* category */}
        <span className="text-[10px] text-white/25">{task.category}</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DAY COLUMN                                    */
/* -------------------------------------------------------------------------- */

function DayColumn({
  dayKey,
  dayOffset,
  weekStart: _weekStart,
  tasks,
  isToday,
  onAdd,
}: {
  dayKey: WeekDay;
  dayOffset: number;
  weekStart: string;
  tasks: IWeeklyTask[];
  isToday: boolean;
  onAdd: () => void;
}) {
  const [toggleTask] = useToggleWeeklyTaskMutation();
  const [deleteTask] = useDeleteWeeklyTaskMutation();

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div
      className={cn(
        "rounded-2xl border flex flex-col overflow-hidden",
        isToday
          ? "border-violet-500/30 bg-violet-500/[0.04]"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      {/* column header */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2.5 border-b",
          isToday ? "border-violet-500/20" : "border-white/[0.06]",
        )}
      >
        <div>
          <p
            className={cn(
              "text-xs font-bold",
              isToday ? "text-violet-300" : "text-white/70",
            )}
          >
            {DAY_LABELS[dayKey]}
          </p>
          <p className="text-[10px] text-white/30">
            {dayDate(_weekStart, dayOffset)} Jul
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {tasks.length > 0 && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                isToday
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-white/[0.06] text-white/40",
              )}
            >
              {completedCount}/{tasks.length}
            </span>
          )}
          <button
            onClick={onAdd}
            aria-label={`Add task on ${DAY_LABELS[dayKey]}`}
            className="h-5 w-5 rounded-md bg-white/[0.06] hover:bg-violet-500/20 hover:text-violet-400 text-white/30 flex items-center justify-center transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* tasks */}
      <div className="flex-1 p-2 space-y-2 min-h-[80px]">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-white/20 text-center pt-4"
            >
              No tasks
            </motion.p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() =>
                  toggleTask({ id: task.id, weekStart: _weekStart })
                }
                onDelete={() =>
                  deleteTask({ id: task.id, weekStart: _weekStart })
                }
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            SKELETON LOADER                                 */
/* -------------------------------------------------------------------------- */

function PlannerSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function WeeklyPlanner() {
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

  const filteredTasks = (tasks: IWeeklyTask[]) =>
    categoryFilter === "All"
      ? tasks
      : tasks.filter((t) => t.category === categoryFilter);

  const handlePrevWeek = () => setWeekStart((w) => shiftWeek(w, -1));
  const handleNextWeek = () => setWeekStart((w) => shiftWeek(w, 1));

  const handleAddForDay = (day: WeekDay) => {
    setPreselectedDay(day);
    setShowAddTask(true);
  };

  if (isLoading) return <PlannerSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-center text-red-400 text-sm">
        Couldn&apos;t load your weekly plan. Please try again.
      </div>
    );
  }

  const stats = plan?.stats ?? {
    total: 0,
    completed: 0,
    pending: 0,
    progressPercent: 0,
  };

  // Count overdue: tasks on past days (before today in the same week) that aren't completed
  const overdue =
    plan?.tasks.filter((t) => {
      if (t.completed || !todayDayKey) return false;
      const idx = DAY_KEYS.indexOf(t.day as WeekDay);
      const todayIdx = DAY_KEYS.indexOf(todayDayKey);
      return idx < todayIdx;
    }).length ?? 0;

  return (
    <div className="space-y-5">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
              <CalendarDays className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold leading-none">
                Weekly Planner
              </h1>
              <p className="text-white/40 text-xs mt-1">
                Organise your entire week in one place.
              </p>
            </div>
          </div>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => {
              setPreselectedDay(undefined);
              setShowAddTask(true);
            }}
            className="shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={handlePrevWeek}
            aria-label="Previous week"
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <h2 className="text-white text-xs font-semibold">
            {weekRangeLabel(weekStart)}
          </h2>

          <button
            onClick={handleNextWeek}
            aria-label="Next week"
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* ── Category filter pills ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-2 flex-wrap"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
              categoryFilter === cat
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-900/30"
                : "border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:border-white/20",
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {/* Progress */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
              Week Progress
            </p>
            <span className="text-white font-bold text-sm">
              {stats.progressPercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-white/30 text-[11px] mt-2">
            {stats.completed} of {stats.total} tasks done
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xl font-black text-emerald-400">
              {stats.completed}
            </p>
            <p className="text-white/40 text-[10px]">Completed</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-yellow-400 shrink-0" />
          <div>
            <p className="text-xl font-black text-yellow-400">
              {stats.pending}
            </p>
            <p className="text-white/40 text-[10px]">Pending</p>
          </div>
        </div>
      </motion.div>

      {/* ── Overdue notice ──────────────────────────────────────────── */}
      {overdue > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-red-400 text-xs"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {overdue} task{overdue > 1 ? "s" : ""} overdue from earlier this week
        </motion.div>
      )}

      {/* ── Day columns ─────────────────────────────────────────────── */}
      {plan && plan.tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks this week"
          description="Add your first task to start planning your week."
          actionLabel="Add Task"
          onAction={() => {
            setPreselectedDay(undefined);
            setShowAddTask(true);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
        >
          {DAY_KEYS.map((dayKey, offset) => {
            const dayTasks = filteredTasks(
              (plan?.tasks ?? []).filter((t) => t.day === dayKey),
            );
            return (
              <DayColumn
                key={dayKey}
                dayKey={dayKey}
                dayOffset={offset}
                weekStart={weekStart}
                tasks={dayTasks}
                isToday={dayKey === todayDayKey}
                onAdd={() => handleAddForDay(dayKey)}
              />
            );
          })}
        </motion.div>
      )}

      {/* ── Upcoming priorities (tasks not done, ordered by priority) ── */}
      {plan &&
        plan.tasks.filter((t) => !t.completed && t.priority === "HIGH").length >
          0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-orange-400" />
              <h3 className="text-white text-sm font-semibold">
                High-Priority Remaining
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plan.tasks
                .filter((t) => !t.completed && t.priority === "HIGH")
                .slice(0, 6)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3"
                  >
                    <p className="text-white/80 text-xs font-semibold">
                      {task.title}
                    </p>
                    <p className="text-white/35 text-[10px] mt-1">
                      {DAY_LABELS[task.day as WeekDay]} · {task.category}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

      {/* ── Add Task Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddTask && (
          <AddTaskModal
            weekStart={weekStart}
            defaultDay={preselectedDay}
            onClose={() => {
              setShowAddTask(false);
              setPreselectedDay(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
