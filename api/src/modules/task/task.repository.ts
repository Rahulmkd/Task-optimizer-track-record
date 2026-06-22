import { prisma } from "../../lib/prisma.js";
import { ITaskRepository } from "./task.interface.js";

export class TaskRepository implements ITaskRepository {
  async createTask(data: {
    userId: string;
    title: string;
    time?: string | null;
    actionId?: string | null;
  }) {
    const task = await prisma.task.create({
      data,
    });

    return task;
  }

  async getTasksByUserId(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return tasks;
  }

  async getTaskById(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    return task;
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
    const task = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return task;
  }

  async deleteTask(taskId: string) {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}
