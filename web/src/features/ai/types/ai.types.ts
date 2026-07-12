/**
 * Mirrors the backend's AIJournalResponseDTO
 * (api/src/modules/ai/ai.response.ts).
 */
export interface IJournalSummary {
  id: string;

  summary: string;

  completedTasks: number;

  pendingTasks: number;

  productivityScore: number;

  suggestion: string | null;

  createdAt: string;
}
