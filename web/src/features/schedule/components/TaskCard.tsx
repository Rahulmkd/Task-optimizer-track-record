"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IWeeklyTask } from "@/features/schedule/types/weekly.types";
import {
  getDurationLabel,
  PRIORITY_CONFIG,
} from "../utils/next-week-schedule.utils";

interface TaskCardProps {
  task: IWeeklyTask;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.MEDIUM;
  const durationLabel = getDurationLabel(task.duration);

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
