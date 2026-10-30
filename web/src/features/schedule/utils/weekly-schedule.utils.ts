import { IWeeklyTask, WeekDay } from "@/features/schedule/types/weekly.types";

/* -------------------------------------------------------------------------- */
/*                              DAY CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

export const DAY_KEYS: WeekDay[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

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
export const DEFAULT_CATEGORIES: string[] = [
  "Study",
  "Work",
  "Personal",
  "Fitness",
];

export const CATEGORY_STORAGE_KEY = "task_optimizer_custom_categories";

export function getCustomCategories(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((c) => typeof c === "string" && c.trim() && c !== "__CREATE_NEW__")
      : [];
  } catch {
    return [];
  }
}

export function saveCustomCategory(name: string): string[] {
  const trimmed = name.trim();
  if (
    !trimmed ||
    trimmed === "__CREATE_NEW__" ||
    typeof window === "undefined"
  ) {
    return getCustomCategories();
  }
  const current = getCustomCategories();
  const exists =
    current.some((c) => c.toLowerCase() === trimmed.toLowerCase()) ||
    DEFAULT_CATEGORIES.some((c) => c.toLowerCase() === trimmed.toLowerCase());

  if (!exists) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  }
  return current;
}

export function getAllCategories(existingTasks: IWeeklyTask[] = []): string[] {
  const custom = getCustomCategories();
  const taskCategories = existingTasks
    .map((t) => t.category?.trim())
    .filter(
      (c): c is string =>
        Boolean(c && c !== "Other" && c !== "__CREATE_NEW__"),
    );

  const combined = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...custom, ...taskCategories]),
  );
  return combined;
}

export const CATEGORY_VALUES: string[] = DEFAULT_CATEGORIES;

export const CATEGORY_FILTERS = ["All", ...CATEGORY_VALUES];
export type CategoryFilter = string;

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
 * Day-of-month + month label for a specific day offset from weekStart.
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

/* -------------------------------------------------------------------------- */
/*                           TIME & SCHEDULING HELPERS                        */
/* -------------------------------------------------------------------------- */

export interface TimeSlotOption {
  value: string; // e.g. "09:00 AM"
  label: string; // e.g. "9:00 AM"
  minutes: number;
}

/**
 * Generates 30-minute interval slots from 6:00 AM to 11:30 PM.
 */
export function generateTimeSlots(): TimeSlotOption[] {
  const slots: TimeSlotOption[] = [];
  // 6:00 AM (360 min) to 11:30 PM (1410 min)
  for (let m = 6 * 60; m <= 23 * 60 + 30; m += 30) {
    const hours24 = Math.floor(m / 60);
    const mins = m % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const padMin = String(mins).padStart(2, "0");
    const padHour = String(hours12).padStart(2, "0");

    slots.push({
      value: `${padHour}:${padMin} ${period}`,
      label: `${hours12}:${padMin} ${period}`,
      minutes: m,
    });
  }
  return slots;
}

export const TIME_SLOTS: TimeSlotOption[] = generateTimeSlots();

export const DEFAULT_START_TIME = "09:00 AM";

/**
 * Parses any time string ("09:00 AM", "9:00 AM", "09:00", "21:30") into minutes from midnight (0..1439).
 * Defaults to 540 (9:00 AM) if invalid or omitted.
 */
export function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr || typeof timeStr !== "string") return 540;

  const trimmed = timeStr.trim();
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!ampmMatch) return 540;

  let hours = parseInt(ampmMatch[1], 10);
  const minutes = parseInt(ampmMatch[2], 10);
  const modifier = ampmMatch[3]?.toUpperCase();

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const total = (hours % 24) * 60 + (minutes % 60);
  return Number.isNaN(total) ? 540 : total;
}

/**
 * Converts minutes from midnight into 12-hour AM/PM string, e.g. 540 -> "9:00 AM".
 */
export function minutesToTime12(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/**
 * Formats a time string into clean 12-hour AM/PM display string (e.g. "9:00 AM").
 */
export function formatTimeDisplay(timeStr?: string | null): string {
  return minutesToTime12(parseTimeToMinutes(timeStr));
}

/**
 * Calculates end time given a start time and duration in minutes.
 */
export function calculateEndTime(
  startTimeStr?: string | null,
  durationMinutes: number = 60,
): string {
  const startMinutes = parseTimeToMinutes(startTimeStr);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime12(endMinutes);
}

/**
 * Formats a time range, e.g. "9:00 AM – 10:00 AM".
 */
export function getTimeRangeLabel(
  startTimeStr?: string | null,
  durationMinutes: number = 60,
): string {
  const start = formatTimeDisplay(startTimeStr);
  const end = calculateEndTime(startTimeStr, durationMinutes);
  return `${start} – ${end}`;
}

/**
 * Checks if two tasks overlap in time.
 * Overlap occurs if startA < endB AND startB < endA.
 */
export function checkTasksOverlap(
  taskA: { startTime?: string; duration: number },
  taskB: { startTime?: string; duration: number },
): boolean {
  const startA = parseTimeToMinutes(taskA.startTime);
  const endA = startA + (taskA.duration || 60);
  const startB = parseTimeToMinutes(taskB.startTime);
  const endB = startB + (taskB.duration || 60);

  return startA < endB && startB < endA;
}

/**
 * Finds all tasks on the same day that conflict with the given candidate task.
 */
export function findConflictingTasks(
  candidate: {
    id?: string;
    day: string;
    startTime?: string;
    duration: number;
  },
  tasks: IWeeklyTask[],
): IWeeklyTask[] {
  return tasks.filter((t) => {
    if (candidate.id && t.id === candidate.id) return false;
    if (t.day !== candidate.day) return false;
    return checkTasksOverlap(candidate, t);
  });
}

/**
 * Returns a Set of task IDs for all tasks that have scheduling conflicts with another task on the same day.
 */
export function getOverlappingTaskIds(tasks: IWeeklyTask[]): Set<string> {
  const conflictIds = new Set<string>();

  // Group by day
  const byDay: Record<string, IWeeklyTask[]> = {};
  for (const task of tasks) {
    if (!byDay[task.day]) byDay[task.day] = [];
    byDay[task.day].push(task);
  }

  for (const dayTasks of Object.values(byDay)) {
    for (let i = 0; i < dayTasks.length; i++) {
      for (let j = i + 1; j < dayTasks.length; j++) {
        if (checkTasksOverlap(dayTasks[i], dayTasks[j])) {
          conflictIds.add(dayTasks[i].id);
          conflictIds.add(dayTasks[j].id);
        }
      }
    }
  }

  return conflictIds;
}

/**
 * Sorts tasks in chronological order by start time, then by creation date.
 */
export function sortTasksChronologically(tasks: IWeeklyTask[]): IWeeklyTask[] {
  return [...tasks].sort((a, b) => {
    const timeA = parseTimeToMinutes(a.startTime);
    const timeB = parseTimeToMinutes(b.startTime);
    if (timeA !== timeB) return timeA - timeB;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}
