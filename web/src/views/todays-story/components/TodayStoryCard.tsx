"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";

import { IJournalSummary } from "@/features/ai/types/ai.types";
import { cn } from "@/lib/utils";

import {
  formatStoryDate,
  formatStoryTime,
  getStoryScoreLabel,
} from "../today-story.utils";

import { MiniScoreRing } from "./MiniScoreRing";

interface TodayStoryCardProps {
  journal: IJournalSummary;
  index: number;
}

export function TodayStoryCard({ journal, index }: TodayStoryCardProps) {
  const score = journal.productivityScore;

  const badgeClass =
    score >= 75
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 50
        ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
        : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden hover:border-white/[0.18] transition-colors duration-200"
    >
      {/* ── card header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* score ring sits in the header — small and readable */}
          <MiniScoreRing score={score} />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold leading-none truncate">
              {formatStoryDate(journal.createdAt)}
            </p>
            <p className="text-white/35 text-[10px] mt-0.5">
              {formatStoryTime(journal.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border",
            badgeClass,
          )}
        >
          {getStoryScoreLabel(score)}
        </span>
      </div>

      {/* ── card body ───────────────────────────────────────────────── */}
      <div className="px-4 py-3 space-y-2.5">
        {/* task counts — inline, compact */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span className="font-semibold">{journal.completedTasks}</span>
            <span className="text-white/35 font-normal">done</span>
          </span>
          <span className="flex items-center gap-1 text-white/35">
            <Circle className="h-3 w-3" />
            <span className="font-semibold text-white/50">
              {journal.pendingTasks}
            </span>
            <span className="font-normal">pending</span>
          </span>
        </div>

        {/* summary text */}
        <p className="text-white/65 text-xs leading-relaxed line-clamp-3">
          {journal.summary}
        </p>

        {/* suggestion — only on freshly generated entries */}
        <AnimatePresence>
          {journal.suggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 p-2.5 rounded-lg bg-violet-500/[0.07] border border-violet-500/15"
            >
              <Lightbulb className="h-3 w-3 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-white/50 text-[11px] leading-relaxed">
                {journal.suggestion}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
