import { z } from "zod";

export const saveJournalSchema = z
  .object({
    summary: z.string().trim().min(1, "summary is required").max(2000),
    completedTasks: z.number().int().min(0),
    pendingTasks: z.number().int().min(0),
    productivityScore: z.number().int().min(0).max(100),
  })
  .strict();

export type SaveJournalDTO = z.infer<typeof saveJournalSchema>;

/**
 * Validates the AI provider's parsed JSON response against the exact shape
 * requested in journal.prompt.ts. LLM output is untrusted input — this is
 * what catches a malformed/partial response before it reaches the client
 * or gets persisted, instead of silently flowing through as `undefined`.
 */

export const journalAIResponseSchema = z.object({
  summary: z.string().trim().min(1),
  completedTasks: z.number().int().min(0),
  pendingTasks: z.number().int().min(0),
  productivityScore: z.number().int().min(0).max(100),
  suggestion: z.string().trim().min(1),
});

export type JournalAIResponse = z.infer<typeof journalAIResponseSchema>;
