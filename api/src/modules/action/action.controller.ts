import { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/CatchAsync.js";
import { actionService } from "./action.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const getParamId = (req: Request): string => {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new AppError("Invalid action id", 400);
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

export const createActionController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await actionService.createAction(req.user.id, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Action created successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET ALL TASKS                                 */
/* -------------------------------------------------------------------------- */

export const getActionsController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const result = await actionService.getActionsForUser(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Action fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET TASK BY ID                                */
/* -------------------------------------------------------------------------- */

export const getActionByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const actionId = getParamId(req);
    const userId = getUserId(req);

    const result = await actionService.getActionById(userId, actionId);

    sendResponse(res, 200, {
      success: true,
      message: "Action fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                 UPDATE TASK                                */
/* -------------------------------------------------------------------------- */

export const updateActionController = catchAsync(
  async (req: Request, res: Response) => {
    const actionId = getParamId(req);
    const userId = getUserId(req);

    const result = await actionService.updateAction(userId, actionId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Action updated successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                 DELETE TASK                                */
/* -------------------------------------------------------------------------- */

export const deleteActionController = catchAsync(
  async (req: Request, res: Response) => {
    const actionId = getParamId(req);
    const userId = getUserId(req);

    await actionService.deleteAction(userId, actionId);

    sendResponse(res, 200, {
      success: true,
      message: "Action deleted successfully",
    });
  },
);
