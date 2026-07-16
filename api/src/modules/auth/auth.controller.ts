import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";
import { AppError } from "../../utils/AppError.js";

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.registerUserService(req.body);

    setCookies(res, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully.",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                              GET CURRENT USER                              */
/* -------------------------------------------------------------------------- */

export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.getCurrentUser(req.user.id);

    sendResponse(res, 200, {
      success: true,
      message: "User details fetched successfully",
      data: result,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                   LOGOUT                                   */
/* -------------------------------------------------------------------------- */

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout({ refreshToken });
    }

    destroyCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "User logged out successfully",
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                             LOGOUT ALL DEVICES                             */
/* -------------------------------------------------------------------------- */

export const logoutAllDevices = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    await authService.logoutAllDevices(userId);

    destroyCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "User logged out of all devices",
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                               REFRESH TOKEN                                */
/* -------------------------------------------------------------------------- */

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 403);
    }

    const result = await authService.refreshToken({ refreshToken });

    // Rotate refresh token
    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  },
);
