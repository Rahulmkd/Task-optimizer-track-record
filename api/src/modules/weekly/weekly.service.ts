import { AppError } from "../../utils/AppError.js";
import { WeeklyMapper } from "./weekly.mapper.js";
import weeklyRepository from "./weekly.repository.js";
import { CreateWeeklyTaskDTO, UpdateWeeklyTaskDTO } from "./weekly.schema.js";

/**
 * WeeklyService — business logic for the weekly planner.
 */
class WeeklyService {
  /** Ensure a plan exists for the week, sync recurring tasks, then return the full plan+tasks. */
  async getOrCreatePlan(userId: string, weekStart: string) {
    const plan = await weeklyRepository.upsertPlan(userId, weekStart);

    // Sync recurring tasks from prior weeks into this week without duplicates
    await this.syncRecurringTasks(userId, weekStart, plan.id);

    const fullPlan = await weeklyRepository.getPlan(userId, weekStart);

    if (!fullPlan) throw new AppError("Weekly plan not found", 404);

    return WeeklyMapper.toPlanResponse(fullPlan);
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
   * Syncs recurring tasks from prior weeks to target week without duplicates.
   */
  private async syncRecurringTasks(
    userId: string,
    targetWeekStart: string,
    targetPlanId: string,
  ) {
    const recurringTasks = await weeklyRepository.findRecurringTasksForUser(
      userId,
      targetWeekStart,
    );

    if (!recurringTasks.length) return;

    // Filter to tasks from weeks strictly before targetWeekStart
    const priorRecurring = recurringTasks.filter(
      (t) => t.weeklyPlan.weekStart < targetWeekStart,
    );

    if (!priorRecurring.length) return;

    // Group by rootId (sourceTaskId or task.id) to select the latest version
    const rootMap = new Map<string, (typeof priorRecurring)[0]>();
    for (const task of priorRecurring) {
      const rootId = task.sourceTaskId || task.id;
      const existing = rootMap.get(rootId);
      if (!existing || new Date(task.updatedAt) > new Date(existing.updatedAt)) {
        rootMap.set(rootId, task);
      }
    }

    // Check existing tasks in target week plan to avoid any duplicate creation
    const currentPlan = await weeklyRepository.getPlan(userId, targetWeekStart);
    const existingTasks = currentPlan?.weeklyTasks ?? [];

    for (const [rootId, template] of rootMap.entries()) {
      if (!template.repeatWeekly) continue;

      const alreadyScheduled = existingTasks.some(
        (t) =>
          t.id === rootId ||
          t.sourceTaskId === rootId ||
          (t.title === template.title &&
            t.day === template.day &&
            t.startTime === template.startTime),
      );

      if (!alreadyScheduled) {
        await weeklyRepository.createTask({
          weeklyPlanId: targetPlanId,
          title: template.title,
          description: template.description,
          day: template.day,
          priority: template.priority,
          category: template.category,
          duration: template.duration,
          startTime: template.startTime,
          repeatWeekly: true,
          sourceTaskId: rootId,
        });
      }
    }
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
