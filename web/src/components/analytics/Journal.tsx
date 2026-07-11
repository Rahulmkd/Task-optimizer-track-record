"use client";

/* -------------------------------------------------------------------------- */
/*  JOURNAL HISTORY                                                           */
/*                                                                            */
/*  Fetches all journal entries from GET /api/v1/ai/journals via RTK Query    */
/*  and renders them as cards aligned with the existing dark dashboard theme. */
/* -------------------------------------------------------------------------- */

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useGetJournalsQuery } from "@/features/ai/services/ai.service";
import { IJournalSummary } from "@/features/ai/types/ai.types";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                     */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs work";
}

/* -------------------------------------------------------------------------- */
/*                         SCORE RING (small inline)                          */
/* -------------------------------------------------------------------------- */

function MiniScoreRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 75 ? "#34d399" : score >= 50 ? "#a78bfa" : "#f87171";

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      <svg
        className="-rotate-90"
        viewBox="0 0 44 44"
        width={44}
        height={44}
        aria-hidden
      >
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="4"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-[10px] font-black" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              JOURNAL CARD                                  */
/* -------------------------------------------------------------------------- */

function JournalCard({
  journal,
  index,
}: {
  journal: IJournalSummary;
  index: number;
}) {
  const score = journal.productivityScore;
  const scoreColor =
    score >= 75
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 50
        ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
        : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-colors duration-200"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none truncate">
              {formatDate(journal.createdAt)}
            </p>
            <p className="text-white/40 text-xs mt-1">
              Generated at {formatTime(journal.createdAt)}
            </p>
          </div>
        </div>

        {/* Score badge */}
        <span
          className={cn(
            "shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border",
            scoreColor,
          )}
        >
          {scoreLabel(score)}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5 space-y-4">
        {/* Score + task counts */}
        <div className="flex items-center gap-4">
          <MiniScoreRing score={score} />
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-semibold">{journal.completedTasks}</span>
              <span className="text-white/40 font-normal">done</span>
            </span>
            <span className="flex items-center gap-1.5 text-white/40">
              <Circle className="h-3.5 w-3.5" />
              <span className="font-semibold text-white/60">
                {journal.pendingTasks}
              </span>
              <span className="font-normal">pending</span>
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-white/70 text-sm leading-relaxed">
          {journal.summary}
        </p>

        {/* Suggestion (only on freshly generated entries) */}
        <AnimatePresence>
          {journal.suggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2.5 p-3 rounded-xl bg-violet-500/[0.07] border border-violet-500/15"
            >
              <Lightbulb className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-white/60 text-xs leading-relaxed">
                {journal.suggestion}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           SKELETON LOADER                                  */
/* -------------------------------------------------------------------------- */

function JournalSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-48 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT EXPORT                                   */
/* -------------------------------------------------------------------------- */

export function Journal() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white text-sm font-semibold leading-none">
              Journal History
            </h2>
            <p className="text-white/40 text-xs mt-1">
              {isLoading
                ? "Loading…"
                : journals?.length
                  ? `${journals.length} entr${journals.length === 1 ? "y" : "ies"} · newest first`
                  : "No entries yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading && <JournalSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-center text-red-400 text-sm">
          Couldn&apos;t load journals. Please try again.
        </div>
      )}

      {!isLoading && !isError && (!journals || journals.length === 0) && (
        <EmptyState
          icon={BookOpen}
          title="No journal entries yet"
          description="Generate your first AI summary from the Dashboard to see entries here."
        />
      )}

      {!isLoading && !isError && journals && journals.length > 0 && (
        <div className="space-y-4">
          {journals.map((journal, i) => (
            <JournalCard key={journal.id} journal={journal} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
