"use client";

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

function scoreRingColor(score: number) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#a78bfa";
  return "#f87171";
}

/* -------------------------------------------------------------------------- */
/*                         MINI SCORE RING                                    */
/* -------------------------------------------------------------------------- */

function MiniScoreRing({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = scoreRingColor(score);

  return (
    <div className="relative h-9 w-9 flex items-center justify-center shrink-0">
      <svg
        className="-rotate-90"
        viewBox="0 0 34 34"
        width={34}
        height={34}
        aria-hidden
      >
        <circle
          cx="17"
          cy="17"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
        />
        <motion.circle
          cx="17"
          cy="17"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-[9px] font-black" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            JOURNAL CARD                                    */
/* -------------------------------------------------------------------------- */

function JournalCard({
  journal,
  index,
}: {
  journal: IJournalSummary;
  index: number;
}) {
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
              {formatDate(journal.createdAt)}
            </p>
            <p className="text-white/35 text-[10px] mt-0.5">
              {formatTime(journal.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border",
            badgeClass,
          )}
        >
          {scoreLabel(score)}
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

/* -------------------------------------------------------------------------- */
/*                           SKELETON                                         */
/* -------------------------------------------------------------------------- */

function JournalSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
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
    <section className="space-y-3">
      {/* section header */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-white text-sm font-semibold leading-none">
            Journal History
          </h2>
          <p className="text-white/35 text-[10px] mt-0.5">
            {isLoading
              ? "Loading…"
              : journals?.length
                ? `${journals.length} entr${journals.length === 1 ? "y" : "ies"} · newest first`
                : "No entries yet"}
          </p>
        </div>
      </div>

      {/* states */}
      {isLoading && <JournalSkeleton />}

      {isError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-center text-red-400 text-xs">
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

      {/* card grid — 2 columns on md+ to keep cards compact */}
      {!isLoading && !isError && journals && journals.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {journals.map((journal, i) => (
            <JournalCard key={journal.id} journal={journal} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
