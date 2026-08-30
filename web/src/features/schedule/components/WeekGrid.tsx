"use client";

import { motion } from "framer-motion";

import { DayColumn } from "./DayColumn";
import { CategoryFilter, DAY_KEYS } from "../utils/next-week-schedule.utils";
import { IWeeklyTask, WeekDay } from "../types/weekly.types";

interface WeekGridProps {
  tasks: IWeeklyTask[];
  weekStart: string;
  categoryFilter: CategoryFilter;
  todayDayKey: WeekDay | null;
  onAddForDay: (day: WeekDay) => void;
}

export function WeekGrid({
  tasks,
  weekStart,
  categoryFilter,
  todayDayKey,
  onAddForDay,
}: WeekGridProps) {
  const filterByCategory = (dayTasks: IWeeklyTask[]) =>
    categoryFilter === "All"
      ? dayTasks
      : dayTasks.filter((t) => t.category === categoryFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
    >
      {DAY_KEYS.map((dayKey, offset) => {
        const dayTasks = filterByCategory(
          tasks.filter((t) => t.day === dayKey),
        );

        return (
          <DayColumn
            key={dayKey}
            dayKey={dayKey}
            dayOffset={offset}
            weekStart={weekStart}
            tasks={dayTasks}
            isToday={dayKey === todayDayKey}
            onAdd={() => onAddForDay(dayKey)}
          />
        );
      })}
    </motion.div>
  );
}
