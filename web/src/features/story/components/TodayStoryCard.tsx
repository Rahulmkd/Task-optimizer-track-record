"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniScoreRing } from "./MiniScoreRing";
import { IJournalSummary } from "../types/ai.types";
import { formatStoryDate, formatStoryTime, getStoryScoreLabel } from "../utils/today-story.utils";

interface TodayStoryCardProps {
  journal: IJournalSummary;
  index: number;
}

export function TodayStoryCard({ journal, index }: TodayStoryCardProps) {
  const score = journal.productivityScore;

  const badgeClass =
    score >= 75
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
      : score >= 50
        ? "text-violet-400 bg-violet-500/10 border-violet-500/25"
        : "text-red-400 bg-red-500/10 border-red-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-200 shadow-lg flex flex-col justify-between"
    >
      <div>
        {/* ── card header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.01]">
          <div className="flex items-center gap-3 min-w-0">
            <MiniScoreRing score={score} />
            <div className="min-w-0">
              <p className="text-white text-xs sm:text-sm font-bold leading-tight truncate">
                {formatStoryDate(journal.createdAt)}
              </p>
              <p className="text-white/45 text-[11px] mt-0.5">
                {formatStoryTime(journal.createdAt)} (IST)
              </p>
            </div>
          </div>

          <span
            className={cn(
              "shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border",
              badgeClass,
            )}
          >
            {getStoryScoreLabel(score)}
          </span>
        </div>

        {/* ── card body ───────────────────────────────────────────────── */}
        <div className="p-5 space-y-3.5">
          {/* task counts */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{journal.completedTasks} completed</span>
            </span>

            <span className="flex items-center gap-1.5 text-white/50 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-lg">
              <Circle className="h-3.5 w-3.5 text-white/30" />
              <span>{journal.pendingTasks} pending</span>
            </span>
          </div>

          {/* summary text */}
          <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
            {journal.summary}
          </p>

          {/* suggestion */}
          <AnimatePresence>
            {journal.suggestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2.5 p-3 rounded-xl bg-violet-500/[0.08] border border-violet-500/20"
              >
                <Lightbulb className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-violet-200/90 text-xs leading-relaxed">
                  {journal.suggestion}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-[11px] text-white/40">
        <span>Verified AI Evaluation</span>
        <span>Productivity: {score}/100</span>
      </div>
    </motion.div>
  );
}
