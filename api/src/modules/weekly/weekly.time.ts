/**
 * Time calculation and parsing helpers for the weekly planner module.
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

export function minutesToTime12(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (end > start) {
    return end - start;
  }
  // Handles crossing midnight (e.g., 11:00 PM to 6:00 AM)
  return 1440 - start + end;
}

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
