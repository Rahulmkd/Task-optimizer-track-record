"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getWeekRangeLabel } from "../utils/weekly-schedule.utils";

interface ScheduleHeaderProps {
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddTask: () => void;
  onOpenAI?: () => void;
}

export function ScheduleHeader({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onAddTask,
  onOpenAI,
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
            <h2 className="text-white text-sm font-bold leading-none">
              Weekly Schedule
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Organise your entire week in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
          {onOpenAI && (
            <Button
              type="button"
              size="sm"
              onClick={onOpenAI}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.25)] flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate with AI</span>
            </Button>
          )}

          <Button
            variant="gradient"
            size="sm"
            onClick={onAddTask}
            className="cursor-pointer shadow-[0_3px_12px_rgba(109,40,217,0.22)] hover:shadow-[0_4px_16px_rgba(109,40,217,0.4)] transition-all text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={onPrevWeek}
          aria-label="Previous week"
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="text-white text-xs font-semibold">
          {getWeekRangeLabel(weekStart)}
        </span>

        <button
          onClick={onNextWeek}
          aria-label="Next week"
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
