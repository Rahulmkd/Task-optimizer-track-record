"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useToggleTaskMutation,
} from "@/features/tasks/services/task.service";

import { ITask, Task } from "@/features/tasks/types/task.types";
import { EditTaskModal } from "./EditTaskModal";
import { TaskRow } from "./TaskRow";
import { AIAssistanceModal } from "@/features/story/components/AIAssistanceModal";

const toUiTask = (task: ITask): Task => ({
  id: task.id,
  label: task.title,
  done: task.completed,
  time: task.time ?? "—",
});

export function TodaysTasksCard() {
  const [showSummary, setShowSummary] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const { data: tasksData, isLoading, isError } = useGetTasksQuery();

  const [toggleTask] = useToggleTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks: Task[] = (tasksData ?? []).map(toUiTask);

  const completedCount = tasks.filter((task) => task.done).length;

  const handleToggle = (id: string | number) => {
    toggleTask(String(id));
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (id: string) => {
    const task = tasksData?.find((task) => task.id === id);

    if (task) {
      setEditingTask(task);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.38,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
      >
        {/* Header */}
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/15">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-none text-white">
                  Today&apos;s Tasks
                </h3>

                <p className="mt-1 text-xs text-white/40">
                  {isLoading
                    ? "Loading…"
                    : `${completedCount} of ${tasks.length} complete`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors duration-200 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Summary
            </button>
          </div>

          {/* <CategoryChips /> */}
        </div>

        {/* Tasks */}
        <div className="space-y-px p-3">
          {isLoading && (
            <div className="px-3 py-8 text-center text-sm text-white/30">
              Loading your tasks…
            </div>
          )}

          {isError && (
            <div className="px-3 py-8 text-center text-sm text-red-400/80">
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
            tasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                onToggle={() => handleToggle(task.id)}
                onEdit={() => handleEditTask(String(task.id))}
                onDelete={() => handleDeleteTask(String(task.id))}
              />
            ))}
        </div>
      </motion.div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <AIAssistanceModal onClose={() => setShowSummary(false)} />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
