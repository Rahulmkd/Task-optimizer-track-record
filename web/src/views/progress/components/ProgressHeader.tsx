"use client";

import { Activity, CalendarDays, ChevronDown } from "lucide-react";

interface ProgressHeaderProps {
  journalCount: number;
}

export function ProgressHeader({ journalCount }: ProgressHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* ------------------------------------------------------------------ */}
      {/* TITLE + DESCRIPTION                                                */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10">
            <Activity className="h-4 w-4 text-violet-400" />
          </div>

          {/* Title */}
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Your Progress
          </h1>
        </div>

        {/* Description */}
        <p className="mt-2 max-w-xl text-xs leading-5 text-white/35 sm:text-sm">
          Understand your daily consistency, task completion, and productivity
          progress.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DATE RANGE                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2">
        {/* Calendar Icon */}
        <CalendarDays className="h-3.5 w-3.5 text-white/30" />

        {/* Number of days */}
        <span className="text-[10px] font-medium text-white/45">
          Last {journalCount} days
        </span>

        {/* Dropdown Icon */}
        <ChevronDown className="h-3 w-3 text-white/20" />
      </div>
    </div>
  );
}
