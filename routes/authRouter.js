import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeUserSubscription,
  updateAvatar,
  verifyUser,
  resendVerificationEmail,
} from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  loginUserSchema,
  subscriptionUserSchema,
  resendVerificationSchema,
} from "../schemas/usersSchemas.js";
import { passportConfig } from "../middleware/passportConfig.js";
import { upload } from "../middleware/fileUploadConfig.js";
import isEmptyBody from "../middleware/bodyValidator.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), registerUser);

authRouter.post("/login", validateBody(loginUserSchema), loginUser);

authRouter.post("/logout", passportConfig.authenticate, logoutUser);

authRouter.post("/current", passportConfig.authenticate, currentUser);

authRouter.patch(
  "/subscription",
  validateBody(subscriptionUserSchema),
  passportConfig.authenticate,
  changeUserSubscription
);

authRouter.get("/verify/:verificationToken", verifyUser);

authRouter.post("/verify", validateBody(resendVerificationSchema), resendVerificationEmail);

authRouter.patch("/avatars", passportConfig.authenticate, isEmptyBody, upload.single("avatar"), updateAvatar);

export default authRouter;
