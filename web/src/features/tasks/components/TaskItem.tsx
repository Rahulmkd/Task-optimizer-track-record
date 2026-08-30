"use client";

/* -------------------------------------------------------------------------- */
/*                                   TASK ITEM                                */
/* -------------------------------------------------------------------------- */

import { CheckCircle2, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DisplayTask {
  id: string;
  title: string;
  time: string | null;
  completed: boolean;
  category?: string;
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: DisplayTask;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-3 rounded-xl",
        "transition-colors duration-200 hover:bg-zinc-800/50",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 cursor-pointer"
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-violet-400" />
        ) : (
          <Circle className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate transition-colors duration-200",
            task.completed ? "line-through text-zinc-500" : "text-zinc-100",
          )}
        >
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {task.category && (
            <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800 border border-zinc-700/60 rounded-full px-2 py-0.5">
              {task.category}
            </span>
          )}
          {task.time && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Clock className="h-3 w-3" />
              {task.time}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 min-w-[64px] justify-end">
        {task.completed ? (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            Done
          </span>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={onEdit}
              title="Edit task"
              className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700/60 transition-colors duration-200"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Delete task"
              className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
