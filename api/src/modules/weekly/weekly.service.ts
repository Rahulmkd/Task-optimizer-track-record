import { AppError } from "../../utils/AppError.js";
import { WeeklyMapper } from "./weekly.mapper.js";
import weeklyRepository from "./weekly.repository.js";
import { CreateWeeklyTaskDTO, UpdateWeeklyTaskDTO } from "./weekly.schema.js";

/**
 * WeeklyService — business logic for the weekly planner.
 */
class WeeklyService {
  /** Ensure a plan exists for the week, then return the full plan+tasks. */
  async getOrCreatePlan(userId: string, weekStart: string) {
    await weeklyRepository.upsertPlan(userId, weekStart);

    const plan = await weeklyRepository.getPlan(userId, weekStart);

    if (!plan) throw new AppError("Weekly plan not found", 404);

    return WeeklyMapper.toPlanResponse(plan);
  }

  async createTask(userId: string, data: CreateWeeklyTaskDTO) {
    const { weekStart, ...taskData } = data;

    const plan = await weeklyRepository.upsertPlan(userId, weekStart);

    const task = await weeklyRepository.createTask({
      weeklyPlanId: plan.id,
      ...taskData,
    });

    return WeeklyMapper.toTaskResponse(task);
  }

  /** Assert ownership then update the task. */
  async updateTask(userId: string, taskId: string, data: UpdateWeeklyTaskDTO) {
    await this.assertOwnership(userId, taskId);

    const updated = await weeklyRepository.updateTask(taskId, data);

    return WeeklyMapper.toTaskResponse(updated);
  }

  /** Assert ownership then flip the completed flag. */
  async toggleTask(userId: string, taskId: string) {
    const existing = await this.assertOwnership(userId, taskId);

    const updated = await weeklyRepository.updateTask(taskId, {
      completed: !existing.completed,
    });

    return WeeklyMapper.toTaskResponse(updated);
  }

  /** Assert ownership then hard-delete. */
  async deleteTask(userId: string, taskId: string) {
    await this.assertOwnership(userId, taskId);

    await weeklyRepository.deleteTask(taskId);

    return true;
  }

  /**
   * Shared ownership guard used by every mutation.
   */
  private async assertOwnership(userId: string, taskId: string) {
    const task = await weeklyRepository.getTaskById(taskId);

    if (!task) throw new AppError("Weekly task not found", 404);

    const belongsToUser = await weeklyRepository.planExistsForUser(
      task.weeklyPlanId,
      userId,
    );

    if (!belongsToUser) throw new AppError("Weekly task not found", 404);

    return task;
  }
}

export default new WeeklyService();
