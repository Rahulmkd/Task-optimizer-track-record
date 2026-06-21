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

    return toActionResponse(action);
  }

  async getActionsForUser(userId: string) {
    const action = await this.actionRepo.getActionsByUserId(userId);

    return toActionListResponse(action);
  }

  async getActionById(userId: string, actionId: string) {
    const action = await this.actionRepo.getActionById(actionId);

    if (!action) {
      throw new AppError("Action not found", 404);
    }

    // ensure a user can't read another user's task by id.
    if (action.userId !== userId) {
      throw new AppError("Task not found", 404);
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

    const updateAction = await this.actionRepo.updateAction(actionId, data);
    return toActionResponse(updateAction);
  }

  async deleteAction(userId: string, actionId: string) {
    const existingAction = await this.actionRepo.getActionById(actionId);

    if (!existingAction) {
      throw new AppError("Action not found", 404);
    }

    if (existingAction.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

    await this.actionRepo.deleteAction(actionId);
    return true;
  }
}
