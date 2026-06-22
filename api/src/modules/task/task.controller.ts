import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { taskService } from "./task.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AppError } from "../../utils/AppError.js";

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const getParamId = (req: Request): string => {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new AppError("Invalid task id", 400);
  }

  return id;
};

const getUserId = (req: Request): string => {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  return req.user.id;
};

/* -------------------------------------------------------------------------- */
/*                                 CREATE TASK                                */
/* -------------------------------------------------------------------------- */

export const createTaskController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const result = await taskService.createTask(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Task created successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET ALL TASKS                                 */
/* -------------------------------------------------------------------------- */

export const getTasksController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const result = await taskService.getTasksForUser(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Tasks fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET TASK BY ID                                */
/* -------------------------------------------------------------------------- */

export const getTaskByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const taskId = getParamId(req);
    const userId = getUserId(req);

    const result = await taskService.getTaskById(userId, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Task fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                 UPDATE TASK                                */
/* -------------------------------------------------------------------------- */

export const updateTaskController = catchAsync(
  async (req: Request, res: Response) => {
    const taskId = getParamId(req);
    const userId = getUserId(req);

    const result = await taskService.updateTask(userId, taskId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Task updated successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                            TOGGLE TASK COMPLETION                          */
/* -------------------------------------------------------------------------- */

export const toggleTaskController = catchAsync(
  async (req: Request, res: Response) => {
    const taskId = getParamId(req);
    const userId = getUserId(req);

    const result = await taskService.toggleTaskCompletion(userId, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Task status updated successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                 DELETE TASK                                */
/* -------------------------------------------------------------------------- */

export const deleteTaskController = catchAsync(
  async (req: Request, res: Response) => {
    const taskId = getParamId(req);
    const userId = getUserId(req);

    await taskService.deleteTask(userId, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Task deleted successfully",
    });
  },
);
