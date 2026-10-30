import { WeeklyTask } from "@prisma/client";
import { WeeklyPlanWithTasks } from "./weekly.interface.js";
import {
  WeeklyPlanResponseDTO,
  WeeklyTaskResponseDTO,
} from "./weekly.response.js";
import { minutesToTime12, parseTimeToMinutes } from "./weekly.time.js";

/**
 * WeeklyMapper — converts Prisma model instances into clean API response DTOs.
 */
export class WeeklyMapper {
  static toTaskResponse(task: WeeklyTask): WeeklyTaskResponseDTO {
    const startTime = task.startTime ?? "09:00 AM";
    const startMins = parseTimeToMinutes(startTime);
    const endMins = startMins + (task.duration || 60);
    const endTime = minutesToTime12(endMins);

    return {
      id: task.id,
      weeklyPlanId: task.weeklyPlanId,
      title: task.title,
      description: task.description ?? null,
      day: task.day,
      priority: task.priority,
      category: task.category,
      duration: task.duration,
      startTime,
      endTime,
      repeatWeekly: task.repeatWeekly ?? false,
      sourceTaskId: task.sourceTaskId ?? null,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static toPlanResponse(plan: WeeklyPlanWithTasks): WeeklyPlanResponseDTO {
    const tasks = plan.weeklyTasks.map(WeeklyMapper.toTaskResponse);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const progressPercent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      id: plan.id,
      userId: plan.userId,
      weekStart: plan.weekStart,
      tasks,
      stats: { total, completed, pending, progressPercent },
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
