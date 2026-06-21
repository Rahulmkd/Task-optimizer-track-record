import { AppError } from "../../utils/AppError.js";
import { ITaskRepository } from "./task.interface.js";
import { toTaskListResponse, toTaskResponse } from "./task.mapper.js";
import { createTaskDTO, updateTaskDTO } from "./task.schema.js";

export class TaskService {
  constructor(private taskRepo: ITaskRepository) {}

  async createTask(userId: string, actionId: string, data: createTaskDTO) {
    const { title, time } = data;

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
    const task = await this.taskRepo.getTaskById(taskId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // ensure a user can't read another user's task by id.
    if (task.userId !== userId) {
      throw new AppError("Task not found", 404);
    }

    return toTaskResponse(task);
  }

  async updateTask(userId: string, taskId: string, data: updateTaskDTO) {
    const existingTask = await this.taskRepo.getTaskById(taskId);

    if (!existingTask) {
      throw new AppError("Task not found", 404);
    }

    if (existingTask.userId !== userId) {
      throw new AppError("Task not found", 404);
    }

    const updatedTask = await this.taskRepo.updateTask(taskId, data);

    return toTaskResponse(updatedTask);
  }

  async toggleTaskCompletion(userId: string, taskId: string) {
    const existingTask = await this.taskRepo.getTaskById(taskId);

    if (!existingTask) {
      throw new AppError("Task not found", 404);
    }

    if (existingTask.userId !== userId) {
      throw new AppError("Task not found", 404);
    }

    const updatedTask = await this.taskRepo.updateTask(taskId, {
      completed: !existingTask.completed,
    });

    return toTaskResponse(updatedTask);
  }

  async deleteTask(userId: string, taskId: string) {
    const existingTask = await this.taskRepo.getTaskById(taskId);

    if (!existingTask) {
      throw new AppError("Task not found", 404);
    }

    if (existingTask.userId !== userId) {
      throw new AppError("Task not found", 404);
    }

    await this.taskRepo.deleteTask(taskId);

    return true;
  }
}
