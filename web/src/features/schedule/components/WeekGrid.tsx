"use client";

import { motion } from "framer-motion";

import { DayColumn } from "./DayColumn";
import { CategoryFilter, DAY_KEYS } from "../utils/weekly-schedule.utils";
import { IWeeklyTask, WeekDay } from "../types/weekly.types";

interface WeekGridProps {
  tasks: IWeeklyTask[];
  weekStart: string;
  categoryFilter: CategoryFilter;
  todayDayKey: WeekDay | null;
  onAddForDay: (day: WeekDay) => void;
  onEditTask?: (task: IWeeklyTask) => void;
}

export function WeekGrid({
  tasks,
  weekStart,
  categoryFilter,
  todayDayKey,
  onAddForDay,
  onEditTask,
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
      className="w-full overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <div className="grid grid-cols-7 gap-3 min-w-[1120px] 2xl:min-w-0 w-full items-start">
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
              onEditTask={onEditTask}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
