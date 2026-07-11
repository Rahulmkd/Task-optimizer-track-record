"use client";

/* -------------------------------------------------------------------------- */
/*                           ANALYTICS CHART                                  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGetJournalsQuery } from "@/features/ai/services/ai.service";
import { IJournalSummary } from "@/features/ai/types/ai.types";
import { EmptyState } from "@/components/shared/EmptyState";

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 75) return "#34d399"; // emerald
  if (score >= 50) return "#a78bfa"; // violet
  return "#f87171"; // red
}

/* -------------------------------------------------------------------------- */
/*                         PRODUCTIVITY TREND CHART                           */
/* -------------------------------------------------------------------------- */

function ProductivityLineChart({ journals }: { journals: IJournalSummary[] }) {
  const W = 560;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 40 };

  const data = [...journals].reverse(); // oldest → newest left to right

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxScore = 100;
  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const toX = (i: number) =>
    PAD.left + (data.length > 1 ? i * xStep : innerW / 2);
  const toY = (v: number) => PAD.top + innerH - (v / maxScore) * innerH;

  const points = data.map((d, i) => ({
    x: toX(i),
    y: toY(d.productivityScore),
    d,
  }));

  // SVG path for the line
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // SVG path for the filled area under the line
  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${points[0].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`
    : "";

  // Trend indicator
  const latest = data[data.length - 1]?.productivityScore ?? 0;
  const prev = data[data.length - 2]?.productivityScore ?? latest;
  const delta = latest - prev;
  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor =
    delta > 0
      ? "text-emerald-400"
      : delta < 0
        ? "text-red-400"
        : "text-white/40";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold leading-none">
              Productivity Score
            </h3>
            <p className="text-white/40 text-xs mt-1">
              Daily score over time (0–100)
            </p>
          </div>
        </div>

        {data.length >= 2 && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {delta > 0 ? "+" : ""}
            {delta} pts
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: Math.max(W, data.length * 60) }}
          aria-label="Productivity score trend chart"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => {
            const y = toY(v);
            return (
              <g key={v}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaPath && (
            <motion.path
              d={areaPath}
              fill="url(#areaGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Line */}
          {linePath && (
            <motion.path
              d={linePath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Data points + labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill={scoreColor(p.d.productivityScore)}
                stroke="#0a0a0f"
                strokeWidth="2"
              />
              {/* X-axis date label */}
              <text
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="9"
              >
                {formatDate(p.d.createdAt)}
              </text>
              {/* Score tooltip above point */}
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fill={scoreColor(p.d.productivityScore)}
                fontSize="9"
                fontWeight="600"
              >
                {p.d.productivityScore}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         TASKS COMPLETION BAR CHART                         */
/* -------------------------------------------------------------------------- */

function TasksBarChart({ journals }: { journals: IJournalSummary[] }) {
  const data = [...journals].reverse().slice(-10); // last 10, oldest → newest

  const maxTasks = Math.max(
    ...data.map((d) => d.completedTasks + d.pendingTasks),
    1,
  );

  const BAR_W = 24;
  const GAP = 20;
  const H = 140;
  const PAD = { top: 16, bottom: 32, left: 32 };
  const innerH = H - PAD.top - PAD.bottom;
  const W = PAD.left + data.length * (BAR_W * 2 + GAP) + 16;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold leading-none">
              Tasks Breakdown
            </h3>
            <p className="text-white/40 text-xs mt-1">
              Completed vs pending per day
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            Pending
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: Math.max(W, 320) }}
          aria-label="Tasks completion bar chart"
        >
          {/* Grid lines */}
          {[0, 0.5, 1].map((frac) => {
            const y = PAD.top + innerH * (1 - frac);
            const label = Math.round(maxTasks * frac);
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 4}
                  y={y + 4}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="9"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => {
            const groupX = PAD.left + i * (BAR_W * 2 + GAP) + 8;
            const completedH = (d.completedTasks / maxTasks) * innerH;
            const pendingH = (d.pendingTasks / maxTasks) * innerH;
            const baseY = PAD.top + innerH;

            return (
              <g key={d.id}>
                {/* Completed bar */}
                <motion.rect
                  x={groupX}
                  y={baseY - completedH}
                  width={BAR_W}
                  height={completedH}
                  rx="4"
                  fill="#34d399"
                  fillOpacity="0.85"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${groupX}px ${baseY}px` }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                />
                {/* Pending bar */}
                <motion.rect
                  x={groupX + BAR_W + 4}
                  y={baseY - pendingH}
                  width={BAR_W}
                  height={pendingH}
                  rx="4"
                  fill="rgba(255,255,255,0.15)"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{
                    transformOrigin: `${groupX + BAR_W + 4}px ${baseY}px`,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.06 + 0.05 }}
                />
                {/* Date label */}
                <text
                  x={groupX + BAR_W}
                  y={baseY + 16}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9"
                >
                  {formatDate(d.createdAt)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            SUMMARY STATS ROW                               */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SKELETON LOADER                               */
/* -------------------------------------------------------------------------- */

function ChartSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
      <div className="h-52 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
      <div className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ROOT EXPORT                                  */
/* -------------------------------------------------------------------------- */

export function Chart() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-center text-red-400 text-sm">
        Couldn&apos;t load analytics data. Please try again.
      </div>
    );
  }

  if (!journals?.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics yet"
        description="Generate your first AI journal from the Dashboard to start seeing charts."
      />
    );
  }

  // Aggregate stats across all journals
  const avgScore = Math.round(
    journals.reduce((s, j) => s + j.productivityScore, 0) / journals.length,
  );
  const totalCompleted = journals.reduce((s, j) => s + j.completedTasks, 0);
  const totalPending = journals.reduce((s, j) => s + j.pendingTasks, 0);
  const bestScore = Math.max(...journals.map((j) => j.productivityScore));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-5"
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Avg Score"
          value={avgScore}
          sub="across all journals"
          color={
            avgScore >= 75
              ? "text-emerald-400"
              : avgScore >= 50
                ? "text-violet-400"
                : "text-red-400"
          }
        />
        <StatCard
          label="Best Score"
          value={bestScore}
          sub="personal best"
          color="text-violet-400"
        />
        <StatCard
          label="Tasks Done"
          value={totalCompleted}
          sub="total completed"
          color="text-emerald-400"
        />
        <StatCard
          label="Journals"
          value={journals.length}
          sub={`${totalPending} tasks pending`}
          color="text-blue-400"
        />
      </div>

      {/* Charts */}
      <ProductivityLineChart journals={journals} />
      <TasksBarChart journals={journals} />
    </motion.div>
  );
}
