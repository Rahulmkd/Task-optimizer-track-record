export interface ITask {
  id: string;
  userId: string;
  actionId: string | null;
  title: string;
  time: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mirrors createTaskSchema (api/src/modules/task/task.schema.ts)
export interface CreateTaskPayload {
  title: string;
  time?: string;
  actionId?: string;
}

// Mirrors updateTaskSchema (api/src/modules/task/task.schema.ts)
export interface UpdateTaskPayload {
  title?: string;
  time?: string;
  completed?: boolean;
  actionId?: string | null;
}

export interface Task {
  id: string | number;
  label: string;
  done: boolean;
  time: string;
}
