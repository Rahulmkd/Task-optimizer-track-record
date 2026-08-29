import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createWeeklyTaskSchema,
  getWeeklyPlanSchema,
  updateWeeklyTaskSchema,
} from "./weekly.schema.js";
import weeklyController from "./weekly.controller.js";

/**
 * Weekly planner routes — all require an authenticated user.
 *
 * GET    /api/v1/weekly?weekStart=YYYY-MM-DD  — get/create plan for a week
 * POST   /api/v1/weekly/tasks                  — add a task to a week
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
