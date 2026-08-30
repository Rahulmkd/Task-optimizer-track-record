/** Mirrors the backend's WeeklyTaskResponseDTO. */
export interface IWeeklyTask {
  id: string;
  weeklyPlanId: string;
  title: string;
  day: string;
  priority: string;
  category: string;
  duration: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors the backend's WeeklyPlanResponseDTO. */
export interface IWeeklyPlan {
  id: string;
  userId: string;
  weekStart: string;
  tasks: IWeeklyTask[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    progressPercent: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Request payloads ────────────────────────────────────────────────────────

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Category =
  | "Study"
  | "Fitness"
  | "Nutrition"
  | "Personal"
  | "Career"
  | "Other";

/** POST /api/v1/weekly/tasks */
export interface CreateWeeklyTaskPayload {
  weekStart: string;
  title: string;
  day: WeekDay;
  priority: Priority;
  category: Category;
  duration: number;
}

/** PATCH /api/v1/weekly/tasks/:id */
export interface UpdateWeeklyTaskPayload {
  title?: string;
  day?: WeekDay;
  priority?: Priority;
  category?: Category;
  duration?: number;
  completed?: boolean;
}

export interface IWeeklyPlanStats {
  progressPercent: number;
  completed: number;
  total: number;
  pending: number;
}
