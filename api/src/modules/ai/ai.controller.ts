import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import aiService from "./ai.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

class AIController {
  /**
   * Generates a daily productivity journal for the authenticated user.
   * Responds with the full journal DTO including the AI-generated suggestion.
   */
  generateJournal = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await aiService.generateJournal(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journal generated successfully.",
      data: result,
    });
  });
}

export default new AIController();
