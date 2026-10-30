"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  formatProgressDate,
  getProgressScoreColor,
} from "../utils/progress.utils";
import { TrendIndicator } from "./TrendIndicator";
import { IJournalSummary } from "@/features/story/types/ai.types";

interface ProductivityTrendChartProps {
  journals: IJournalSummary[];
}

export function ProductivityTrendChart({
  journals,
}: ProductivityTrendChartProps) {
  const data = [...journals].reverse().slice(-14);

  if (!data.length) {
    return null;
  }

  const W = 700;
  const H = 250;

  const PAD = {
    top: 25,
    right: 20,
    bottom: 35,
    left: 35,
  };

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const toX = (index: number) =>
    data.length === 1 ? W / 2 : PAD.left + (index / (data.length - 1)) * innerW;

  const toY = (score: number) => PAD.top + innerH - (score / 100) * innerH;

  const points = data.map((journal, index) => ({
    x: toX(index),
    y: toY(journal.productivityScore),
    score: journal.productivityScore,
    date: journal.createdAt,
  }));

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(" ");

  const areaPath =
    points.length > 0
      ? `
          ${linePath}
          L ${points[points.length - 1].x} ${PAD.top + innerH}
          L ${points[0].x} ${PAD.top + innerH}
          Z
        `
      : "";

  const latestScore = data[data.length - 1]?.productivityScore ?? 0;

  const previousScore =
    data.length > 1
      ? (data[data.length - 2]?.productivityScore ?? latestScore)
      : latestScore;

  const trend = latestScore - previousScore;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-xl">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-3 border-b border-white/[0.08] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-600/15 text-violet-400">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Productivity Trend</h3>
            <p className="mt-0.5 text-xs text-white/50">
              Daily trajectory over logged sessions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <p
              className={`text-lg font-black ${getProgressScoreColor(
                latestScore,
              )}`}
            >
              {latestScore}
            </p>

            <p className="text-[10px] uppercase font-bold tracking-wider text-white/45">
              Latest Score
            </p>
          </div>

          <div className="h-7 w-px bg-white/10" />

          <TrendIndicator value={trend} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CHART                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="px-2 pb-4 pt-4 sm:px-4">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto min-w-[500px] w-full"
            role="img"
            aria-label="Productivity score trend"
          >
            <defs>
              <linearGradient
                id="productivity-area-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 25, 50, 75, 100].map((value) => {
              const y = toY(value);

              return (
                <g key={value}>
                  <line
                    x1={PAD.left}
                    y1={y}
                    x2={W - PAD.right}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />

                  <text
                    x={PAD.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.35)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Area */}
            {areaPath && (
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                d={areaPath}
                fill="url(#productivity-area-gradient)"
              />
            )}

            {/* Line */}
            {linePath && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                d={linePath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#0e0e16"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />

                {/* Date labels */}
                <text
                  x={point.x}
                  y={H - PAD.bottom + 18}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="9"
                  fontWeight="500"
                >
                  {formatProgressDate(point.date)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
