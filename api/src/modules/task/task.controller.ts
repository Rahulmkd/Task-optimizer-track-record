import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { taskService } from "./task.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getParamId, getUserId } from "../../utils/request.helper.js";

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
