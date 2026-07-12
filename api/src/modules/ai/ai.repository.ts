import { prisma } from "../../lib/prisma.js";

/**
 * AIRepository — all database interactions for the AI/journal module.
*/
class AIRepository {
  /**
   * Returns all tasks created today (midnight → 23:59:59) for the given
   * user, ordered chronologically so the AI sees them in creation order.
   */
  async getTodayTasks(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Persists a journal entry.
   */
  async createJournal(data: {
    userId: string;
    summary: string;
    completedTasks: number;
    pendingTasks: number;
    productivityScore: number;
  }) {
    return prisma.journal.create({ data });
  }

  /**
   * Returns all journals for the given user, newest first.
   * Used by the Analytics / Journal page to display history.
   */
  async getAllJournals(userId: string) {
    return prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new AIRepository();
