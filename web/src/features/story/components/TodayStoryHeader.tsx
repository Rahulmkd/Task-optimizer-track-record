"use client";

import { Sparkles } from "lucide-react";

interface TodayStoryHeaderProps {
  isLoading: boolean;
  entryCount: number;
}

export function TodayStoryHeader({
  isLoading,
  entryCount,
}: TodayStoryHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
      </div>
      <div>
        <h2 className="text-white text-sm font-semibold leading-none">
          Today&apos;s Story
        </h2>
        <p className="text-white/35 text-[10px] mt-0.5">
          {isLoading
            ? "Loading…"
            : entryCount > 0
              ? `${entryCount} entr${entryCount === 1 ? "y" : "ies"} · newest first`
              : "No entries yet"}
        </p>
      </div>
    </div>
  );
}
