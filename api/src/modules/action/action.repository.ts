import { prisma } from "../../lib/prisma.js";
import { IActionRepository } from "./action.interface.js";

export class ActionRepository implements IActionRepository {
  async createAction(data: { userId: string; actionName: string }) {
    const action = await prisma.action.create({ data });
    return action;
  }

  async getActionsByUserId(userId: string) {
    const action = await prisma.action.findMany({
      where: { userId },
    });

    return action;
  }

  async getActionById(actionId: string) {
    const action = await prisma.action.findUnique({
      where: { id: actionId },
    });
    return action;
  }

  async updateAction(
    actionId: string,
    data: Partial<{
      userId: string;
      actionName: string;
    }>,
  ) {
    const action = await prisma.action.update({
      where: { id: actionId },
      data,
    });

    return action;
  }

  async deleteAction(actionId: string) {
    await prisma.action.delete({
      where: { id: actionId },
    });
  }
}
