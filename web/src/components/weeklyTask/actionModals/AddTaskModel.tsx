"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Flag,
  FolderKanban,
  Sparkles,
  X,
} from "lucide-react";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/dashboard/quick-actions/modals/Backdrop";
import { ModelPanel } from "@/components/dashboard/quick-actions/modals/ModelPanel";
import { useCreateWeeklyTaskMutation } from "@/features/weekly/services/weekly.service";
import {
  Category,
  Priority,
  WeekDay,
} from "@/features/weekly/types/weekly.types";
import { cn } from "@/lib/utils";

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

const CATEGORIES: Category[] = [
  "Study",
  "Fitness",
  "Nutrition",
  "Personal",
  "Career",
  "Other",
];

const DURATIONS: { value: number; label: string }[] = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
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
  icon: Icon,
  value,
  onChange,
  children,
  className,
}: {
  icon: React.ElementType;
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-10 rounded-xl border border-white/10 bg-white/[0.05] px-3 transition-colors focus-within:border-violet-500/50",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-white/30 shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-white/80 text-xs outline-none cursor-pointer"
      >
        {children}
      </select>
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
  onClose: () => void;
}

export function AddTaskModal({
  weekStart,
  defaultDay,
  onClose,
}: AddTaskModalProps) {
  // ── form state ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [day, setDay] = useState<WeekDay>(defaultDay ?? "MON");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [category, setCategory] = useState<Category>("Other");
  const [duration, setDuration] = useState<number>(60);
  const [error, setError] = useState<string | null>(null);

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

  const [createTask, { isLoading }] = useCreateWeeklyTaskMutation();

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setError(null);

    try {
      await createTask({
        weekStart,
        title: title.trim(),
        day,
        priority,
        category,
        duration,
      }).unwrap();

      onClose();
    } catch {
      setError("Couldn't save this task. Please try again.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModelPanel>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                Add Weekly Task
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Plan a task for your week.
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
        <div className="p-5 space-y-4">
          {/* Title input — bound to `title` state (was unbound before) */}
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
                if (e.key === "Enter") handleSave();
              }}
            />
          </FormField>

          {/* Day + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">Day</label>
              <DarkSelect
                icon={CalendarDays}
                value={day}
                onChange={(v) => setDay(v as WeekDay)}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </DarkSelect>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">
                Priority
              </label>
              <DarkSelect
                icon={Flag}
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">
                Category
              </label>
              <DarkSelect
                icon={FolderKanban}
                value={category}
                onChange={(v) => setCategory(v as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </DarkSelect>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">
                Duration
              </label>
              <DarkSelect
                icon={Clock3}
                value={duration}
                onChange={(v) => setDuration(Number(v))}
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </DarkSelect>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
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
              Save Task
            </Button>
          </div>
        </div>
      </ModelPanel>
    </Backdrop>
  );
}
