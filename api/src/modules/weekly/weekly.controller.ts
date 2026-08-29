import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import weeklyService from "./weekly.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getParamId, getUserId } from "../../utils/request.helper.js";
import { GetWeeklyPlanDTO } from "./weekly.schema.js";

class WeeklyController {
  /**
   * GET /api/v1/weekly?weekStart=2026-07-20
   * weekStart is validated by the `validate` middleware (query mode)
   * before this handler runs — see weekly.routes.ts.
   */
  getPlan = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { weekStart } = req.query as unknown as GetWeeklyPlanDTO;

    const result = await weeklyService.getOrCreatePlan(userId, weekStart);

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
    const userId = getUserId(req);
    const result = await weeklyService.createTask(userId, req.body);

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
    const userId = getUserId(req);
    const taskId = getParamId(req);

    const result = await weeklyService.updateTask(userId, taskId, req.body);

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
    const userId = getUserId(req);
    const taskId = getParamId(req);

    const result = await weeklyService.toggleTask(userId, taskId);

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
    const userId = getUserId(req);
    const taskId = getParamId(req);

    await weeklyService.deleteTask(userId, taskId);

    sendResponse(res, 200, {
      success: true,
      message: "Weekly task deleted successfully.",
    });
  });
}

export default new WeeklyController();
