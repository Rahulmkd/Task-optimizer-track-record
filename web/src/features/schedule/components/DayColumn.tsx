"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { IWeeklyTask, WeekDay } from "@/features/schedule/types/weekly.types";
import {
  useDeleteWeeklyTaskMutation,
  useToggleWeeklyTaskMutation,
} from "@/features/schedule/services/weekly.service";

import { TaskCard } from "./TaskCard";
import {
  DAY_LABELS,
  getDayDateLabel,
  getOverlappingTaskIds,
  getTimeRangeLabel,
  sortTasksChronologically,
} from "../utils/weekly-schedule.utils";

interface DayColumnProps {
  dayKey: WeekDay;
  dayOffset: number;
  weekStart: string;
  tasks: IWeeklyTask[];
  isToday: boolean;
  onAdd: () => void;
  onEditTask?: (task: IWeeklyTask) => void;
}

export function DayColumn({
  dayKey,
  dayOffset,
  weekStart,
  tasks,
  isToday,
  onAdd,
  onEditTask,
}: DayColumnProps) {
  const [toggleTask] = useToggleWeeklyTaskMutation();
  const [deleteTask] = useDeleteWeeklyTaskMutation();

  const completedCount = tasks.filter((t) => t.completed).length;

  // Chronological ordering within the day
  const sortedTasks = useMemo(() => sortTasksChronologically(tasks), [tasks]);

  // Set of task IDs that overlap with another task on this day
  const conflictIds = useMemo(() => getOverlappingTaskIds(tasks), [tasks]);

  return (
    <div
      className={cn(
        "rounded-2xl border flex flex-col overflow-hidden transition-all duration-200",
        "w-full min-w-0 h-full",
        isToday
          ? "border-violet-500/35 bg-gradient-to-b from-violet-950/25 via-violet-950/5 to-transparent shadow-[0_0_24px_rgba(139,92,246,0.08)]"
          : "border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:border-white/15",
      )}
    >
      {/* ── Column Header ──────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2.5 border-b transition-colors",
          isToday
            ? "border-violet-500/25 bg-violet-500/[0.08]"
            : "border-white/[0.06] bg-white/[0.02]",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isToday && (
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-wider truncate",
                  isToday ? "text-violet-300" : "text-white/80",
                )}
              >
                {DAY_LABELS[dayKey]}
              </p>
              {isToday && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Today
                </span>
              )}
            </div>
            <p className="text-[10px] text-white/40 font-medium truncate">
              {getDayDateLabel(weekStart, dayOffset)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {tasks.length > 0 && (
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-colors",
                completedCount === tasks.length
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                  : isToday
                    ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                    : "bg-white/[0.05] text-white/50 border-white/[0.08]",
              )}
            >
              {completedCount}/{tasks.length}
            </span>
          )}
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add task on ${DAY_LABELS[dayKey]}`}
            title={`Add task on ${DAY_LABELS[dayKey]}`}
            className="h-6 w-6 rounded-lg bg-white/[0.05] hover:bg-violet-600/30 hover:border-violet-500/40 border border-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Tasks Container ──────────────────────────────────────── */}
      <div className="flex-1 p-2 space-y-2 flex flex-col justify-start">
        <AnimatePresence mode="popLayout">
          {sortedTasks.length === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="w-full py-6 rounded-xl border border-dashed border-white/[0.06] hover:border-violet-500/30 bg-white/[0.01] hover:bg-violet-500/[0.03] transition-all flex flex-col items-center justify-center gap-1.5 text-white/25 hover:text-violet-300 group/empty cursor-pointer my-auto"
            >
              <div className="h-6 w-6 rounded-lg bg-white/[0.03] group-hover/empty:bg-violet-600/20 border border-white/10 group-hover/empty:border-violet-500/30 flex items-center justify-center transition-colors">
                <Plus className="h-3 w-3" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                No tasks
              </span>
            </button>
          ) : (
            sortedTasks.map((task) => {
              const hasConflict = conflictIds.has(task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  hasConflict={hasConflict}
                  conflictTooltip={
                    hasConflict
                      ? `Conflict: This task's time (${getTimeRangeLabel(task.startTime, task.duration)}) overlaps with another task on ${DAY_LABELS[dayKey]}`
                      : undefined
                  }
                  onToggle={() => toggleTask({ id: task.id, weekStart })}
                  onEdit={() => onEditTask?.(task)}
                  onDelete={() => deleteTask({ id: task.id, weekStart })}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
