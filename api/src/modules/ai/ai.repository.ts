import { prisma } from "../../lib/prisma.js";
import { getTodayRange } from "../../utils/date.helper.js";

/**
 * AIRepository — all database interactions for the AI/journal module.
 */
class AIRepository {
  /**
   * Returns all tasks created today, in the app's configured timezone,
   * ordered chronologically so the AI sees them in creation order.
   */
  async getTodayTasks(userId: string) {
    const { start, end } = getTodayRange();

    return prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: start, lt: end },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getTodayJournal(userId: string) {
    const { start, end } = getTodayRange();

    return prisma.journal.findFirst({
      where: {
        userId,
        createdAt: { gte: start, lt: end },
      },
      orderBy: { createdAt: "desc" },
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
