import { Category, WeekDay } from "@/features/planning/types/weekly.types";

/* -------------------------------------------------------------------------- */
/*                              DAY CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

export const DAY_KEYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const DAY_LABELS: Record<WeekDay, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

/* -------------------------------------------------------------------------- */
/*                            CATEGORY CONSTANTS                              */
/* -------------------------------------------------------------------------- */

/** Canonical category values — defined once so the filter pills and the
 * "Add Task" dropdown can never drift out of sync with each other. */
export const CATEGORY_VALUES: Category[] = [
  "Study",
  "Fitness",
  "Nutrition",
  "Personal",
  "Career",
  "Other",
];

export const CATEGORY_FILTERS = ["All", ...CATEGORY_VALUES] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

/* -------------------------------------------------------------------------- */
/*                            PRIORITY STYLES                                 */
/* -------------------------------------------------------------------------- */

export const PRIORITY_CONFIG: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  HIGH: {
    dot: "bg-red-400",
    badge: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "High",
  },
  MEDIUM: {
    dot: "bg-yellow-400",
    badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    label: "Medium",
  },
  LOW: {
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    label: "Low",
  },
};

/* -------------------------------------------------------------------------- */
/*                              DATE HELPERS                                  */
/* -------------------------------------------------------------------------- */

/** Get the ISO date string (YYYY-MM-DD) of the Monday for a given Date. */
export function getMondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  // getDay() returns 0=Sun … 6=Sat; shift so Mon=0
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d.toISOString().split("T")[0];
}

/** Add `weeks` weeks to a YYYY-MM-DD weekStart string. */
export function shiftWeek(weekStart: string, weeks: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}

/** "Jul 20 – Jul 26, 2026" display label. */
export function getWeekRangeLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

/**
 * Day-of-month + month label for a specific day offset from weekStart,
 * e.g. "15 Aug". The previous version hardcoded the " Jul" suffix, which
 * showed the wrong month for every week that wasn't in July.
 */
export function getDayDateLabel(weekStart: string, offset: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + offset);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${d.getDate()} ${month}`;
}

/* -------------------------------------------------------------------------- */
/*                            DURATION HELPER                                 */
/* -------------------------------------------------------------------------- */

/** "45m" / "1h" / "1h 30m" */
export function getDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h${rest ? ` ${rest}m` : ""}`;
}
