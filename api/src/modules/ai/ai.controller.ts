import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import aiService from "./ai.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

/**
 * AIController — HTTP handlers for AI-powered features.
 *
 * All handlers use catchAsync so unhandled rejections are forwarded to
 * the global error middleware automatically.
 */
class AIController {
  /**
   * POST /api/v1/ai/journal
   * Generate a daily productivity journal for the authenticated user.
   * Reads today's tasks, sends them to the AI, persists the result, and
   * returns the full DTO including the transient suggestion.
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

  /**
   * GET /api/v1/ai/journals
   * Return all journal entries for the authenticated user, newest first.
   * Used by the Analytics / Journal history page.
   * `suggestion` is null for all history records (never persisted).
   */
  getAllJournals = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await aiService.getAllJournals(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journals fetched successfully.",
      data: result,
    });
  });
}

export default new AIController();
