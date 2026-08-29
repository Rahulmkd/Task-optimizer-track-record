/** DTO for a single weekly task returned in API responses. */
export interface WeeklyTaskResponseDTO {
  id: string;
  weeklyPlanId: string;
  title: string;
  day: string;
  priority: string;
  category: string;
  /** Duration in minutes */
  duration: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO for a weekly plan with all its tasks (flat list; group by `day` client-side if needed). */
export interface WeeklyPlanResponseDTO {
  id: string;
  userId: string;
  weekStart: string;
  tasks: WeeklyTaskResponseDTO[];
  /** Aggregated stats derived from the task list */
  stats: {
    total: number;
    completed: number;
    pending: number;
    /** 0-100 rounded completion percentage */
    progressPercent: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
