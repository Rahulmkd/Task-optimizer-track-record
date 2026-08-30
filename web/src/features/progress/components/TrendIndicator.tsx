"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
}

export function TrendIndicator({ value, suffix = "pts" }: TrendIndicatorProps) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/35">
        <Minus className="h-3 w-3" />
        No change
      </span>
    );
  }

  const positive = value > 0;

  return (
    <span
      className={`
        inline-flex items-center gap-1
        text-[11px] font-bold
        ${positive ? "text-emerald-400" : "text-red-400"}
      `}
    >
      {positive ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      {Math.abs(value)} {suffix}
    </span>
  );
}
