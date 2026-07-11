import { prisma } from "../../lib/prisma.js";

/**
 * AIRepository handles all database interactions for the AI module.
 */
class AIRepository {
  /**
   * Returns all tasks created today (midnight → 23:59:59)
   */
  async getTodayTasks(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async createJournal(data: {
    userId: string;
    summary: string;
    completedTasks: number;
    pendingTasks: number;
    productivityScore: number;
  }) {
    return prisma.journal.create({ data });
  }
}

export default new AIRepository();
