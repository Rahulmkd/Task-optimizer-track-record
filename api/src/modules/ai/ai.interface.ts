/**
 * The shape returned by the AI after analysing the user's tasks.
 * Matches the JSON schema enforced in journal.prompt.ts.
 */
export interface JournalAIResponse {
  summary: string;

  completedTasks: number;

  pendingTasks: number;

  productivityScore: number;

  suggestion: string;
}

export interface GenerateJournalRequest {
  userId: string;
}
