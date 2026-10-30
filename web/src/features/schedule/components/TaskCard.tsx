"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Clock3,
  Pencil,
  Repeat,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IWeeklyTask } from "@/features/schedule/types/weekly.types";
import {
  getDurationLabel,
  getTimeRangeLabel,
  PRIORITY_CONFIG,
} from "../utils/next-week-schedule.utils";

interface TaskCardProps {
  task: IWeeklyTask;
  hasConflict?: boolean;
  conflictTooltip?: string;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete: () => void;
}

export function TaskCard({
  task,
  hasConflict = false,
  conflictTooltip,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.MEDIUM;
  const durationLabel = getDurationLabel(task.duration);
  const timeRangeLabel = getTimeRangeLabel(task.startTime, task.duration);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative rounded-xl border p-3 transition-all duration-200",
        task.completed
          ? "border-white/[0.06] bg-white/[0.02]"
          : hasConflict
            ? "border-amber-500/40 bg-amber-500/[0.04] hover:border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
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

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs font-medium leading-snug transition-colors",
              task.completed ? "text-white/25 line-through" : "text-white/80",
            )}
          >
            {task.title}
          </p>

          {/* Description snippet if available */}
          {task.description && (
            <p
              className={cn(
                "text-[11px] leading-tight mt-1 line-clamp-2 transition-colors",
                task.completed ? "text-white/20 line-through" : "text-white/45",
              )}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action buttons (Edit & Delete) — visible on hover */}
        <div className="flex items-center gap-1 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="Edit task"
              className="text-white/30 hover:text-violet-300 transition-colors p-0.5"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}

          <button
            onClick={onDelete}
            aria-label="Delete task"
            className="text-white/30 hover:text-red-400 transition-colors p-0.5"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Scheduled Time Banner / Badge */}
      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
            task.completed
              ? "text-white/25 bg-white/[0.02] border-white/[0.05]"
              : "text-violet-300 bg-violet-500/10 border-violet-500/20",
          )}
          title={`Scheduled: ${timeRangeLabel}`}
        >
          <Clock className="h-2.5 w-2.5" />
          {timeRangeLabel}
        </span>

        {/* Recurring badge */}
        {task.repeatWeekly && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md border border-violet-500/30 bg-violet-500/10 text-violet-300"
            title="Repeats every week"
          >
            <Repeat className="h-2.5 w-2.5 text-violet-400" />
            Weekly
          </span>
        )}

        {/* Conflict warning badge if overlapping */}
        {hasConflict && !task.completed && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border text-amber-400 bg-amber-500/15 border-amber-500/30 animate-pulse"
            title={conflictTooltip ?? "Schedule conflict: overlaps with another task"}
          >
            <AlertTriangle className="h-2.5 w-2.5 text-amber-400" />
            Conflict
          </span>
        )}
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
        <span
          className="inline-flex items-center text-[10px] text-white/50 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]"
          title={`Category: ${task.category}`}
        >
          {task.category}
        </span>
      </div>
    </motion.div>
  );
}
