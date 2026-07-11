import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import aiController from "./ai.controller.js";

/**
 * AI routes — all require an authenticated user (verifyUser middleware).
 */
const router = Router();

router.use(verifyUser);

router.post("/journal", aiController.generateJournal);
router.get("/journals", aiController.getAllJournals);

export default router;
