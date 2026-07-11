import { Journal } from "@prisma/client";
import { AIJournalResponseDTO } from "./ai.response.js";

/**
 * AIMapper transforms Prisma model instances into API response DTOs.
 *
 */
export class AIMapper {
  static toResponse(journal: Journal, suggestion: string): AIJournalResponseDTO {
    return {
      id: journal.id,
      summary: journal.summary,
      completedTasks: journal.completedTasks,
      pendingTasks: journal.pendingTasks,
      productivityScore: journal.productivityScore ?? 0,
      suggestion,
      createdAt: journal.createdAt,
    };
  }
}
