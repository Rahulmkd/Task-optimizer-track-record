/** Mirrors the backend's WeeklyTaskResponseDTO. */
export interface IWeeklyTask {
  id: string;
  weeklyPlanId: string;
  title: string;
  description?: string | null;
  day: string;
  priority: string;
  category: string;
  duration: number;
  startTime?: string;
  endTime?: string;
  repeatWeekly?: boolean;
  sourceTaskId?: string | null;
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
export type Category = string;

/** POST /api/v1/weekly/tasks */
export interface CreateWeeklyTaskPayload {
  weekStart: string;
  title: string;
  description?: string | null;
  day: WeekDay;
  priority: Priority;
  category: Category;
  duration: number;
  startTime?: string;
  repeatWeekly?: boolean;
}

/** PATCH /api/v1/weekly/tasks/:id */
export interface UpdateWeeklyTaskPayload {
  title?: string;
  description?: string | null;
  day?: WeekDay;
  priority?: Priority;
  category?: Category;
  duration?: number;
  startTime?: string;
  repeatWeekly?: boolean;
  completed?: boolean;
}

export interface IWeeklyPlanStats {
  progressPercent: number;
  completed: number;
  total: number;
  pending: number;
}

// ── AI Weekly Plan Generation & Bulk Save ───────────────────────────────────

export interface AITaskItem {
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  category: string;
  priority: Priority;
  repeatWeekly: boolean;
}

export interface AIWeeklyPlanPreview {
  summary: string;
  studyRotation?: string | null;
  weekdaySchedule: AITaskItem[];
  saturdaySchedule: AITaskItem[];
  sundaySchedule: AITaskItem[];
  expandedTasks: (AITaskItem & { day: WeekDay })[];
}

export interface GenerateWeeklyPlanPayload {
  routineContext: string;
  instructions?: string;
  weekStart?: string;
}

export interface BulkSaveWeeklyTasksPayload {
  weekStart: string;
  replaceExisting?: boolean;
  tasks: {
    title: string;
    description?: string | null;
    day: WeekDay;
    priority: Priority;
    category: string;
    duration: number;
    startTime: string;
    repeatWeekly?: boolean;
    completed?: boolean;
  }[];
}
