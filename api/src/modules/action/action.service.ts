import { AppError } from "../../utils/AppError.js";
import { ActionWithTaskCount, IActionRepository } from "./action.interface.js";
import { toActionListResponse, toActionResponse } from "./action.mapper.js";
import { CreateActionDTO, UpdateActionDTO } from "./action.schema.js";

export class ActionService {
  constructor(private actionRepo: IActionRepository) {}

  async createAction(userId: string, data: CreateActionDTO) {
    const { actionName } = data;

    const action = await this.actionRepo.createAction({
      userId,
      actionName,
    });

    // A freshly created action never has tasks yet.
    return toActionResponse(action, 0);
  }

  async getActionsForUser(userId: string) {
    const actions = await this.actionRepo.getActionsByUserId(userId);

    return toActionListResponse(actions);
  }

  async getActionById(userId: string, actionId: string) {
    const action = await this.assertOwnership(userId, actionId);

    return toActionResponse(action);
  }

  async updateAction(userId: string, actionId: string, data: UpdateActionDTO) {
    const existingAction = await this.assertOwnership(userId, actionId);

    const updatedAction = await this.actionRepo.updateAction(actionId, data);

    return toActionResponse(updatedAction, existingAction._count.tasks);
  }

  async deleteAction(userId: string, actionId: string) {
    const existingAction = await this.assertOwnership(userId, actionId);

    const taskCount = existingAction._count.tasks;

    if (taskCount > 0) {
      throw new AppError(
        `Cannot delete "${existingAction.actionName}" — it still has ${taskCount} task${taskCount === 1 ? "" : "s"} attached. Remove or reassign them first.`,
        409,
      );
    }
    await this.actionRepo.deleteAction(actionId);
    return true;
  }

  /**
   * Shared ownership guard used by every read/mutation. Returns 404 (not
   * 403) whether the action is missing or belongs to someone else, so a
   * caller can't distinguish "doesn't exist" from "not yours" and enumerate
   * other users' action ids.
   */

  private async assertOwnership(
    userId: string,
    actionId: string,
  ): Promise<ActionWithTaskCount> {
    const action = await this.actionRepo.getActionById(actionId);

    if (!action || action.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

    return action;
  }
}
