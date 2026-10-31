"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Clock,
  Pencil,
  Repeat,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IWeeklyTask } from "@/features/schedule/types/weekly.types";
import {
  CATEGORY_THEMES,
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
  const [isExpanded, setIsExpanded] = useState(false);

  const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.MEDIUM;
  const catTheme =
    CATEGORY_THEMES[task.category] ?? {
      bg: "bg-white/[0.05]",
      text: "text-white/70",
      border: "border-white/10",
      dot: "bg-white/40",
    };
  const durationLabel = getDurationLabel(task.duration);
  const timeRangeLabel = getTimeRangeLabel(task.startTime, task.duration);
  const isLongDescription = (task.description?.length ?? 0) > 60;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.16 }}
      className={cn(
        "group relative rounded-xl border p-2.5 transition-all duration-200 flex flex-col gap-2",
        task.completed
          ? "border-white/[0.05] bg-white/[0.015]"
          : hasConflict
            ? "border-amber-500/35 bg-amber-500/[0.035] hover:border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
            : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055] hover:border-violet-500/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.35),0_0_12px_rgba(139,92,246,0.08)]",
      )}
    >
      {/* ── Action Buttons: Floating on hover (desktop) / accessible (touch) ── */}
      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-[#12121a]/95 backdrop-blur-md rounded-lg p-0.5 border border-white/10 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity z-10">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit task"
            title="Edit task"
            className="h-5 w-5 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete task"
          title="Delete task"
          className="h-5 w-5 rounded flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* ── Row 1: Checkbox + Title + Description ─────────────── */}
      <div className="flex items-start gap-2 min-w-0 pr-1">
        <button
          type="button"
          onClick={onToggle}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          className="mt-0.5 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 rounded-full"
        >
          <div
            className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center transition-all duration-200 border",
              task.completed
                ? "bg-emerald-500/25 border-emerald-400 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                : "border-white/30 hover:border-violet-400 bg-white/[0.02] hover:bg-violet-500/10",
            )}
          >
            {task.completed && <Check className="h-2.5 w-2.5 stroke-[3]" />}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-xs font-semibold leading-snug break-words transition-colors",
              task.completed
                ? "text-white/60 line-through decoration-white/30"
                : "text-white/90",
            )}
          >
            {task.title}
          </h4>

          {task.description && (
            <div className="mt-1">
              <p
                className={cn(
                  "text-[11px] leading-relaxed text-white/55 break-words transition-colors",
                  !isExpanded && "line-clamp-2",
                  task.completed && "text-white/40",
                )}
              >
                {task.description}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] text-violet-400 hover:text-violet-300 font-medium hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Conflict Warning Banner (if any) ─────────────────── */}
      {hasConflict && (
        <div
          title={conflictTooltip}
          className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md"
        >
          <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
          <span className="truncate">Schedule overlap</span>
        </div>
      )}

      {/* ── Row 2: Schedule (Time, Duration & Recurrence) ─────── */}
      <div className="flex items-center justify-between gap-1 text-[10px] text-white/45 pt-1.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-1 text-violet-300 font-mono text-[10px] truncate min-w-0">
          <Clock className="h-3 w-3 text-violet-400 shrink-0" />
          <span className="truncate">{timeRangeLabel}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {task.repeatWeekly && (
            <span
              title="Recurring weekly"
              className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-300 font-medium"
            >
              <Repeat className="h-2.5 w-2.5 text-violet-400" />
              <span>Weekly</span>
            </span>
          )}

          <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[9px] text-white/60">
            {durationLabel}
          </span>
        </div>
      </div>

      {/* ── Row 3: Badges (Category & Priority) ───────────────── */}
      <div className="flex items-center justify-between gap-1 pt-0.5">
        {/* Category Badge */}
        {task.category ? (
          <span
            className={cn(
              "text-[9px] font-semibold px-1.5 py-0.5 rounded-md border truncate max-w-[95px]",
              catTheme.bg,
              catTheme.text,
              catTheme.border,
            )}
            title={`Category: ${task.category}`}
          >
            {task.category}
          </span>
        ) : (
          <span />
        )}

        {/* Priority Badge */}
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-md text-[9px] font-semibold border flex items-center gap-1 shrink-0",
            p.badge,
          )}
          title={`Priority: ${p.label}`}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />
          <span>{p.label}</span>
        </span>
      </div>
    </motion.div>
  );
}
