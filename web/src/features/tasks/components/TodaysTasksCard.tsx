"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Plus, ListTodo } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useToggleTaskMutation,
} from "@/features/tasks/services/task.service";

import { ITask, Task } from "@/features/tasks/types/task.types";
import { EditTaskModal } from "./EditTaskModal";
import { CreateTaskModal } from "./CreateTaskModal";
import { TaskRow } from "./TaskRow";
import { AIAssistanceModal } from "@/features/story/components/AIAssistanceModal";
import { Button } from "@/components/ui/button";

const toUiTask = (task: ITask): Task => ({
  id: task.id,
  label: task.title,
  done: task.completed,
  time: task.time ?? "—",
});

export function TodaysTasksCard() {
  const [showSummary, setShowSummary] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
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
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: 0.05,
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-xl"
      >
        {/* Header */}
        <div className="border-b border-white/[0.08] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold leading-tight text-white">
                  Today&apos;s Active Tasks
                </h3>
                <span className="text-[11px] font-semibold text-white/50 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-full">
                  {isLoading ? "…" : `${completedCount}/${tasks.length}`}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-white/45">
                {isLoading
                  ? "Loading tasks…"
                  : `${tasks.length - completedCount} tasks remaining today`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewTask(true)}
              className="text-xs font-semibold h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </Button>

            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/30 hover:bg-violet-500/25 transition-all shrink-0 cursor-pointer shadow-sm shadow-violet-950/40"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>AI Summary</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-3 sm:p-4 space-y-1">
          {isLoading && (
            <div className="py-12 text-center text-xs text-white/40">
              Loading your schedule…
            </div>
          )}

          {isError && (
            <div className="py-12 text-center text-xs text-red-400">
              Couldn&apos;t load tasks right now. Please refresh the page.
            </div>
          )}

          {!isLoading && !isError && tasks.length === 0 && (
            <EmptyState
              icon={ListTodo}
              title="No tasks scheduled today"
              description="Plan your day with precision by adding your first task block."
              actionLabel="Add Your First Task"
              onAction={() => setShowNewTask(true)}
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

      {/* Quick Entry Modal */}
      <AnimatePresence>
        {showNewTask && (
          <CreateTaskModal onClose={() => setShowNewTask(false)} />
        )}
      </AnimatePresence>

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
