import { CheckCircle2, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import { Task } from "../types/quickActions.types";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18 + index * 0.045, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
    >
      {/* Toggle Area */}
      <button
        type="button"
        onClick={onToggle}
        className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer"
      >
        <motion.div
          animate={task.done ? { scale: [1, 1.22, 1] } : { scale: 1 }}
          transition={{ duration: 0.28 }}
        >
          {task.done ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 drop-shadow-[0_0_7px_rgba(52,211,153,0.55)]" />
          ) : (
            <Circle className="h-5 w-5 text-white/20 shrink-0 group-hover:text-white/35 transition-colors" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate transition-colors",
              task.done
                ? "line-through text-white/25"
                : "text-white/75 group-hover:text-white",
            )}
          >
            {task.label}
          </p>
          <p className="flex items-center gap-1 text-xs text-white/25 mt-0.5">
            <Clock className="h-3 w-3" />
            {task.time}
          </p>
        </div>
      </button>

      {/* Done pill */}
      <div className="flex items-center gap-2 shrink-0 min-w-[88px] justify-end">
        <AnimatePresence mode="wait">
          {task.done ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="text-[10px] font-semibold tracking-wide text-emerald-400/80 border border-emerald-500/20 bg-emerald-500/8 px-2 py-0.5 rounded-full"
            >
              Done
            </motion.span>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150"
            >
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  title="Edit task"
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
