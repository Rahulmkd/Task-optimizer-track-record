"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
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
} from "../utils/weekly-schedule.utils";

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
          className="mt-0.5 shrink-0 cursor-pointer focus:outline-none"
        >
          <CheckCircle2
            className={cn(
              "h-4 w-4 transition-colors",
              task.completed
                ? "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]"
                : "text-white/30 hover:text-white/60",
            )}
          />
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs font-semibold leading-snug transition-colors",
              task.completed ? "text-white/40 line-through" : "text-white/85",
            )}
          >
            {task.title}
          </p>

          {/* Description snippet if available */}
          {task.description && (
            <p
              className={cn(
                "text-[11px] leading-tight mt-1 line-clamp-2 transition-colors",
                task.completed ? "text-white/30 line-through" : "text-white/50",
              )}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action buttons (Edit & Delete) — accessible on mobile, reveal on desktop hover */}
        <div className="flex items-center gap-1 shrink-0 ml-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="Edit task"
              title="Edit task"
              className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}

          <button
            onClick={onDelete}
            aria-label="Delete task"
            title="Delete task"
            className="p-1 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* conflict warning badge */}
      {hasConflict && (
        <div
          title={conflictTooltip}
          className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md"
        >
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span className="truncate">Schedule overlap</span>
        </div>
      )}

      {/* metadata footer */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/45 pt-2 border-t border-white/[0.04] gap-1 flex-wrap">
        <div className="flex items-center gap-1 text-violet-300 font-mono">
          <Clock className="h-2.5 w-2.5 text-violet-400" />
          <span>{timeRangeLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {task.repeatWeekly && (
            <span
              title="Recurring task"
              className="flex items-center text-white/40 hover:text-white/60"
            >
              <Repeat className="h-2.5 w-2.5" />
            </span>
          )}

          {/* duration badge */}
          <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/5 font-mono text-[9px] text-white/60">
            {durationLabel}
          </span>

          {/* priority badge */}
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1",
              p.badge,
            )}
          >
            <span className={cn("h-1 w-1 rounded-full", p.dot)} />
            {p.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
