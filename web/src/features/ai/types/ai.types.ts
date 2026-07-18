export interface IJournalPreview {
  summary: string;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
  suggestion: string | null;
}

export interface IJournalSummary extends IJournalPreview {
  id: string;
  createdAt: string;
}

export interface ISaveJournalRequest {
  summary: string;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
}
