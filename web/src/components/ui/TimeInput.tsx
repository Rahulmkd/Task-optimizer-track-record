import { Clock } from "lucide-react";
import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const [hour24, minute] = value.split(":").map(Number);

  const isPM = hour24 >= 12;

  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const updateTime = (hour: number, minute: number) => {
    const h = Math.max(0, Math.min(23, hour));
    const m = Math.max(0, Math.min(59, minute));

    onChange(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };

  const updateHour12 = (displayHour: number) => {
    const h = Math.max(1, Math.min(12, displayHour));

    let converted = h % 12;

    if (isPM) converted += 12;

    updateTime(converted, minute);
  };

  const updateMinute = (m: number) => {
    updateTime(hour24, m);
  };

  const toggleAMPM = () => {
    let h = hour24;

    if (isPM) {
      h = h === 12 ? 0 : h - 12;
    } else {
      h = h === 0 ? 12 : h + 12;
    }

    updateTime(h, minute);
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

  return (
    <div className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 backdrop-blur-sm">
      <Clock className="h-4 w-4 text-white/40" />

      <div className="h-5 w-px bg-white/10" />

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
        className={cn(
          "w-10 bg-transparent text-center",
          "text-sm font-semibold tabular-nums text-white",
          "outline-none cursor-pointer",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <span className="text-sm font-bold text-white/40">:</span>

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
        className={cn(
          "w-10 bg-transparent text-center",
          "text-sm font-semibold tabular-nums text-white",
          "outline-none cursor-pointer",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <div className="h-5 w-px bg-white/10" />

      {/* AM/PM toggle */}
      <button
        type="button"
        onClick={toggleAMPM}
        className={cn(
          "text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer",
          isPM
            ? "bg-violet-500/20 text-violet-300 border border-violet-500/25"
            : "bg-white/8 text-white/50 border border-white/10 hover:text-white/80",
        )}
      >
        {isPM ? "PM" : "AM"}
      </button>

      {/* Native picker for accessibility */}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}
