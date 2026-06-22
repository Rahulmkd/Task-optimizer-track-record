import { AppError } from "../../utils/AppError.js";
import { IActionRepository } from "./action.interface.js";
import { toActionListResponse, toActionResponse } from "./action.mapper.js";
import { createActionDTO, updateActionDTO } from "./action.schema.js";

export class ActionService {
  constructor(private actionRepo: IActionRepository) {}

  async createAction(userId: string, data: createActionDTO) {
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
    const action = await this.actionRepo.getActionById(actionId);

    if (!action) {
      throw new AppError("Action not found", 404);
    }

    // ensure a user can't read another user's action by id.
    if (action.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

    return toActionResponse(action);
  }

  async updateAction(userId: string, actionId: string, data: updateActionDTO) {
    const existingAction = await this.actionRepo.getActionById(actionId);

    if (!existingAction) {
      throw new AppError("Action not found", 404);
    }

    if (existingAction.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

    const updatedAction = await this.actionRepo.updateAction(actionId, data);

    return toActionResponse(updatedAction, existingAction._count.tasks);
  }

  async deleteAction(userId: string, actionId: string) {
    const existingAction = await this.actionRepo.getActionById(actionId);

    if (!existingAction) {
      throw new AppError("Action not found", 404);
    }

    if (existingAction.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

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
}
