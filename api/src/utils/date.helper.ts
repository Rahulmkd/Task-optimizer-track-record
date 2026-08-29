import { APP_TIMEZONE_OFFSET_MINUTES } from "../config/env.config.js";

/**
 * Returns the [start, end) UTC instant range that corresponds to "today"
 * in APP_TIMEZONE_OFFSET_MINUTES, regardless of what timezone the server
 * process itself is running in.
 */
export const getTodayRange = (
  offsetMinutes: number = APP_TIMEZONE_OFFSET_MINUTES,
): { start: Date; end: Date } => {
  const offsetMs = offsetMinutes * 60 * 1000;
  const now = Date.now();

  const localNow = new Date(now + offsetMs);
  const localMidnight = Date.UTC(
    localNow.getUTCFullYear(),
    localNow.getUTCMonth(),
    localNow.getUTCDate(),
  );

  const start = new Date(localMidnight - offsetMs);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
};
