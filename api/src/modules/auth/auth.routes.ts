import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateProfileSchema,
} from "./auth.schema.js";
import {
  deleteAccountController,
  getCurrentUserController,
  loginUserController,
  logoutAllDevicesController,
  logoutController,
  refreshTokenController,
  registerUserController,
  updateProfileController,
} from "./auth.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginUserController);

router
  .route("/me")
  .get(verifyUser, getCurrentUserController)
  .patch(verifyUser, validate(updateProfileSchema), updateProfileController)
  .delete(verifyUser, deleteAccountController);

router
  .route("/profile")
  .patch(verifyUser, validate(updateProfileSchema), updateProfileController);

router.route("/delete-account").delete(verifyUser, deleteAccountController);

router.route("/logout").post(verifyUser, logoutController);

router
  .route("/logout-all-devices")
  .post(verifyUser, logoutAllDevicesController);

router.route("/refresh-token").post(refreshTokenController);

export default router;
