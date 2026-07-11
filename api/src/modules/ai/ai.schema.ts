import { z } from "zod";

export const generateJournalSchema = z.object({}).passthrough();

export type GenerateJournalDTO = z.infer<typeof generateJournalSchema>;
