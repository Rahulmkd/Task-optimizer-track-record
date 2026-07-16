"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useGetJournalsQuery } from "@/features/ai/services/ai.service";
import { IJournalSummary } from "@/features/ai/types/ai.types";
import { EmptyState } from "@/components/shared/EmptyState";

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#a78bfa";
  return "#f87171";
}

/* -------------------------------------------------------------------------- */
/*                          STAT CARD — compact                               */
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
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-xl font-black ${color} leading-none`}>{value}</p>
      {sub && <p className="text-white/25 text-[10px] mt-1">{sub}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       PRODUCTIVITY LINE CHART                              */
/* -------------------------------------------------------------------------- */

function ProductivityLineChart({ journals }: { journals: IJournalSummary[] }) {
  // Keep chart canvas compact — viewBox drives the rendered size, not pixel W/H
  const W = 480;
  const H = 120;
  const PAD = { top: 14, right: 12, bottom: 28, left: 28 };

  const data = [...journals].reverse(); // oldest → newest
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const toX = (i: number) =>
    PAD.left +
    (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2);
  const toY = (v: number) => PAD.top + innerH - (v / 100) * innerH;

  const pts = data.map((d, i) => ({
    x: toX(i),
    y: toY(d.productivityScore),
    d,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = pts.length
    ? `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`
    : "";

  const latest = data[data.length - 1]?.productivityScore ?? 0;
  const prev = data[data.length - 2]?.productivityScore ?? latest;
  const delta = latest - prev;
  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor =
    delta > 0
      ? "text-emerald-400"
      : delta < 0
        ? "text-red-400"
        : "text-white/30";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-violet-400" />
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">
              Productivity Score
            </p>
            <p className="text-white/35 text-[10px] mt-0.5">
              Daily score trend (0–100)
            </p>
          </div>
        </div>
        {data.length >= 2 && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold ${trendColor}`}
          >
            <TrendIcon className="h-3 w-3" />
            {delta > 0 ? "+" : ""}
            {delta} pts
          </span>
        )}
      </div>

      {/* chart */}
      <div className="px-3 py-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: Math.max(240, data.length * 48) }}
          aria-label="Productivity score trend"
        >
          <defs>
            <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* grid */}
          {[0, 50, 100].map((v) => {
            const y = toY(v);
            return (
              <g key={v}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 4}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="8"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* area */}
          {areaPath && (
            <motion.path
              d={areaPath}
              fill="url(#prodGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* line */}
          {linePath && (
            <motion.path
              d={linePath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          )}

          {/* points */}
          {pts.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill={scoreColor(p.d.productivityScore)}
                stroke="#0a0a0f"
                strokeWidth="1.5"
              />
              <text
                x={p.x}
                y={H - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="8"
              >
                {formatDate(p.d.createdAt)}
              </text>
              <text
                x={p.x}
                y={p.y - 6}
                textAnchor="middle"
                fill={scoreColor(p.d.productivityScore)}
                fontSize="8"
                fontWeight="700"
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
/*                          TASKS BAR CHART                                   */
/* -------------------------------------------------------------------------- */

function TasksBarChart({ journals }: { journals: IJournalSummary[] }) {
  const data = [...journals].reverse().slice(-10);
  const maxTasks = Math.max(
    ...data.map((d) => d.completedTasks + d.pendingTasks),
    1,
  );

  const BW = 14; // bar width
  const GAP = 18; // gap between groups
  const H = 110;
  const PAD = { top: 12, bottom: 26, left: 24 };
  const innerH = H - PAD.top - PAD.bottom;
  const W = PAD.left + data.length * (BW * 2 + GAP) + 12;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="h-3 w-3 text-emerald-400" />
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">
              Tasks Breakdown
            </p>
            <p className="text-white/35 text-[10px] mt-0.5">
              Completed vs pending per day
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Done
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            Pending
          </span>
        </div>
      </div>

      {/* chart */}
      <div className="px-3 py-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: Math.max(200, W) }}
          aria-label="Tasks completion chart"
        >
          {[0, 0.5, 1].map((frac) => {
            const y = PAD.top + innerH * (1 - frac);
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.2)"
                  fontSize="8"
                >
                  {Math.round(maxTasks * frac)}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => {
            const gx = PAD.left + i * (BW * 2 + GAP) + 6;
            const baseY = PAD.top + innerH;
            const cH = (d.completedTasks / maxTasks) * innerH;
            const pH = (d.pendingTasks / maxTasks) * innerH;

            return (
              <g key={d.id}>
                <motion.rect
                  x={gx}
                  y={baseY - cH}
                  width={BW}
                  height={cH}
                  rx="3"
                  fill="#34d399"
                  fillOpacity="0.8"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${gx}px ${baseY}px` }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                />
                <motion.rect
                  x={gx + BW + 3}
                  y={baseY - pH}
                  width={BW}
                  height={pH}
                  rx="3"
                  fill="rgba(255,255,255,0.14)"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${gx + BW + 3}px ${baseY}px` }}
                  transition={{ duration: 0.45, delay: i * 0.05 + 0.05 }}
                />
                <text
                  x={gx + BW}
                  y={baseY + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="8"
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
/*                             SKELETON                                       */
/* -------------------------------------------------------------------------- */

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
      <div className="h-36 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
      <div className="h-28 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOT EXPORT                                   */
/* -------------------------------------------------------------------------- */

export function Chart() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-center text-red-400 text-xs">
        Couldn&apos;t load analytics. Please try again.
      </div>
    );
  }

  if (!journals?.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics yet"
        description="Generate your first AI journal from the Dashboard to see charts here."
      />
    );
  }

  const avgScore = Math.round(
    journals.reduce((s, j) => s + j.productivityScore, 0) / journals.length,
  );
  const bestScore = Math.max(...journals.map((j) => j.productivityScore));
  const totalCompleted = journals.reduce((s, j) => s + j.completedTasks, 0);
  const totalPending = journals.reduce((s, j) => s + j.pendingTasks, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Compact stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Avg Score"
          value={avgScore}
          sub="all journals"
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
          sub={`${totalPending} pending`}
          color="text-blue-400"
        />
      </div>

      {/* Side-by-side charts on md+ */}
      <div className="grid md:grid-cols-2 gap-4">
        <ProductivityLineChart journals={journals} />
        <TasksBarChart journals={journals} />
      </div>
    </motion.div>
  );
}
