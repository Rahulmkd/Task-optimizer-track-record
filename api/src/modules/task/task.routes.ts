import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTasksController,
  toggleTaskController,
  updateTaskController,
} from "./task.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All task routes require an authenticated user
router.use(verifyUser);

router
  .route("/")

  .get(getTasksController);

router
  .route("/:id")
  .post(validate(createTaskSchema), createTaskController)
  .get(getTaskByIdController)
  .patch(validate(updateTaskSchema), updateTaskController)
  .delete(deleteTaskController);

router.route("/:id/toggle").patch(toggleTaskController);

export default router;
