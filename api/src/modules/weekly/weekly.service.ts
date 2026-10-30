import { AppError } from "../../utils/AppError.js";
import { WeeklyMapper } from "./weekly.mapper.js";
import weeklyRepository from "./weekly.repository.js";
import {
  AITaskItem,
  aiWeeklyPlanResponseSchema,
  BulkSaveWeeklyTasksDTO,
  CreateWeeklyTaskDTO,
  DAYS,
  GenerateWeeklyPlanDTO,
  UpdateWeeklyTaskDTO,
} from "./weekly.schema.js";
import aiProvider from "../ai/providers/index.js";
import { JsonParser } from "../ai/parsers/json.parser.js";
import { weeklyPlannerPrompt } from "../ai/prompts/weeklyPlanner.prompt.js";
import { calculateDuration } from "./weekly.time.js";

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
   * Generates a preview AI weekly schedule based on user's routine context and instructions.
   * Does NOT persist to DB until explicitly approved.
   */
  async generateAIWeeklyPlan(userId: string, data: GenerateWeeklyPlanDTO) {
    const prompt = weeklyPlannerPrompt(data.routineContext, data.instructions);

    let aiResponse;
    try {
      aiResponse = await aiProvider.invoke(prompt);
    } catch {
      throw new AppError(
        "The AI service is temporarily unavailable. Please try again shortly.",
        502,
      );
    }

    const parsedJson = JsonParser.parse(aiResponse.content.toString());
    const validation = aiWeeklyPlanResponseSchema.safeParse(parsedJson);

    if (!validation.success) {
      throw new AppError(
        "The AI returned an unexpected response structure. Please try again.",
        502,
      );
    }

    const plan = validation.data;

    const normalizeItem = (item: AITaskItem) => {
      const duration =
        item.duration && item.duration > 0
          ? item.duration
          : calculateDuration(item.startTime, item.endTime);

      return {
        title: item.title,
        description: item.description ?? null,
        startTime: item.startTime,
        endTime: item.endTime,
        duration,
        category: item.category || "General",
        priority: item.priority || "MEDIUM",
        repeatWeekly: item.repeatWeekly ?? true,
      };
    };

    const normalizedWeekday = plan.weekdaySchedule.map(normalizeItem);
    const normalizedSaturday = plan.saturdaySchedule.map(normalizeItem);
    const normalizedSunday = plan.sundaySchedule.map(normalizeItem);

    // Expand into individual tasks for MON..SUN
    const weekdays: (typeof DAYS)[number][] = [
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
    ];
    const expandedTasks: Array<
      ReturnType<typeof normalizeItem> & { day: (typeof DAYS)[number] }
    > = [];

    for (const day of weekdays) {
      for (const item of normalizedWeekday) {
        expandedTasks.push({ ...item, day });
      }
    }
    for (const item of normalizedSaturday) {
      expandedTasks.push({ ...item, day: "SAT" });
    }
    for (const item of normalizedSunday) {
      expandedTasks.push({ ...item, day: "SUN" });
    }

    return {
      summary: plan.summary,
      studyRotation: plan.studyRotation ?? null,
      weekdaySchedule: normalizedWeekday,
      saturdaySchedule: normalizedSaturday,
      sundaySchedule: normalizedSunday,
      expandedTasks,
    };
  }

  /**
   * Bulk saves approved weekly tasks into the user's plan.
   */
  async bulkSaveTasks(userId: string, data: BulkSaveWeeklyTasksDTO) {
    const { weekStart, replaceExisting, tasks } = data;

    const plan = await weeklyRepository.upsertPlan(userId, weekStart);

    if (replaceExisting) {
      await weeklyRepository.deleteTasksByPlanId(plan.id);
    }

    // Check existing tasks to prevent exact duplicates
    const currentPlan = await weeklyRepository.getPlan(userId, weekStart);
    const existingTasks = currentPlan?.weeklyTasks ?? [];

    const tasksToCreate = tasks.filter((candidate) => {
      const isDuplicate = existingTasks.some(
        (existing) =>
          existing.day === candidate.day &&
          existing.title.toLowerCase().trim() ===
            candidate.title.toLowerCase().trim() &&
          existing.startTime === candidate.startTime,
      );
      return !isDuplicate;
    });

    if (tasksToCreate.length > 0) {
      await weeklyRepository.bulkCreateTasks(plan.id, tasksToCreate);
    }

    const fullPlan = await weeklyRepository.getPlan(userId, weekStart);
    if (!fullPlan) throw new AppError("Weekly plan not found", 404);

    return WeeklyMapper.toPlanResponse(fullPlan);
  }

  /**
   * Deletes an entire weekly plan for a week.
   */
  async deletePlan(userId: string, weekStart: string) {
    const success = await weeklyRepository.deletePlan(userId, weekStart);
    return { success, message: "Weekly plan deleted successfully" };
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
