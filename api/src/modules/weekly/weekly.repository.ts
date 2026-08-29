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
    day: string;
    priority: string;
    category: string;
    duration: number;
  }) {
    return prisma.weeklyTask.create({ data });
  }

  async updateTask(
    taskId: string,
    data: Partial<{
      title: string;
      day: string;
      priority: string;
      category: string;
      duration: number;
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
}

export default new WeeklyRepository();
