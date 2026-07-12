/**
 * DTO returned for a single journal entry.
 */
export interface AIJournalResponseDTO {
  id: string;
  summary: string;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
  suggestion: string | null;
  createdAt: Date;
}
