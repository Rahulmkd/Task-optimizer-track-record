import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import aiService from "./ai.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { SaveJournalDTO } from "./ai.schema.js";

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

  saveJournal = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body as SaveJournalDTO;

    const result = await aiService.saveJournal(userId, data);

    sendResponse(res, 200, {
      success: true,
      message: "Journal save in Database successfully.",
      data: result,
    });
  });

  /**
   * GET /api/v1/ai/journals
   * Return all journal entries for the authenticated user, newest first.
   * Used by the Analytics / Journal history page.
   */
  getAllJournals = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await aiService.getAllJournals(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journals fetched from Database successfully.",
      data: result,
    });
  });
}

export default new AIController();
