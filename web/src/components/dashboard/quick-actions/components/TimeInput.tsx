// /* -------------------------------------------------------------------------- */
// /*                          PREMIUM TIME PICKER                               */
// /* -------------------------------------------------------------------------- */

import { Clock } from "lucide-react";
import { TimeSegment } from "./TimeSegment";
import { cn } from "@/lib/utils";

export function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  // Parse HH:MM
  const [hours, minutes] = value.split(":").map(Number);
  const isPM = hours >= 12;
  const display12 = hours % 12 === 0 ? 12 : hours % 12;

  const setHours = (h: number) =>
    onChange(
      `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    );
  const setMinutes = (m: number) =>
    onChange(`${String(hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  const toggleAMPM = () => setHours(isPM ? hours - 12 : hours + 12);

  const nudge = (unit: "h" | "m", delta: number) => {
    if (unit === "h") {
      const next = (hours + delta + 24) % 24;
      setHours(next);
    } else {
      const next = (minutes + delta + 60) % 60;
      setMinutes(next);
    }
  };

  return (
    <div className="flex items-center gap-2 h-11 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm px-3 overflow-hidden">
      {/* Clock icon */}
      <Clock className="h-4 w-4 text-white/30 shrink-0" />

      {/* Divider */}
      <div className="h-5 w-px bg-white/10" />

      {/* Hour segment */}
      <TimeSegment
        value={display12}
        onUp={() => nudge("h", 1)}
        onDown={() => nudge("h", -1)}
      />

      <span className="text-white/40 font-bold text-sm select-none">:</span>

      {/* Minute segment */}
      <TimeSegment
        value={minutes}
        onUp={() => nudge("m", 5)}
        onDown={() => nudge("m", -5)}
        pad
      />

      <div className="h-5 w-px bg-white/10 mx-1" />

      {/* AM/PM toggle */}
      <button
        type="button"
        onClick={toggleAMPM}
        className={cn(
          "text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg transition-all duration-200",
          isPM
            ? "bg-violet-500/20 text-violet-300 border border-violet-500/25"
            : "bg-white/8 text-white/50 border border-white/10 hover:text-white/80",
        )}
      >
        {isPM ? "PM" : "AM"}
      </button>

      {/* Hidden native input keeps the value accessible */}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
