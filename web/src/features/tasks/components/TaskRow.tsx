"use client";

import { CheckCircle2, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Task } from "../types/task.types";

export function TaskRow({
  task,
  index,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  index: number;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all"
    >
      {/* Toggle Area */}
      <button
        type="button"
        onClick={onToggle}
        className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer focus:outline-none"
      >
        <motion.div
          animate={task.done ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          {task.done ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          ) : (
            <Circle className="h-5 w-5 text-white/30 group-hover:text-violet-400 transition-colors" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs sm:text-sm font-medium truncate transition-colors",
              task.done
                ? "line-through text-white/40"
                : "text-white/85 group-hover:text-white",
            )}
          >
            {task.label}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/40 mt-0.5">
            <Clock className="h-3 w-3 text-violet-400/80" />
            <span>{task.time}</span>
          </p>
        </div>
      </button>

      {/* Action Area & Status */}
      <div className="flex items-center gap-2 shrink-0">
        {task.done && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Done
          </span>
        )}

        {/* Action buttons (always touch-friendly on mobile, reveal on desktop hover) */}
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit task"
              aria-label="Edit task"
              className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete task"
              aria-label="Delete task"
              className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
