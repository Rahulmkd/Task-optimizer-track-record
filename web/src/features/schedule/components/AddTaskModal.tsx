"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Flag,
  FolderKanban,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/ui/Backdrop";
import { ModalPanel } from "@/components/ui/ModalPanel";

import { cn } from "@/lib/utils";
import {
  Category,
  IWeeklyTask,
  Priority,
  WeekDay,
} from "@/features/schedule/types/weekly.types";
import {
  useCreateWeeklyTaskMutation,
  useUpdateWeeklyTaskMutation,
} from "@/features/schedule/services/weekly.service";
import {
  DEFAULT_START_TIME,
  findConflictingTasks,
  formatTimeDisplay,
  getAllCategories,
  getTimeRangeLabel,
  saveCustomCategory,
} from "../utils/next-week-schedule.utils";
import { ModernTimeSelect } from "./ModernTimeSelect";

/* -------------------------------------------------------------------------- */
/*                               CONSTANTS                                    */
/* -------------------------------------------------------------------------- */

const DAYS: { value: WeekDay; label: string }[] = [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "HIGH", label: "High", color: "text-red-400" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-400" },
  { value: "LOW", label: "Low", color: "text-emerald-400" },
];

const DURATIONS: { value: number; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
  { value: 360, label: "6 hours" },
];

/* -------------------------------------------------------------------------- */
/*                            SELECT WRAPPER                                   */
/* -------------------------------------------------------------------------- */

