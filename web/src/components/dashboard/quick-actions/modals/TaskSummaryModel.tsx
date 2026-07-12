"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import { Backdrop } from "./Backdrop";
import { ModelPanel } from "./ModelPanel";
import { Button } from "@/components/ui/button";
import { useGenerateJournalMutation } from "@/features/ai/services/ai.service";
import { IJournalSummary } from "@/features/ai/types/ai.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/constants";

/* -------------------------------------------------------------------------- */
/*                         PRODUCTIVITY SCORE RING                            */
/* -------------------------------------------------------------------------- */

function ScoreRing({ score }: { score: number }) {
  const radius       = 28;
  const circumference = 2 * Math.PI * radius;
  const filled        = (score / 100) * circumference;
  const color         =
    score >= 75 ? "#34d399" : score >= 50 ? "#a78bfa" : "#f87171";

  return (
    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
      <svg className="-rotate-90" viewBox="0 0 72 72" width={72} height={72} aria-hidden>
        <circle cx="36" cy="36" r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <motion.circle cx="36" cy="36" r={radius}
          fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }} />
      </svg>
      <span className="absolute text-lg font-black" style={{ color }}
        aria-label={`Productivity score: ${score}`}>
        {score}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               RESULT VIEW                                  */
/* -------------------------------------------------------------------------- */

function JournalResult({ data }: { data: IJournalSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="space-y-3"
    >
      {/* score + counts */}
      <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        <ScoreRing score={data.productivityScore} />
        <div className="space-y-1.5">
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">
            Productivity Score
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span className="font-semibold">{data.completedTasks}</span>
              <span className="text-white/35 font-normal">done</span>
            </span>
            <span className="flex items-center gap-1 text-white/35">
              <Circle className="h-3 w-3" />
              <span className="font-semibold text-white/55">{data.pendingTasks}</span>
              <span className="font-normal">pending</span>
            </span>
          </div>
        </div>
      </div>

      {/* summary */}
      <div className="space-y-1">
        <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest">
          Summary
        </p>
        <p className="text-white/75 text-xs leading-relaxed">{data.summary}</p>
      </div>

      {/* suggestion */}
      {data.suggestion && (
        <div className="flex gap-2.5 p-3 rounded-xl bg-violet-500/[0.08] border border-violet-500/20">
          <Lightbulb className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-violet-300 text-[10px] font-semibold mb-1">
              Tomorrow&apos;s tip
            </p>
            <p className="text-white/55 text-xs leading-relaxed">
              {data.suggestion}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  MODAL                                     */
/* -------------------------------------------------------------------------- */

export function TaskSummaryModel({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [generateJournal, { data, isLoading, isError, error, reset }] =
    useGenerateJournalMutation();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset mutation state on unmount so stale data doesn't flash on next open
  useEffect(() => () => { reset(); }, [reset]);

  const errorMessage = isError
    ? ((error as { data?: { message?: string } })?.data?.message ??
      "Couldn't generate the summary. Please try again.")
    : null;

  const handleGenerate = () => generateJournal();

  const handleClose = () => {
    reset();
    onClose();
  };


  const handleSave = () => {
    reset();
    onClose();
    router.push(ROUTES.ANALYTICS);
  };

  return (
    <Backdrop onClick={handleClose}>
      <ModelPanel>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                AI Daily Summary
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Powered by your today&apos;s tasks
              </p>
            </div>
          </div>

          <button aria-label="Close modal" onClick={handleClose}
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
            <X className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>

        {/* body */}
        <div className="p-5 space-y-4">
          <AnimatePresence mode="wait">
            {/* idle / loading */}
            {!data && !isError && (
              <motion.div key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={cn(
                  "rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 text-center",
                  isLoading && "animate-pulse",
                )}>
                <Sparkles className={cn("h-8 w-8 mx-auto mb-3",
                  isLoading ? "text-violet-400" : "text-white/20")} />
                <p className="text-white/40 text-sm">
                  {isLoading
                    ? "Analysing your tasks…"
                    : "Click Generate to analyse your day with AI."}
                </p>
              </motion.div>
            )}

            {/* error */}
            {isError && (
              <motion.div key="error"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{errorMessage}</p>
              </motion.div>
            )}

            {/* result */}
            {data && !isError && <JournalResult key="result" data={data} />}
          </AnimatePresence>

          {/* footer buttons */}
          <div className="flex gap-3 pt-1">
            {/* ── When summary is received: Close + Save + Regenerate ── */}
            {data ? (
              <>
                <Button variant="outline" className="flex-1 h-11"
                  onClick={handleClose} disabled={isLoading}>
                  Close
                </Button>

                {/* Save navigates to Journal history so the user can review
                    the persisted entry. The journal is already saved in the DB
                    at generation time — this is just navigation shortcut. */}
                <Button variant="gradient" className="flex-1 h-11"
                  onClick={handleSave} disabled={isLoading}>
                  <BookOpen className="h-3.5 w-3.5" />
                  Save to Journal
                </Button>
              </>
            ) : (
              /* ── Before generation: Close + Generate ── */
              <>
                <Button variant="outline" className="flex-1 h-11"
                  onClick={handleClose} disabled={isLoading}>
                  Close
                </Button>
                <Button variant="gradient" className="flex-1 h-11"
                  onClick={handleGenerate} loading={isLoading} disabled={isLoading}>
                  Generate Summary
                </Button>
              </>
            )}
          </div>

          {/* Regenerate link — shown below Save so it's accessible but secondary */}
          {data && !isLoading && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={handleGenerate}
              className="w-full text-center text-white/30 hover:text-white/60 text-xs transition-colors">
              Regenerate
            </motion.button>
          )}
        </div>
      </ModelPanel>
    </Backdrop>
  );
}
