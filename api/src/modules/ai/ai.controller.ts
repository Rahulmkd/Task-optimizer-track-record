import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { getUserId } from "../../utils/request.helper.js";
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
   * Generates a daily productivity journal for the authenticated user from
   * today's tasks. This does NOT persist anything — it's a preview the
   * client can discard or send to POST /ai/save to store permanently.
   */
  generateJournal = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const result = await aiService.generateJournal(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journal generated successfully.",
      data: result,
    });
  });

  /**
   * POST /api/v1/ai/save
   * Persists a previously generated journal entry for today.
   */
  saveJournal = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const result = await aiService.saveJournal(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Journal saved successfully.",
      data: result,
    });
  });

  /**
   * GET /api/v1/ai/journals
   * Return all journal entries for the authenticated user, newest first.
   * Used by the Analytics / Journal history page.
   */
  getAllJournals = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const result = await aiService.getAllJournals(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journals fetched successfully.",
      data: result,
    });
  });
}

export default new AIController();
