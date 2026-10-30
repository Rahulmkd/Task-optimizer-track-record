"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
            {getDayDateLabel(weekStart, dayOffset)}
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

      {/* tasks in chronological order */}
      <div className="flex-1 p-2 space-y-2 min-h-[80px]">
        <AnimatePresence>
          {sortedTasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-white/20 text-center pt-4"
            >
              No tasks
            </motion.p>
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
