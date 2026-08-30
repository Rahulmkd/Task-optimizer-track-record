"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getWeekRangeLabel } from "../next-week-schedule.utils";

interface ScheduleHeaderProps {
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddTask: () => void;
}

export function ScheduleHeader({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onAddTask,
}: ScheduleHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
            <CalendarDays className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h1 className="text-white text-sm font-bold leading-none">
              Next Week Schedule
            </h1>
            <p className="text-white/40 text-xs mt-1">
              Organise your entire week in one place.
            </p>
          </div>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={onAddTask}
          className="shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={onPrevWeek}
          aria-label="Previous week"
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <h2 className="text-white text-xs font-semibold">
          {getWeekRangeLabel(weekStart)}
        </h2>

        <button
          onClick={onNextWeek}
          aria-label="Next week"
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
