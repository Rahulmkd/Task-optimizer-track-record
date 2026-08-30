"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { useGetJournalsQuery } from "@/features/story/services/ai.service";
import { EmptyState } from "@/components/shared/EmptyState";

import {
  calculateCompletionRate,
  getProgressScoreColor,
} from "../utils/progress.utils";

import { ProgressHeader } from "./ProgressHeader";
import { ProgressStats } from "./ProgressStats";
import { ProductivityTrendChart } from "./ProductivityTrendChart";
import { LatestPerformanceCard } from "./LatestPerformanceCard";
import { TaskPerformanceChart } from "./TaskPerformanceChart";
import { ProgressOverview } from "./ProgressOverview";
import { ProgressSkeleton } from "./ProgressSkeleton";
import { ProgressError } from "./ProgressError";

/**
 * Root component: fetches the journals and wires every small piece
 * (header, stat cards, charts, overview) together. This is the
 * drop-in replacement for the old monolithic <Chart /> component.
 */
export function Progress() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();

  if (isLoading) {
    return <ProgressSkeleton />;
  }

  if (isError) {
    return <ProgressError />;
  }

  if (!journals?.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics yet"
        description="Generate your first AI journal from the Dashboard to start tracking your productivity."
      />
    );
  }

  /* ------------------------------------------------------------------ */
  /*                              CALCULATIONS                                */
  /* ------------------------------------------------------------------ */

  const latestScore = journals[0]?.productivityScore ?? 0;

  const averageScore = Math.round(
    journals.reduce((sum, journal) => sum + journal.productivityScore, 0) /
      journals.length,
  );

  const bestScore = Math.max(
    ...journals.map((journal) => journal.productivityScore),
  );

  const totalCompleted = journals.reduce(
    (sum, journal) => sum + journal.completedTasks,
    0,
  );

  const totalPending = journals.reduce(
    (sum, journal) => sum + journal.pendingTasks,
    0,
  );

  const totalTasks = totalCompleted + totalPending;

  const completionRate = calculateCompletionRate(totalCompleted, totalPending);

  const previousScore =
    journals.length > 1
      ? (journals[1]?.productivityScore ?? latestScore)
      : latestScore;

  const scoreTrend = latestScore - previousScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <ProgressHeader journalCount={journals.length} />

      {/* ------------------------------------------------------------------ */}
      {/* STAT CARDS                                                         */}
      {/* ------------------------------------------------------------------ */}

      <ProgressStats
        latestScore={latestScore}
        averageScore={averageScore}
        bestScore={bestScore}
        completionRate={completionRate}
        totalCompleted={totalCompleted}
        totalTasks={totalTasks}
        getScoreColor={getProgressScoreColor}
      />

      {/* ------------------------------------------------------------------ */}
      {/* PRODUCTIVITY TREND + LATEST PERFORMANCE                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <ProductivityTrendChart journals={journals} />

        <LatestPerformanceCard
          latestScore={latestScore}
          scoreTrend={scoreTrend}
          completedTasks={journals[0]?.completedTasks ?? 0}
          pendingTasks={journals[0]?.pendingTasks ?? 0}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TASK PERFORMANCE + OVERVIEW                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-5 lg:grid-cols-2">
        <TaskPerformanceChart journals={journals} />

        <ProgressOverview journals={journals} />
      </div>
    </motion.div>
  );
}
