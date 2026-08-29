import { Task } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { ITaskRepository } from "./task.interface.js";
import { toTaskListResponse, toTaskResponse } from "./task.mapper.js";
import { CreateTaskDTO, UpdateTaskDTO } from "./task.schema.js";
import { IActionRepository } from "../action/action.interface.js";

export class TaskService {
  constructor(
    private taskRepo: ITaskRepository,
    private actionRepo: IActionRepository,
  ) {}

  async createTask(userId: string, data: CreateTaskDTO) {
    const { title, time, actionId } = data;

    if (actionId) {
      await this.assertActionOwnership(userId, actionId);
    }

    const task = await this.taskRepo.createTask({
      userId,
      title,
      time: time ?? null,
      actionId: actionId ?? null,
    });

    return toTaskResponse(task);
  }

  async getTasksForUser(userId: string) {
    const tasks = await this.taskRepo.getTasksByUserId(userId);

    return toTaskListResponse(tasks);
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await this.assertOwnership(userId, taskId);

    return toTaskResponse(task);
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskDTO) {
    await this.assertOwnership(userId, taskId);

    if (data.actionId) {
      await this.assertActionOwnership(userId, data.actionId);
    }

    const updatedTask = await this.taskRepo.updateTask(taskId, data);

    return toTaskResponse(updatedTask);
  }

  async toggleTaskCompletion(userId: string, taskId: string) {
    const existingTask = await this.assertOwnership(userId, taskId);

    const updatedTask = await this.taskRepo.updateTask(taskId, {
      completed: !existingTask.completed,
    });

    return toTaskResponse(updatedTask);
  }

  async deleteTask(userId: string, taskId: string) {
    await this.assertOwnership(userId, taskId);

    await this.taskRepo.deleteTask(taskId);

    return true;
  }

  /**
   * Shared ownership guard used by every read/mutation. Returns 404 (not
   * 403) whether the task is missing or belongs to someone else, so a
   * caller can't distinguish "doesn't exist" from "not yours".
   */
  private async assertOwnership(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepo.getTaskById(taskId);

    if (!task || task.userId !== userId) {
      throw new AppError("Task not found", 404);
    }

    return task;
  }

  private async assertActionOwnership(userId: string, actionId: string) {
    const action = await this.actionRepo.getActionById(actionId);

    if (!action || action.userId !== userId) {
      throw new AppError("Action not found", 404);
    }

    return action;
  }
}
