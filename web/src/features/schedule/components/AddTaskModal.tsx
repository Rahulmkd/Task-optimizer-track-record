"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Clock,
  Clock3,
  Flag,
  FolderKanban,
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
  calculateEndTime,
  CATEGORY_VALUES,
  DEFAULT_START_TIME,
  findConflictingTasks,
  formatTimeDisplay,
  getTimeRangeLabel,
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
  icon: React.ElementType;
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
      <Icon className="h-3.5 w-3.5 text-white/30 shrink-0 pointer-events-none" />
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-white/80 text-xs outline-none cursor-pointer appearance-none [&>option]:bg-[#121217] [&>option]:text-white pr-4"
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
  // ── form state ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [day, setDay] = useState<WeekDay>(
    (taskToEdit?.day as WeekDay) ?? defaultDay ?? "MON",
  );
  const [priority, setPriority] = useState<Priority>(
    (taskToEdit?.priority as Priority) ?? "MEDIUM",
  );
  const [category, setCategory] = useState<Category>(
    (taskToEdit?.category as Category) ?? CATEGORY_VALUES[0],
  );
  const [duration, setDuration] = useState<number>(
    taskToEdit?.duration ?? 60,
  );
  const [startTime, setStartTime] = useState<string>(
    taskToEdit?.startTime ? formatTimeDisplay(taskToEdit.startTime) : DEFAULT_START_TIME,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus title on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, []);

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

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (isLoading) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const selectedStartTime = startTime || DEFAULT_START_TIME;

      if (taskToEdit) {
        await updateTask({
          id: taskToEdit.id,
          weekStart,
          data: {
            title: title.trim(),
            day,
            priority,
            category,
            duration,
            startTime: selectedStartTime,
          },
        }).unwrap();
      } else {
        await createTask({
          weekStart,
          title: title.trim(),
          day,
          priority,
          category,
          duration,
          startTime: selectedStartTime,
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

  const calculatedEndTime = calculateEndTime(startTime, duration);

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
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
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="p-5 space-y-4 max-h-[calc(90vh-130px)] overflow-y-auto">
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
              <label htmlFor="wt-day" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <CalendarDays className="h-3 w-3 text-white/40" />
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
              <label htmlFor="wt-priority" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <Flag className="h-3 w-3 text-white/40" />
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

          {/* Start Time + Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="wt-start-time" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <Clock className="h-3 w-3 text-violet-400" />
                Start Time
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

            <div className="space-y-1.5">
              <label htmlFor="wt-duration" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <Clock3 className="h-3 w-3 text-white/40" />
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

          {/* End Time / Schedule calculation helper badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-violet-500/[0.08] border border-violet-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-violet-200">
              <Clock className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <span>
                Schedule:{" "}
                <span className="font-semibold text-white">
                  {formatTimeDisplay(startTime)} – {calculatedEndTime}
                </span>
              </span>
            </div>
            <span className="text-[11px] text-violet-300/70 font-medium">
              Ends at {calculatedEndTime}
            </span>
          </div>

          {/* Category row */}
          <div className="space-y-1.5">
            <label htmlFor="wt-category" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
              <FolderKanban className="h-3 w-3 text-white/40" />
              Category
            </label>
            <DarkSelect
              id="wt-category"
              icon={FolderKanban}
              value={category}
              onChange={(v) =>
                setCategory(v as Category)
              }
              ariaLabel="Category selection"
            >
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </DarkSelect>
          </div>

          {/* Schedule conflict warning banner */}
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

          {/* Footer buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              className="flex-1 h-11"
              onClick={handleSave}
              disabled={!title.trim() || isLoading}
              loading={isLoading}
            >
              {taskToEdit ? "Save Changes" : "Save Task"}
            </Button>
          </div>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
