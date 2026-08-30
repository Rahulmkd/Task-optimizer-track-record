export interface ProgressStatsData {
  latestScore: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
  totalCompleted: number;
  totalPending: number;
  totalTasks: number;
}

export interface ProgressTrend {
  currentScore: number;
  previousScore: number;
  difference: number;
}

export interface ProgressTaskSummary {
  completed: number;
  pending: number;
  total: number;
  completionRate: number;
}
