import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import aiService from "./ai.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

class AIController {
  /* -------------------------------------------------------------------------- */
  /*                               CREATE DAILY JOURNAL                        */
  /* ------------------------------------------------------------------------ */

  generateJournal = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await aiService.generateJournal(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Journal generated successfully.",
      data: result,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                              GET ALL JOURNALS                              */
  /* -------------------------------------------------------------------------- */

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
