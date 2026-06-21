import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createActionSchema, updateActionSchema } from "./action.schema.js";
import {
  createActionController,
  deleteActionController,
  getActionByIdController,
  getActionsController,
  updateActionController,
} from "./action.controller.js";

const router = express.Router();

// All task routes require an authenticated user
router.use(verifyUser);

router
  .route("/")
  .post(validate(createActionSchema), createActionController)
  .get(getActionsController);

router
  .route("/:id")
  .get(getActionByIdController)
  .patch(validate(updateActionSchema), updateActionController)
  .delete(deleteActionController);

export default router;
