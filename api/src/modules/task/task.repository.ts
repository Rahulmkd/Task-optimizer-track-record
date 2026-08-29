import { prisma } from "../../lib/prisma.js";
import { getTodayRange } from "../../utils/date.helper.js";
import { ITaskRepository } from "./task.interface.js";

export class TaskRepository implements ITaskRepository {
  async createTask(data: {
    userId: string;
    title: string;
    time?: string | null;
    actionId?: string | null;
  }) {
    return prisma.task.create({ data });
  }

  /** Returns today's tasks for the user, in the app's configured timezone. */
  async getTasksByUserId(userId: string) {
    const { start, end } = getTodayRange();

    return prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: start, lt: end },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getTaskById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  async updateTask(
    taskId: string,
    data: Partial<{
      title: string;
      time: string | null;
      completed: boolean;
      actionId: string | null;
    }>,
  ) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteTask(taskId: string) {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}
