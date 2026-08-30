"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  formatProgressDate,
  getProgressScoreColor,
  getProgressScoreLabel,
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10">
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Productivity trend</h3>

            <p className="mt-0.5 text-[11px] text-white/35">
              Your daily productivity score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-lg font-black ${getProgressScoreColor(
                latestScore,
              )}`}
            >
              {latestScore}
            </p>

            <p className="text-[9px] uppercase tracking-wider text-white/25">
              latest
            </p>
          </div>

          <div className="h-7 w-px bg-white/[0.08]" />

          <TrendIndicator value={trend} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CHART                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="px-2 pb-3 pt-4 sm:px-4">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto min-w-[520px] w-full"
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
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.24" />

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
                    stroke="rgba(255,255,255,0.055)"
                    strokeWidth="1"
                  />

                  <text
                    x={PAD.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.25)"
                    fontSize="9"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Area */}
            {areaPath && (
              <motion.path
                d={areaPath}
                fill="url(#productivity-area-gradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
            )}

            {/* Line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
            />

            {/* Points */}
            {points.map((point, index) => (
              <g key={`${point.date}-${index}`}>
                <circle cx={point.x} cy={point.y} r="7" fill="transparent" />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  fill="#8b5cf6"
                  stroke="#0b0b10"
                  strokeWidth="2"
                />

                <text
                  x={point.x}
                  y={H - 10}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9"
                >
                  {formatProgressDate(point.date)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
        <span className="text-[10px] text-white/30">
          Showing last {data.length} days
        </span>

        <span
          className={`text-[10px] font-semibold ${getProgressScoreColor(
            latestScore,
          )}`}
        >
          {getProgressScoreLabel(latestScore)}
        </span>
      </div>
    </div>
  );
}
