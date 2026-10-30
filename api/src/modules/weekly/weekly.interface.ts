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
    description?: string | null;
    day: string;
    priority: string;
    category: string;
    duration: number;
    startTime?: string | null;
    repeatWeekly?: boolean;
    sourceTaskId?: string | null;
  }): Promise<WeeklyTask>;

  /** Bulk create tasks inside an existing plan. */
  bulkCreateTasks(
    weeklyPlanId: string,
    tasks: Array<{
      title: string;
      description?: string | null;
      day: string;
      priority: string;
      category: string;
      duration: number;
      startTime?: string | null;
      repeatWeekly?: boolean;
      completed?: boolean;
    }>,
  ): Promise<number>;

  /** Delete all tasks inside a weekly plan. */
  deleteTasksByPlanId(weeklyPlanId: string): Promise<number>;

  /** Delete an entire weekly plan (and cascades its tasks). */
  deletePlan(userId: string, weekStart: string): Promise<boolean>;

  /** Update fields on an existing weekly task. */
  updateTask(
    taskId: string,
    data: Partial<{
      title: string;
      description: string | null;
      day: string;
      priority: string;
      category: string;
      duration: number;
      startTime: string;
      repeatWeekly: boolean;
      sourceTaskId: string | null;
      completed: boolean;
    }>,
  ): Promise<WeeklyTask>;

  /** Find a single weekly task by id. */
  getTaskById(taskId: string): Promise<WeeklyTask | null>;

  /** Whether the given plan id belongs to the given user. */
  planExistsForUser(planId: string, userId: string): Promise<boolean>;

  /** Hard-delete a weekly task. */
  deleteTask(taskId: string): Promise<void>;

  /** Find all recurring tasks for a user created on or before a given weekStart. */
  findRecurringTasksForUser(
    userId: string,
    beforeOrOnWeekStart?: string,
  ): Promise<(WeeklyTask & { weeklyPlan: { weekStart: string } })[]>;
}
