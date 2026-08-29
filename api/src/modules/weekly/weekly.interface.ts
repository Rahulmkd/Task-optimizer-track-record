import { WeeklyPlan, WeeklyTask } from "@prisma/client";

/**
 * A WeeklyPlan row joined with all its WeeklyTask children.
 * Returned by every read operation so callers always have the full tree.
 */
export type WeeklyPlanWithTasks = WeeklyPlan & {
  weeklyTasks: WeeklyTask[];
};

export interface IWeeklyRepository {
  /** Find or create the plan for a given user + weekStart date. */
  upsertPlan(userId: string, weekStart: string): Promise<WeeklyPlan>;

  /** Get the full plan (with tasks) for a user + weekStart. */
  getPlan(
    userId: string,
    weekStart: string,
  ): Promise<WeeklyPlanWithTasks | null>;

  /** Create a new task inside an existing plan. */
  createTask(data: {
    weeklyPlanId: string;
    title: string;
    day: string;
    priority: string;
    category: string;
    duration: number;
  }): Promise<WeeklyTask>;

  /** Update fields on an existing weekly task. */
  updateTask(
    taskId: string,
    data: Partial<{
      title: string;
      day: string;
      priority: string;
      category: string;
      duration: number;
      completed: boolean;
    }>,
  ): Promise<WeeklyTask>;

  /** Find a single weekly task by id. */
  getTaskById(taskId: string): Promise<WeeklyTask | null>;

  /** Whether the given plan id belongs to the given user. */
  planExistsForUser(planId: string, userId: string): Promise<boolean>;

  /** Hard-delete a weekly task. */
  deleteTask(taskId: string): Promise<void>;
}
