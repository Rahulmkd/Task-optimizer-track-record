"use client";

import { Activity, CalendarDays } from "lucide-react";

interface ProgressHeaderProps {
  journalCount: number;
}

export function ProgressHeader({ journalCount }: ProgressHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/20 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-600/20 text-violet-400">
            <Activity className="h-5 w-5" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Performance &amp; Productivity Analytics
          </h1>
        </div>

        <p className="mt-1.5 text-xs sm:text-sm text-white/50 max-w-xl">
          Track execution consistency, mathematical score trends, and task completion metrics over time.
        </p>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/70 self-start sm:self-auto">
        <CalendarDays className="h-4 w-4 text-violet-400" />
        <span>Last {journalCount} logged sessions</span>
      </div>
    </div>
  );
}
