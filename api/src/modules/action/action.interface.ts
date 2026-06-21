import { Action } from "@prisma/client";

export interface IActionRepository {
  createAction(data: { userId: string; actionName: string }): Promise<Action>;

  getActionsByUserId(userId: string): Promise<Action[]>;

  getActionById(actionId: string): Promise<Action | null>;

  updateAction(
    actionId: string,
    data: Partial<{
      userId: string | null;
      actionName: string;
      completed: boolean;
    }>,
  ): Promise<Action>;

  deleteAction(actionId: string): Promise<void>;
}
