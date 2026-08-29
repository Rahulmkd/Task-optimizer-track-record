"use client";

import { Activity, CheckCircle2, Flame, TrendingUp } from "lucide-react";

import { ProgressStatCard } from "./ProgressStatCard";

interface ProgressStatsProps {
  latestScore: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
  totalCompleted: number;
  totalTasks: number;
  getScoreColor: (score: number) => string;
}

export function ProgressStats({
  latestScore,
  averageScore,
  bestScore,
  completionRate,
  totalCompleted,
  totalTasks,
  getScoreColor,
}: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <ProgressStatCard
        icon={Activity}
        label="Today"
        value={latestScore}
        description="Latest productivity score"
        iconClassName="text-violet-400 bg-violet-400/10"
        valueClassName={getScoreColor(latestScore)}
      />

      <ProgressStatCard
        icon={TrendingUp}
        label="Average"
        value={averageScore}
        description="Across all journal entries"
        iconClassName="text-blue-400 bg-blue-400/10"
        valueClassName={getScoreColor(averageScore)}
      />

      <ProgressStatCard
        icon={Flame}
        label="Best"
        value={bestScore}
        description="Your personal best"
        iconClassName="text-amber-400 bg-amber-400/10"
        valueClassName="text-amber-400"
      />

      <ProgressStatCard
        icon={CheckCircle2}
        label="Completion"
        value={`${completionRate}%`}
        description={`${totalCompleted} of ${totalTasks} tasks`}
        iconClassName="text-emerald-400 bg-emerald-400/10"
        valueClassName="text-emerald-400"
      />
    </div>
  );
}
