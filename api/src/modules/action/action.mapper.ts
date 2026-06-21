import { Action } from "@prisma/client";
import { ActionResponseDTO } from "./action.response.js";

export const toActionResponse = (action: Action): ActionResponseDTO => {
  return {
    id: action.id,
    userId: action.userId,
    actionName: action.actionName,
    createdAt: action.createdAt,
    updatedAt: action.updatedAt,
  };
};

export const toActionListResponse = (actions: Action[]): ActionResponseDTO[] =>
  actions.map(toActionResponse);
