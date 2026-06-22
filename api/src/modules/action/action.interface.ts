import { Action } from "@prisma/client";

export type ActionWithTaskCount = Action & { _count: { tasks: number } };

export interface IActionRepository {
  createAction(data: { userId: string; actionName: string }): Promise<Action>;

  getActionsByUserId(userId: string): Promise<ActionWithTaskCount[]>;

  getActionById(actionId: string): Promise<ActionWithTaskCount | null>;

  updateAction(
    actionId: string,

    data: Partial<{
      actionName: string;
    }>,
  ): Promise<Action>;

  countTasksForAction(actionId: string): Promise<number>;

  deleteAction(actionId: string): Promise<void>;
}