function DarkSelect({
  id,
  icon: Icon,
  value,
  onChange,
  children,
  className,
  ariaLabel,
}: {
  id?: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 h-10 rounded-xl border border-white/10 bg-white/[0.05] px-3 transition-colors focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30",
        className,
      )}
    >
      {Icon && (
        <Icon className="h-3.5 w-3.5 text-white/30 shrink-0 pointer-events-none" />
      )}
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-transparent text-white/80 text-xs outline-none cursor-pointer appearance-none [&>option]:bg-[#121217] [&>option]:text-white pr-4 truncate"
      >
        {children}
      </select>
      <ChevronDown className="h-3.5 w-3.5 text-white/30 absolute right-3 pointer-events-none" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MODAL                                        */
/* -------------------------------------------------------------------------- */

interface AddTaskModalProps {
  weekStart: string;
  /** Pre-select a day when opening from a day-column + button. */
  defaultDay?: WeekDay;
  /** If provided, modal operates in Edit mode */
  taskToEdit?: IWeeklyTask;
  /** All tasks currently in the week, used for conflict checking */
  existingTasks?: IWeeklyTask[];
  onClose: () => void;
}

export function AddTaskModal({
  weekStart,
  defaultDay,
  taskToEdit,
  existingTasks = [],
  onClose,
}: AddTaskModalProps) {
  // ── dynamic categories state ───────────────────────────────────────────
  const [categories, setCategories] = useState<string[]>(() => {
    const all = getAllCategories(existingTasks);
    if (taskToEdit?.category && !all.includes(taskToEdit.category)) {
      return [...all, taskToEdit.category];
    }
    return all;
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // ── form state ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [day, setDay] = useState<WeekDay>(
    (taskToEdit?.day as WeekDay) ?? defaultDay ?? "MON",
  );
  const [priority, setPriority] = useState<Priority>(
    (taskToEdit?.priority as Priority) ?? "MEDIUM",
  );
  const [category, setCategory] = useState<Category>(
    taskToEdit?.category ?? (categories[0] || "Study"),
  );
  const [duration, setDuration] = useState<number>(
    taskToEdit?.duration ?? 60,
  );
  const [startTime, setStartTime] = useState<string>(
    taskToEdit?.startTime ? formatTimeDisplay(taskToEdit.startTime) : DEFAULT_START_TIME,
  );
  const [repeatWeekly, setRepeatWeekly] = useState(
    taskToEdit?.repeatWeekly ?? false,
  );
  const [description, setDescription] = useState(
    taskToEdit?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus title on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, []);

  // Ensure taskToEdit's category is in categories list
  useEffect(() => {
    if (taskToEdit?.category && !categories.includes(taskToEdit.category)) {
      setCategories((prev) => [...prev, taskToEdit.category]);
    }
  }, [taskToEdit?.category, categories]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [createTask, { isLoading: isCreating }] = useCreateWeeklyTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateWeeklyTaskMutation();
  const isLoading = isCreating || isUpdating || isSubmitting;

  // Detect time conflicts with other tasks on the selected day
  const conflictingTasks = useMemo(() => {
    return findConflictingTasks(
      {
        id: taskToEdit?.id,
        day,
        startTime,
        duration,
      },
      existingTasks,
    );
  }, [taskToEdit?.id, day, startTime, duration, existingTasks]);

  const handleCreateCategory = (customName?: string | unknown): string | null => {
    const raw = typeof customName === "string" ? customName : newCategoryName;
    const trimmed = raw.trim();
    if (!trimmed) {
      setCategoryError("Please enter a category name.");
      return null;
    }
    if (trimmed.length > 50) {
      setCategoryError("Category name must be 50 characters or less.");
      return null;
    }
    const updated = saveCustomCategory(trimmed);
    const combined = Array.from(new Set([...categories, ...updated, trimmed]));
    setCategories(combined);
    setCategory(trimmed);
    setNewCategoryName("");
    setIsCreatingCategory(false);
    setCategoryError(null);
    return trimmed;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (isLoading) return;

    setError(null);

    // Resolve category cleanly, committing any typed new category
    let selectedCategory = category;
    if (isCreatingCategory) {
      const trimmed = newCategoryName.trim();
      if (trimmed) {
        const created = handleCreateCategory(trimmed);
        if (created) {
          selectedCategory = created;
        }
      } else {
        setIsCreatingCategory(false);
        setCategoryError(null);
        if (!selectedCategory || selectedCategory === "__CREATE_NEW__") {
          selectedCategory = categories[0] || "Study";
        }
      }
    }

    if (!selectedCategory || selectedCategory === "__CREATE_NEW__") {
      selectedCategory = categories[0] || "Study";
    }
    selectedCategory = selectedCategory.trim();

    setIsSubmitting(true);

    try {
      const selectedStartTime = startTime || DEFAULT_START_TIME;

      if (taskToEdit) {
        await updateTask({
          id: taskToEdit.id,
          weekStart,
          data: {
            title: title.trim(),
            description: description.trim() || null,
            day,
            priority,
            category: selectedCategory,
            duration,
            startTime: selectedStartTime,
            repeatWeekly,
          },
        }).unwrap();
      } else {
        await createTask({
          weekStart,
          title: title.trim(),
          description: description.trim() || null,
          day,
          priority,
          category: selectedCategory,
          duration,
          startTime: selectedStartTime,
          repeatWeekly,
        }).unwrap();
      }

      onClose();
    } catch {
      setError(
        taskToEdit
          ? "Couldn't update this task. Please try again."
          : "Couldn't save this task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel className="max-h-[90vh] flex flex-col my-auto">
        {/* ── Pinned Header ─────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0e0e16]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                {taskToEdit ? "Edit Weekly Task" : "Add Weekly Task"}
              </h3>
              <p className="text-white/40 text-xs mt-1">
                {taskToEdit
                  ? "Update your scheduled task details."
                  : "Plan a task for your week."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          {/* Title input */}
          <FormField
            id="wt-title"
            label="Task title"
            required
            error={error ?? undefined}
          >
            <Input
              ref={inputRef}
              id="wt-title"
              placeholder="e.g. Study React Hooks"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </FormField>

          {/* Day + Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="wt-day" className="text-xs font-medium text-white/60">
                Day
              </label>
              <DarkSelect
                id="wt-day"
                icon={CalendarDays}
                value={day}
                onChange={(v) => setDay(v as WeekDay)}
                ariaLabel="Day selection"
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </DarkSelect>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="wt-priority" className="text-xs font-medium text-white/60">
                Priority
              </label>
              <DarkSelect
                id="wt-priority"
                icon={Flag}
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                ariaLabel="Priority selection"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </DarkSelect>
            </div>
          </div>

          {/* Category + Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={isCreatingCategory ? "wt-new-category" : "wt-category"}
                  className="text-xs font-medium text-white/60"
                >
                  Category
                </label>
                {!isCreatingCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCategory(true);
                      setNewCategoryName("");
                      setCategoryError(null);
                    }}
                    className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryName("");
                      setCategoryError(null);
                      if (!category || category === "__CREATE_NEW__") {
                        setCategory(categories[0] || "Study");
                      }
                    }}
                    className="text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isCreatingCategory ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      id="wt-new-category"
                      autoFocus
                      type="text"
                      maxLength={50}
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        if (categoryError) setCategoryError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateCategory();
                        } else if (e.key === "Escape") {
                          setIsCreatingCategory(false);
                          setCategoryError(null);
                        }
                      }}
                      placeholder="e.g. Design, Reading"
                      className="flex-1 min-w-0 h-10 rounded-xl border border-violet-500/50 bg-white/[0.06] px-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => handleCreateCategory()}
                      disabled={!newCategoryName.trim()}
                      className="h-10 px-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                  {categoryError && (
                    <p className="text-[11px] text-red-400">{categoryError}</p>
                  )}
                </div>
              ) : (
                <DarkSelect
                  id="wt-category"
                  icon={FolderKanban}
                  value={category}
                  onChange={(v) => {
                    if (v === "__CREATE_NEW__") {
                      setIsCreatingCategory(true);
                      setNewCategoryName("");
                      setCategoryError(null);
                    } else {
                      setCategory(v);
                      setIsCreatingCategory(false);
                      setCategoryError(null);
                    }
                  }}
                  ariaLabel="Category selection"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option
                    value="__CREATE_NEW__"
                    className="bg-[#1b1726] text-violet-300 font-semibold"
                  >
                    + Create Category...
                  </option>
                </DarkSelect>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="wt-duration" className="text-xs font-medium text-white/60">
                Duration
              </label>
              <DarkSelect
                id="wt-duration"
                icon={Clock3}
                value={duration}
                onChange={(v) => setDuration(Number(v))}
                ariaLabel="Duration selection"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </DarkSelect>
            </div>
          </div>

          {/* Start time (inline expandable - no layout overlap or clipping) */}
          <div className="space-y-1.5">
            <label htmlFor="wt-start-time" className="text-xs font-medium text-white/60">
              Start time
            </label>
            <ModernTimeSelect
              id="wt-start-time"
              value={startTime}
              onChange={(v) => setStartTime(v)}
              day={day}
              existingTasks={existingTasks}
              taskDuration={duration}
              currentTaskId={taskToEdit?.id}
            />
          </div>

          {/* Repeat every week */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={repeatWeekly}
              onClick={() => setRepeatWeekly((prev) => !prev)}
              className={cn(
                "h-4 w-4 rounded-full border transition-all flex items-center justify-center cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
                repeatWeekly
                  ? "bg-violet-600 border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                  : "border-white/30 bg-transparent hover:border-white/50",
              )}
            >
              {repeatWeekly && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
            <label
              onClick={() => setRepeatWeekly((prev) => !prev)}
              className="text-xs text-white/90 cursor-pointer select-none font-normal"
            >
              Repeat every week
            </label>
          </div>

          {/* Description (optional) */}
          <div className="space-y-1.5">
            <label htmlFor="wt-description" className="text-xs font-medium text-white/60">
              Description (optional)
            </label>
            <textarea
              id="wt-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or instructions..."
              className="w-full min-h-[76px] rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/90 placeholder:text-white/30 outline-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 resize-none"
            />
          </div>

          {/* Schedule conflict warning banner (if any) */}
          {conflictingTasks.length > 0 && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] text-amber-200 text-xs animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-amber-300">Schedule Conflict</p>
                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                  This task overlaps with{" "}
                  <span className="font-medium text-white">
                    "{conflictingTasks[0].title}"
                  </span>{" "}
                  ({getTimeRangeLabel(conflictingTasks[0].startTime, conflictingTasks[0].duration)})
                  {conflictingTasks.length > 1
                    ? ` and ${conflictingTasks.length - 1} other task(s)`
                    : ""}
                  . You can still save; both tasks will be preserved in your schedule.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Pinned Footer (Always visible, never overlapped) ───────── */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-white/[0.06] bg-[#0e0e16]/95 backdrop-blur-sm flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            className="flex-1 h-11 rounded-full cursor-pointer shadow-[0_3px_12px_rgba(109,40,217,0.25)]"
            onClick={handleSave}
            disabled={!title.trim() || isLoading}
            loading={isLoading}
          >
            {taskToEdit ? "Save Changes" : "Save Task"}
          </Button>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
