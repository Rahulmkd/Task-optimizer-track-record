import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { saveJournalSchema } from "./ai.schema.js";
import aiController from "./ai.controller.js";

/**
 * AI routes — all require an authenticated user (verifyUser middleware).
 *
 * POST /api/v1/ai/journal    — generate today's productivity journal (preview only, not saved)
 * POST /api/v1/ai/save       — persist a generated journal entry for today
 * GET  /api/v1/ai/journals   — fetch full journal history (newest first)
 */
const router = Router();

router.use(verifyUser);

router.post("/journal", aiController.generateJournal);
router.post("/save", validate(saveJournalSchema), aiController.saveJournal);
router.get("/journals", aiController.getAllJournals);

export default router;
