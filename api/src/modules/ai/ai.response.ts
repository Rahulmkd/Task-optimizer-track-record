/**
 * The DTO returned by every AI endpoint.
 */
export interface AIJournalResponseDTO {
  id: string;
  summary: string;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
  suggestion: string;
  createdAt: Date;
}
