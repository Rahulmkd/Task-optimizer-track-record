import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  bulkSaveWeeklyTasksSchema,
  createWeeklyTaskSchema,
  deleteWeeklyPlanSchema,
  generateWeeklyPlanSchema,
  getWeeklyPlanSchema,
  updateWeeklyTaskSchema,
} from "./weekly.schema.js";
import weeklyController from "./weekly.controller.js";

/**
 * Weekly planner routes — all require an authenticated user.
 *
 * GET    /api/v1/weekly?weekStart=YYYY-MM-DD  — get/create plan for a week
 * POST   /api/v1/weekly/generate              — generate AI weekly timetable preview
 * POST   /api/v1/weekly/bulk-save             — approve & save AI/bulk weekly tasks
 * DELETE /api/v1/weekly/plan?weekStart=...    — delete entire plan for a week
 * POST   /api/v1/weekly/tasks                 — add a single task to a week
 * PATCH  /api/v1/weekly/tasks/:id             — update a task
 * PATCH  /api/v1/weekly/tasks/:id/toggle      — toggle completed
 * DELETE /api/v1/weekly/tasks/:id             — delete a task
 */
const router = Router();

router.use(verifyUser);

router.get(
  "/",
  validate(getWeeklyPlanSchema, "query"),
  weeklyController.getPlan,
);

router.post(
  "/generate",
  validate(generateWeeklyPlanSchema),
  weeklyController.generateAIPlan,
);

router.post(
  "/bulk-save",
  validate(bulkSaveWeeklyTasksSchema),
  weeklyController.bulkSaveTasks,
);

router.delete(
  "/plan",
  validate(deleteWeeklyPlanSchema, "query"),
  weeklyController.deletePlan,
);

router.post(
  "/tasks",
  validate(createWeeklyTaskSchema),
  weeklyController.createTask,
);

router.patch("/tasks/:id/toggle", weeklyController.toggleTask);

router.patch(
  "/tasks/:id",
  validate(updateWeeklyTaskSchema),
  weeklyController.updateTask,
);

router.delete("/tasks/:id", weeklyController.deleteTask);

export default router;
