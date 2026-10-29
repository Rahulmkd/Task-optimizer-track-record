import { prisma } from "../../lib/prisma.js";
import { IWeeklyRepository } from "./weekly.interface.js";

/**
 * WeeklyRepository — all Prisma queries for the weekly planner module.
 *
 */

class WeeklyRepository implements IWeeklyRepository {
  async upsertPlan(userId: string, weekStart: string) {
    return prisma.weeklyPlan.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      create: { userId, weekStart },
      update: {},
    });
  }

  async getPlan(userId: string, weekStart: string) {
    return prisma.weeklyPlan.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
      include: {
        weeklyTasks: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  async createTask(data: {
    weeklyPlanId: string;
    title: string;
    description?: string | null;
    day: string;
    priority: string;
    category: string;
    duration: number;
    startTime?: string | null;
    repeatWeekly?: boolean;
    sourceTaskId?: string | null;
  }) {
    return prisma.weeklyTask.create({ data });
  }

  async updateTask(
    taskId: string,
    data: Partial<{
      title: string;
      description: string | null;
      day: string;
      priority: string;
      category: string;
      duration: number;
      startTime: string;
      repeatWeekly: boolean;
      sourceTaskId: string | null;
      completed: boolean;
    }>,
  ) {
    return prisma.weeklyTask.update({ where: { id: taskId }, data });
  }

  async getTaskById(taskId: string) {
    return prisma.weeklyTask.findUnique({ where: { id: taskId } });
  }

  /** Used to verify a weekly plan belongs to a given user (ownership checks). */
  async planExistsForUser(planId: string, userId: string): Promise<boolean> {
    const plan = await prisma.weeklyPlan.findFirst({
      where: { id: planId, userId },
      select: { id: true },
    });

    return plan !== null;
  }

  async deleteTask(taskId: string) {
    await prisma.weeklyTask.delete({ where: { id: taskId } });
  }

  async findRecurringTasksForUser(
    userId: string,
    beforeOrOnWeekStart?: string,
  ) {
    return prisma.weeklyTask.findMany({
      where: {
        repeatWeekly: true,
        weeklyPlan: {
          userId,
          ...(beforeOrOnWeekStart
            ? { weekStart: { lte: beforeOrOnWeekStart } }
            : {}),
        },
      },
      include: {
        weeklyPlan: {
          select: { weekStart: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}

export default new WeeklyRepository();
