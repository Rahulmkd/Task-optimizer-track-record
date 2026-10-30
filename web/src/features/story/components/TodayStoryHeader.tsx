"use client";

import { Sparkles, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodayStoryHeaderProps {
  isLoading: boolean;
  entryCount: number;
  onGenerateClick?: () => void;
}

export function TodayStoryHeader({
  isLoading,
  entryCount,
  onGenerateClick,
}: TodayStoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/25 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Decorative ambient blur */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <ScrollText className="h-5 w-5" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daily AI Journal &amp; Retrospectives
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-white/50 max-w-xl">
          Automated daily retrospectives with intelligent task analysis, productivity scoring (0–100), and actionable execution strategies.
        </p>

        {!isLoading && (
          <div className="pt-1.5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white font-medium">
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span>
                {entryCount > 0
                  ? `${entryCount} recorded stor${entryCount === 1 ? "y" : "ies"}`
                  : "No recorded stories"}
              </span>
            </span>
          </div>
        )}
      </div>

      {onGenerateClick && (
        <div className="relative z-10 shrink-0">
          <Button
            variant="gradient"
            size="lg"
            onClick={onGenerateClick}
            className="shadow-lg shadow-violet-950/40"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Today&apos;s Story</span>
          </Button>
        </div>
      )}
    </div>
  );
}
