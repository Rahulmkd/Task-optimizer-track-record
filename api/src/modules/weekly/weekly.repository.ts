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

  async bulkCreateTasks(
    weeklyPlanId: string,
    tasks: Array<{
      title: string;
      description?: string | null;
      day: string;
      priority: string;
      category: string;
      duration: number;
      startTime?: string | null;
      repeatWeekly?: boolean;
      completed?: boolean;
    }>,
  ) {
    if (!tasks.length) return 0;
    const records = tasks.map((t) => ({
      weeklyPlanId,
      title: t.title,
      description: t.description ?? null,
      day: t.day,
      priority: t.priority ?? "MEDIUM",
      category: t.category ?? "General",
      duration: t.duration ?? 60,
      startTime: t.startTime ?? "09:00 AM",
      repeatWeekly: t.repeatWeekly ?? true,
      completed: t.completed ?? false,
    }));

    const result = await prisma.weeklyTask.createMany({
      data: records,
    });
    return result.count;
  }

  async deleteTasksByPlanId(weeklyPlanId: string) {
    const result = await prisma.weeklyTask.deleteMany({
      where: { weeklyPlanId },
    });
    return result.count;
  }

  async deletePlan(userId: string, weekStart: string) {
    const result = await prisma.weeklyPlan.deleteMany({
      where: { userId, weekStart },
    });
    return result.count > 0;
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
