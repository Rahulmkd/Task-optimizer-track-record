import { Journal } from "@prisma/client";
import { AIJournalResponseDTO } from "./ai.response.js";

/**
 * AIMapper — transforms Prisma Journal rows into API response DTOs.
 */
export class AIMapper {
  static toResponse(
    journal: Journal,
    suggestion: string | null = null,
  ): AIJournalResponseDTO {
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

  static toListResponse(journals: Journal[]): AIJournalResponseDTO[] {
    return journals.map((j) => AIMapper.toResponse(j, null));
  }
}
