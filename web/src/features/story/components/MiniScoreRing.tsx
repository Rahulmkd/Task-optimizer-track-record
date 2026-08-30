"use client";

import { motion } from "framer-motion";
import { getStoryScoreRingColor } from "../utils/today-story.utils";

interface MiniScoreRingProps {
  score: number;
}

export function MiniScoreRing({ score }: MiniScoreRingProps) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = getStoryScoreRingColor(score);

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
