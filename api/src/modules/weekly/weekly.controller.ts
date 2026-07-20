import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import weeklyService from "./weekly.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

class WeeklyController {
  /**
   * GET /api/v1/weekly?weekStart=2026-07-20
   */
  getPlan = catchAsync(async (req: Request, res: Response) => {
    const { weekStart } = req.query as { weekStart: string };
    const result = await weeklyService.getOrCreatePlan(req.user.id, weekStart);

    sendResponse(res, 200, {
      success: true,
      message: "Weekly plan fetched successfully.",
      data: result,
    });
  });

  /**
   * POST /api/v1/weekly/tasks
   * Create a new task, auto-creating the week plan if needed.
   */
  createTask = catchAsync(async (req: Request, res: Response) => {
    const result = await weeklyService.createTask(req.user.id, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Weekly task created successfully.",
      data: result,
    });
  });

  /**
   * PATCH /api/v1/weekly/tasks/:id
   * Update any fields on a task (including completed).
   */
  updateTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = req.params.id as string;
    const result = await weeklyService.updateTask(
      req.user.id,
      taskId,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Weekly task updated successfully.",
      data: result,
    });
  });

  /**
   * PATCH /api/v1/weekly/tasks/:id/toggle
   * Flip the completed flag.
   */
  toggleTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = req.params.id as string;
    const result = await weeklyService.toggleTask(req.user.id, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Weekly task status updated.",
      data: result,
    });
  });

  /**
   * DELETE /api/v1/weekly/tasks/:id
   * Hard-delete a task.
   */
  deleteTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = req.params.id as string;
    await weeklyService.deleteTask(req.user.id, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Weekly task deleted successfully.",
    });
  });
}

export default new WeeklyController();
