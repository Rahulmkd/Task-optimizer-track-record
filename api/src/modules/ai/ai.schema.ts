import { z } from "zod";

export const generateJournalSchema = z.object({}).passthrough();

export type GenerateJournalDTO = z.infer<typeof generateJournalSchema>;

export const saveJournalSchema = z.object({
  summary: z.string().trim().min(1, "summary is required"),
  completedTasks: z.number().int().min(0),
  pendingTasks: z.number().int().min(0),
  productivityScore: z.number().int().min(0).max(100),
});

export type SaveJournalDTO = z.infer<typeof saveJournalSchema>;
