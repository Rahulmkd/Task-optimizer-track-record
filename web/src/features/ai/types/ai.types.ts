/**
 * Mirrors the backend's AIJournalResponseDTO
 */
export interface IJournalSummary {
  id: string;

  summary: string;

  completedTasks: number;

  pendingTasks: number;

  productivityScore: number;

  suggestion: string;

  createdAt: string;
}
