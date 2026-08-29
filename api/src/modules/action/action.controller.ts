import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { actionService } from "./action.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getParamId, getUserId } from "../../utils/request.helper.js";

/* -------------------------------------------------------------------------- */
/*                                CREATE ACTION                               */
/* -------------------------------------------------------------------------- */

export const createActionController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const result = await actionService.createAction(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Action created successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                               GET ALL ACTIONS                              */
/* -------------------------------------------------------------------------- */

export const getActionsController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const result = await actionService.getActionsForUser(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Actions fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET ACTION BY ID                              */
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
/*                                UPDATE ACTION                               */
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
/*                                DELETE ACTION                               */
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
