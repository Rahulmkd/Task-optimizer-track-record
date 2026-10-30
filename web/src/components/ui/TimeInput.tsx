"use client";

import { Clock } from "lucide-react";
import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  format?: "12h" | "24h";
  size?: "default" | "sm";
}

export function TimeInput({
  value,
  onChange,
  className,
  format = "24h",
  size = "default",
}: TimeInputProps) {
  // Parse hour24 and minute safely from either "HH:mm" or "hh:mm AM/PM"
  const parseTime = (val?: string) => {
    if (!val || typeof val !== "string") return { hour24: 9, minute: 0 };
    const trimmed = val.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return { hour24: 9, minute: 0 };

    let h = parseInt(match[1], 10);
    const m = Math.max(0, Math.min(59, parseInt(match[2], 10)));
    const modifier = match[3]?.toUpperCase();

    if (modifier === "PM" && h < 12) {
      h += 12;
    } else if (modifier === "AM" && h === 12) {
      h = 0;
    }

    return {
      hour24: Math.max(0, Math.min(23, Number.isNaN(h) ? 9 : h)),
      minute: Number.isNaN(m) ? 0 : m,
    };
  };

  const { hour24, minute } = parseTime(value);
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const emitChange = (h24: number, min: number) => {
    const validH = Math.max(0, Math.min(23, h24));
    const validM = Math.max(0, Math.min(59, min));

    if (format === "12h") {
      const period = validH >= 12 ? "PM" : "AM";
      const h12 = validH % 12 === 0 ? 12 : validH % 12;
      const padHour = String(h12).padStart(2, "0");
      const padMin = String(validM).padStart(2, "0");
      onChange(`${padHour}:${padMin} ${period}`);
    } else {
      onChange(
        `${String(validH).padStart(2, "0")}:${String(validM).padStart(2, "0")}`,
      );
    }
  };

  const updateHour12 = (displayHour: number) => {
    const h = Math.max(1, Math.min(12, displayHour));
    let converted = h % 12;
    if (isPM) converted += 12;
    emitChange(converted, minute);
  };

  const updateMinute = (m: number) => {
    emitChange(hour24, m);
  };

  const toggleAMPM = () => {
    let h = hour24;
    if (isPM) {
      h = h === 12 ? 0 : h - 12;
    } else {
      h = h === 0 ? 12 : h + 12;
    }
    emitChange(h, minute);
  };

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!Number.isNaN(val)) {
      updateHour12(val);
    }
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!Number.isNaN(val)) {
      updateMinute(val);
    }
  };

  const wheelHour = (delta: number) => {
    let next = hour12 + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    updateHour12(next);
  };

  const wheelMinute = (delta: number) => {
    let next = minute + delta;
    if (next > 59) next = 0;
    if (next < 0) next = 59;
    updateMinute(next);
  };

  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-colors focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30",
        isSmall ? "h-9 gap-2 px-2.5" : "h-11 gap-3 px-3",
        className,
      )}
    >
      <Clock
        className={cn(
          "text-white/40 shrink-0",
          isSmall ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
      />

      <div className={cn("w-px bg-white/10 shrink-0", isSmall ? "h-4" : "h-5")} />

      {/* Hour */}
      <input
        type="number"
        min={1}
        max={12}
        value={hour12}
        onChange={handleHourChange}
        onWheel={(e) => {
          e.preventDefault();
          wheelHour(e.deltaY < 0 ? 1 : -1);
        }}
        onFocus={(e) => e.target.select()}
        aria-label="Hour"
        className={cn(
          "bg-transparent text-center font-semibold tabular-nums text-white outline-none cursor-pointer",
          isSmall ? "w-8 text-xs" : "w-10 text-sm",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <span
        className={cn(
          "font-bold text-white/40 shrink-0 select-none",
          isSmall ? "text-xs" : "text-sm",
        )}
      >
        :
      </span>

      {/* Minute */}
      <input
        type="number"
        min={0}
        max={59}
        value={String(minute).padStart(2, "0")}
        onChange={handleMinuteChange}
        onWheel={(e) => {
          e.preventDefault();
          wheelMinute(e.deltaY < 0 ? 1 : -1);
        }}
        onFocus={(e) => e.target.select()}
        aria-label="Minute"
        className={cn(
          "bg-transparent text-center font-semibold tabular-nums text-white outline-none cursor-pointer",
          isSmall ? "w-8 text-xs" : "w-10 text-sm",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <div className={cn("w-px bg-white/10 shrink-0", isSmall ? "h-4" : "h-5")} />

      {/* AM/PM toggle */}
      <button
        type="button"
        onClick={toggleAMPM}
        aria-label="Toggle AM/PM"
        className={cn(
          "font-bold tracking-widest rounded-lg transition-all duration-200 cursor-pointer select-none shrink-0",
          isSmall ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1",
          isPM
            ? "bg-violet-500/25 text-violet-300 border border-violet-500/30 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
            : "bg-white/8 text-white/60 border border-white/10 hover:text-white",
        )}
      >
        {isPM ? "PM" : "AM"}
      </button>

      {/* Native picker for accessibility */}
      <input
        type="time"
        value={`${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
        onChange={(e) => {
          if (e.target.value) {
            const [h, m] = e.target.value.split(":").map(Number);
            emitChange(h, m);
          }
        }}
        className="sr-only"
        aria-label="Time picker"
      />
    </div>
  );
}
