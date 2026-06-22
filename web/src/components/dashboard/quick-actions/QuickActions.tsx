"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { actionStylePalette } from "./data/quickActionsData";
import { QuickAction, Task } from "./types/quickActions.types";
import { ActionButton } from "./components/ActionButton";
import { TaskRow } from "./components/TaskRow";
import { QuickEntryModal } from "./modals/QuickEntryModal";
import { NewActionModal } from "./modals/NewActionModal";
import { EditTaskModal } from "./modals/EditTaskModal";

import { EmptyState } from "@/components/shared/EmptyState";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useToggleTaskMutation,
} from "@/features/tasks/services/task.service";

import { ITask } from "@/features/tasks/types/task.types";
import {
  useDeleteActionMutation,
  useGetActionsQuery,
} from "@/features/actions/services/action.service";
import { IAction } from "@/features/actions/types/action.types";

/* -------------------------------------------------------------------------- */
/*                              SERVER → UI MAPPING                           */
/* -------------------------------------------------------------------------- */

const toUiTask = (task: ITask): Task => ({
  id: task.id,
  label: task.title,
  done: task.completed,
  time: task.time ?? "—",
});

const toUiAction = (action: IAction, index: number): QuickAction => {
  const style = actionStylePalette[index % actionStylePalette.length];

  return {
    id: action.id,
    label: action.actionName,
    taskCount: action.taskCount,
    isPreset: false,
    ...style,
  };
};

/* -------------------------------------------------------------------------- */
/*                               ROOT COMPONENT                               */
/* -------------------------------------------------------------------------- */

export function QuickActions() {
  const [activeModal, setActiveModal] = useState<QuickAction | null>(null);
  const [showNewAction, setShowNewAction] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const { data: tasksData, isLoading, isError } = useGetTasksQuery();
  const { data: actionsData, isLoading: isActionsLoading } =
    useGetActionsQuery();

  const [toggleTask] = useToggleTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteAction] = useDeleteActionMutation();

  const tasks: Task[] = (tasksData ?? []).map(toUiTask);
  const actions: QuickAction[] = (actionsData ?? []).map(toUiAction);

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleToggle = (id: string | number) => {
    toggleTask(String(id));
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (id: string) => {
    const task = tasksData?.find((t) => t.id === id);
    if (task) setEditingTask(task);
  };

  const handleDeleteAction = (id: string) => {
    deleteAction(id);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/*                          QUICK ACTIONS CARD                        */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                Quick Actions
              </h3>
              <p className="text-white/40 text-xs mt-1">Log a new entry fast</p>
            </div>
          </div>

          {/* ── Create New Action button ─────────────────────────────── */}
          <motion.button
            whileHover={{
              scale: 1.02,
              y: -1,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewAction(true)}
            className={cn(
              "group relative overflow-hidden flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold text-white",
              "bg-gradient-to-r from-violet-600 to-indigo-600",
              "border border-violet-500/30",
              "shadow-[0_4px_16px_rgba(109,40,217,0.25)]",
              "hover:shadow-[0_6px_24px_rgba(109,40,217,0.45)]",
              "transition-all duration-300",
            )}
          >
            {/* Shimmer Sweep Effect */}
            <span
              className={cn(
                "absolute inset-0 -translate-x-full skew-x-[-20deg]",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "group-hover:translate-x-full transition-transform duration-700 ease-out",
              )}
            />

            {/* Button Content */}
            <Plus className="h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10 tracking-tight">New Action</span>
          </motion.button>
        </div>

        {/* Action buttons grid */}
        <div className="p-4">
          {isActionsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[88px] rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : actions.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No actions yet"
              description="Create your first quick action to start logging entries fast."
              actionLabel="New Action"
              onAction={() => setShowNewAction(true)}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {actions.map((action, i) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  index={i}
                  onClick={() => setActiveModal(action)}
                  onDelete={() => handleDeleteAction(action.id)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/*                          TODAY'S TASKS CARD                        */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold leading-none">
                  Today&apos;s Tasks
                </h3>
                <p className="text-white/40 text-xs mt-1">
                  {isLoading
                    ? "Loading…"
                    : `${completedCount} of ${tasks.length} complete`}
                </p>
              </div>
            </div>

            {/* Progress badge */}
            {!isLoading && tasks.length > 0 && (
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full border",
                  progressPercent === 100
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                    : "text-violet-400 bg-violet-500/10 border-violet-500/20",
                )}
              >
                {progressPercent}%
              </span>
            )}
          </div>

          {/* Animated progress track */}
          {tasks.length > 0 && (
            <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  progressPercent === 100
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-violet-500 to-blue-500",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
              />
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="p-3 space-y-px">
          {isLoading && (
            <div className="px-3 py-8 text-center text-white/30 text-sm">
              Loading your tasks…
            </div>
          )}

          {isError && (
            <div className="px-3 py-8 text-center text-red-400/80 text-sm">
              Couldn&apos;t load tasks. Please try again.
            </div>
          )}

          {!isLoading && !isError && tasks.length === 0 && (
            <EmptyState
              title="No tasks yet"
              description="Use Quick Actions above to log your first entry."
            />
          )}

          {!isLoading &&
            !isError &&
            tasks.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                index={i}
                onToggle={() => handleToggle(task.id)}
                onEdit={() => handleEditTask(String(task.id))}
                onDelete={() => handleDeleteTask(String(task.id))}
              />
            ))}
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/*                         MODALS (portal)                            */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {activeModal && (
          <QuickEntryModal
            action={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewAction && (
          <NewActionModal onClose={() => setShowNewAction(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
