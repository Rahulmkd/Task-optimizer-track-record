"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clock,
  Moon,
  Sparkles,
  Sun,
  Sunset,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeInput } from "@/components/ui/TimeInput";
import { IWeeklyTask, WeekDay } from "@/features/schedule/types/weekly.types";
import {
  calculateEndTime,
  checkTasksOverlap,
  DEFAULT_START_TIME,
  formatTimeDisplay,
  getDurationLabel,
  parseTimeToMinutes,
  TIME_SLOTS,
  TimeSlotOption,
} from "../utils/next-week-schedule.utils";

type PeriodFilter = "ALL" | "MORNING" | "AFTERNOON" | "EVENING";

interface ModernTimeSelectProps {
  id?: string;
  value: string; // e.g. "09:00 AM"
  onChange: (value: string) => void;
  day?: WeekDay;
  existingTasks?: IWeeklyTask[];
  taskDuration?: number;
  currentTaskId?: string;
  className?: string;
}

export function ModernTimeSelect({
  id,
  value,
  onChange,
  day,
  existingTasks = [],
  taskDuration = 60,
  currentTaskId,
  className,
}: ModernTimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<PeriodFilter>("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const selectedDisplay = formatTimeDisplay(value || DEFAULT_START_TIME);
  const selectedMinutes = parseTimeToMinutes(selectedDisplay);
  const endTimeDisplay = calculateEndTime(selectedDisplay, taskDuration);
  const durationLabel = getDurationLabel(taskDuration);

  // Derive time period for selected value
  const selectedPeriod = useMemo(() => {
    if (selectedMinutes < 720) return "Morning";
    if (selectedMinutes < 1020) return "Afternoon";
    return "Evening";
  }, [selectedMinutes]);

  // Click outside to collapse
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Auto-scroll to selected slot when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, filter]);

  // Filter slots based on selected period tab
  const filteredSlots = useMemo(() => {
    if (filter === "ALL") return TIME_SLOTS;
    if (filter === "MORNING") {
      return TIME_SLOTS.filter((s) => s.minutes < 720); // 6:00 AM - 11:30 AM
    }
    if (filter === "AFTERNOON") {
      return TIME_SLOTS.filter(
        (s) => s.minutes >= 720 && s.minutes < 1020,
      ); // 12:00 PM - 4:30 PM
    }
    return TIME_SLOTS.filter((s) => s.minutes >= 1020); // 5:00 PM - 11:30 PM
  }, [filter]);

  // Check if a slot conflicts with an existing task on the current day
  const isSlotConflicting = (slot: TimeSlotOption) => {
    if (!day || existingTasks.length === 0) return false;
    const candidate = {
      startTime: slot.value,
      duration: taskDuration,
    };
    return existingTasks.some((t) => {
      if (currentTaskId && t.id === currentTaskId) return false;
      if (t.day !== day) return false;
      return checkTasksOverlap(candidate, t);
    });
  };

  const handleSelect = (slotValue: string) => {
    onChange(slotValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("w-full space-y-1.5", className)}>
      {/* ── Main Trigger Button ────────────────────────────────────────── */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between h-10 px-3 rounded-xl border transition-all duration-200 outline-none text-left cursor-pointer",
          isOpen
            ? "border-violet-500/70 bg-violet-500/[0.08] shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/40"
            : "border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Clock className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide truncate">
            {selectedDisplay}
          </span>
          <span className="text-[10px] font-medium text-violet-300/80 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-md hidden sm:inline-block">
            {selectedPeriod}
          </span>
          <span className="text-[10px] text-white/40 truncate hidden sm:inline-block">
            ({durationLabel} · ends {endTimeDisplay})
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-white/40 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-violet-400",
          )}
        />
      </button>

      {/* ── Inline Expandable Time Picker (Matching UI, No layout overlap) ────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl p-3 flex flex-col gap-3">
              {/* Custom Time Input matching the application UI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/70 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-violet-400" /> Custom Time
                  </span>
                  <span className="text-[10px] text-violet-300/80 font-medium">
                    Ends at {endTimeDisplay}
                  </span>
                </div>
                <TimeInput
                  value={value || DEFAULT_START_TIME}
                  onChange={(newTime) => onChange(newTime)}
                  format="12h"
                  size="sm"
                  className="w-full justify-between"
                />
              </div>

              {/* Preset Slots Divider & Filter Tabs */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-violet-400" /> Quick 30m Presets
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {filteredSlots.length} slots
                  </span>
                </div>

                {/* Period Filter Tabs */}
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setFilter("ALL")}
                    className={cn(
                      "py-1 text-[10px] font-medium rounded-md transition-all cursor-pointer text-center",
                      filter === "ALL"
                        ? "bg-violet-600/35 text-violet-200 font-semibold border border-violet-500/40"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("MORNING")}
                    className={cn(
                      "py-1 text-[10px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1",
                      filter === "MORNING"
                        ? "bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    <Sun className="h-2.5 w-2.5 text-amber-400" /> Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("AFTERNOON")}
                    className={cn(
                      "py-1 text-[10px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1",
                      filter === "AFTERNOON"
                        ? "bg-orange-500/20 text-orange-200 font-semibold border border-orange-500/40"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    <Sunset className="h-2.5 w-2.5 text-orange-400" /> Afternoon
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("EVENING")}
                    className={cn(
                      "py-1 text-[10px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1",
                      filter === "EVENING"
                        ? "bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/40"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    <Moon className="h-2.5 w-2.5 text-indigo-400" /> Evening
                  </button>
                </div>

                {/* Time Slots List */}
                <div
                  ref={scrollContainerRef}
                  role="listbox"
                  aria-label="Time slots"
                  className="max-h-40 overflow-y-auto space-y-1 pr-1 overscroll-contain select-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
                >
                  {filteredSlots.map((slot) => {
                    const isSelected =
                      parseTimeToMinutes(slot.value) === selectedMinutes;
                    const isDefault = slot.value === DEFAULT_START_TIME;
                    const hasConflict = isSlotConflicting(slot);

                    return (
                      <button
                        key={slot.value}
                        ref={isSelected ? selectedItemRef : null}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(slot.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left border",
                          isSelected
                            ? "bg-gradient-to-r from-violet-600/35 to-indigo-600/35 border-violet-500/50 text-white font-semibold shadow-inner"
                            : "border-transparent text-white/75 hover:bg-white/[0.07] hover:text-white hover:border-white/10",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{slot.label}</span>

                          {/* Default badge */}
                          {isDefault && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              Default
                            </span>
                          )}

                          {/* Conflict alert indicator */}
                          {hasConflict && !isSelected && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              title="Overlaps with another task on this day"
                            >
                              <AlertTriangle className="h-2 w-2 text-amber-400" /> Busy
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-violet-500/30 border border-violet-400/50 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 text-violet-300" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
