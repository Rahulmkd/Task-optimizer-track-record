import { prisma } from "../../lib/prisma.js";
import { IActionRepository } from "./action.interface.js";

export class ActionRepository implements IActionRepository {
  async createAction(data: { userId: string; actionName: string }) {
    const action = await prisma.action.create({ data });
    return action;
  }

  async getActionsByUserId(userId: string) {
    const actions = await prisma.action.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    return actions;
  }

  async getActionById(actionId: string) {
    const action = await prisma.action.findUnique({
      where: { id: actionId },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    return action;
  }

  async updateAction(
    actionId: string,
    data: Partial<{
      actionName: string;
    }>,
  ) {
    const action = await prisma.action.update({
      where: { id: actionId },
      data,
    });

    return action;
  }

  async countTasksForAction(actionId: string) {
    return prisma.task.count({ where: { actionId } });
  }

  async deleteAction(actionId: string) {
    await prisma.action.delete({
      where: { id: actionId },
    });
  }
}
