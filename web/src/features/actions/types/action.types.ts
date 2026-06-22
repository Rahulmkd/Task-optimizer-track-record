export interface IAction {
  id: string;
  userId: string;
  actionName: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mirrors createActionSchema (api/src/modules/action/action.schema.ts)
export interface CreateActionPayload {
  actionName: string;
}

export interface UpdateActionPayload {
  actionName?: string;
}
