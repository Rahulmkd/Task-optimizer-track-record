import { Action } from "@prisma/client";
import { ActionResponseDTO } from "./action.response.js";
import { ActionWithTaskCount } from "./action.interface.js";

export function toActionResponse(
  action: ActionWithTaskCount,
): ActionResponseDTO;
export function toActionResponse(
  action: Action,
  taskCount: number,
): ActionResponseDTO;
export function toActionResponse(
  action: Action | ActionWithTaskCount,
  taskCount?: number,
): ActionResponseDTO {
  const count = taskCount ?? ("_count" in action ? action._count.tasks : 0);

  return {
    id: action.id,
    userId: action.userId,
    actionName: action.actionName,
    taskCount: count,
    createdAt: action.createdAt,
    updatedAt: action.updatedAt,
  };
}

export const toActionListResponse = (
  actions: ActionWithTaskCount[],
): ActionResponseDTO[] => actions.map((action) => toActionResponse(action));
